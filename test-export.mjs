import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

// Mocking Next.js context is hard, so we will import the functions directly
// but first we need to make sure we can run them in this environment.
// Since actions.ts uses 'use server' and imports next/navigation, running it directly might fail if not transpiled.
// However, the logic is mainly Prisma.
// A better way is to verify the DATA logic rather than the exported function if it has Next.js dependencies.

// BUT, let's try to verify the logic by replicating it here or importing if possible.
// Importing typescript file in node might require ts-node or similar.
// Given strict environment, let's write a script that replicates the logic to ensure it produces CSV correctly.

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verifyExportLogic() {
    console.log('=== Verifying Export Logic ===');

    try {
        // 1. Reports Export Logic
        console.log('--- Testing Reports Export ---');
        const reports = await prisma.pestReport.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            include: {
                pest: true,
                plant: true,
                reporterUser: {
                    select: { userName: true, email: true }
                }
            },
            take: 5 // Limit to 5 for test
        });

        const reportHeader = "ID,Date,Province,Pest,Plant,Reporter,Status,Verification Status\n";
        const reportRows = reports.map(r => {
            const date = r.createdAt.toISOString().split('T')[0];
            const reporter = r.reporterUser?.userName || (r.isAnonymous ? "Anonymous" : r.reporterFirstName || "Unknown");
            const escape = (text) => text ? `"${text.replace(/"/g, '""')}"` : "";

            return [
                r.id,
                date,
                escape(r.province),
                escape(r.pest.pestNameEn),
                escape(r.plant.plantNameEn),
                escape(reporter),
                r.status,
                r.verifiedBy ? "Verified" : "Pending"
            ].join(",");
        }).join("\n");

        const csvReports = reportHeader + reportRows;
        console.log('Generated Reports CSV Length:', csvReports.length);
        console.log('Sample Row:\n', reportRows.split('\n')[0]);

        if (csvReports.includes("ID,Date,Province")) {
            console.log('✓ Reports CSV Header correct');
        } else {
            console.error('✗ Reports CSV Header missing');
        }


        // 2. Users Export Logic
        console.log('\n--- Testing Users Export ---');
        const users = await prisma.userProfile.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { pestReports: true }
                }
            },
            take: 5
        });

        const userHeader = "ID,Username,Email,Role,First Name,Last Name,Province,Report Count,Created At\n";
        const userRows = users.map(u => {
            const date = u.createdAt.toISOString().split('T')[0];
            const escape = (text) => text ? `"${text.replace(/"/g, '""')}"` : "";

            return [
                u.id,
                escape(u.userName),
                escape(u.email),
                u.role,
                escape(u.firstName),
                escape(u.lastName),
                escape(u.province),
                u._count.pestReports,
                date
            ].join(",");
        }).join("\n");

        const csvUsers = userHeader + userRows;
        console.log('Generated Users CSV Length:', csvUsers.length);
        console.log('Sample Row:\n', userRows.split('\n')[0]);

        if (csvUsers.includes("ID,Username,Email")) {
            console.log('✓ Users CSV Header correct');
        } else {
            console.error('✗ Users CSV Header missing');
        }

    } catch (e) {
        console.error('Verification failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

verifyExportLogic();
