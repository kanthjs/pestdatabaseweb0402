import { PrismaClient, ReportStatus, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function testAdminLogic() {
    console.log('=== Testing Admin DB Logic ===');

    // Ensure Plant and Pest exist
    console.log('0. Checking/Creating dependencies...');
    let plant = await prisma.plant.findFirst({ where: { plantId: 'PLT001' } });
    if (!plant) {
        console.log('   Creating PLT001...');
        plant = await prisma.plant.create({
            data: { plantId: 'PLT001', plantNameEn: 'Test Plant' }
        });
    }

    let pest = await prisma.pest.findFirst({ where: { pestId: 'PST001' } });
    if (!pest) {
        console.log('   Creating PST001...');
        pest = await prisma.pest.create({
            data: { pestId: 'PST001', pestNameEn: 'Test Pest' }
        });
    }

    // 1. Create a dummy report
    console.log('1. Creating dummy report...');
    const report = await prisma.pestReport.create({
        data: {
            province: 'Test Province',
            plantId: 'PLT001',
            pestId: 'PST001',
            symptomOnSet: new Date(),
            fieldAffectedArea: 10,
            incidencePercent: 10,
            severityPercent: 10,
            latitude: 0,
            longitude: 0,
            status: ReportStatus.PENDING,
            isAnonymous: true
        }
    });
    console.log(`   Report created: ${report.id}`);

    // 2. Soft Delete
    console.log('2. Testing Soft Delete...');
    await prisma.pestReport.update({
        where: { id: report.id },
        data: { deletedAt: new Date() }
    });

    const deletedReport = await prisma.pestReport.findUnique({
        where: { id: report.id }
    });

    if (deletedReport.deletedAt) {
        console.log('   ✓ Soft delete successful (deletedAt is set)');
    } else {
        console.error('   ✗ Soft delete failed');
    }

    const visibleReports = await prisma.pestReport.count({
        where: { id: report.id, deletedAt: null }
    });
    if (visibleReports === 0) {
        console.log('   ✓ Report is hidden from normal queries');
    } else {
        console.error('   ✗ Report is still visible');
    }

    // 3. Activity Log
    console.log('3. Testing Activity Log...');
    // Find an admin user to link to
    let admin = await prisma.userProfile.findFirst({ where: { role: UserRole.ADMIN } });

    if (!admin) {
        // Create a dummy admin if none exists
        console.log('   Creating dummy admin...');
        admin = await prisma.userProfile.create({
            data: {
                id: 'dummy-admin-test',
                userName: 'TestAdmin',
                email: 'testadmin@example.com',
                role: UserRole.ADMIN,
                expertRequest: 'NONE', // Ensure this matches Enum
            }
        });
    }

    if (admin) {
        const log = await prisma.activityLog.create({
            data: {
                adminId: admin.id,
                action: 'TEST_ACTION',
                entityType: 'REPORT',
                entityId: report.id,
                details: { test: true }
            }
        });
        console.log(`   Activity log created: ${log.id}`);

        const fetchedLog = await prisma.activityLog.findUnique({ where: { id: log.id } });
        if (fetchedLog) {
            console.log('   ✓ Log persistence successful');
        }
    } else {
        console.log('   ⚠ No admin user found, skipping log test');
    }

    // Cleanup
    console.log('Cleaning up...');
    await prisma.pestReport.delete({ where: { id: report.id } }); // Hard delete
    // Logs are kept for audit

    console.log('=== Test Complete ===');
}

testAdminLogic()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
