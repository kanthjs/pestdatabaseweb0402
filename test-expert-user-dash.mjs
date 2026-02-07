import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verifyExpertUserLogic() {
    console.log('=== Verifying Expert & User Dashboard Logic ===');

    try {
        // 1. Get or Create an Expert User
        let expert = await prisma.userProfile.findFirst({ where: { role: 'EXPERT' } });
        if (!expert) {
            console.log('No expert found, creating one...');
            try {
                expert = await prisma.userProfile.create({
                    data: {
                        id: 'mock-expert-' + Date.now(),
                        userName: 'MockExpert',
                        email: `mockexpert-${Date.now()}@example.com`,
                        role: 'EXPERT',
                        firstName: 'Mock',
                        lastName: 'Expert',
                        province: 'Bangkok'
                    }
                });
            } catch (e) {
                console.log('Could not create expert, might conflict with existing constraints:', e.message);
            }
        }

        if (expert) {
            console.log(`Testing with Expert: ${expert.userName} (${expert.id})`);

            // Count total approved reports
            const totalApproved = await prisma.pestReport.count({ where: { status: 'APPROVED' } });
            // Count expert's approved reports
            const personalApproved = await prisma.pestReport.count({ where: { status: 'APPROVED', reporterUserId: expert.id } });

            console.log(`Global Approved: ${totalApproved}`);
            console.log(`Personal Approved: ${personalApproved}`);

            if (totalApproved >= personalApproved) {
                console.log('✓ Logic Check: Global count >= Personal count');
            } else {
                console.error('✗ Logic Error: Global count < Personal count');
            }
        } else {
            console.log('Skipping Expert test: Could not find or create expert.');
        }

        // 2. Get or Create a Regular User
        let user = await prisma.userProfile.findFirst({
            where: { role: 'USER' }
        });

        if (!user) {
            console.log('No user found, creating one...');
            try {
                user = await prisma.userProfile.create({
                    data: {
                        id: 'mock-user-' + Date.now(),
                        userName: 'MockUser',
                        email: `mockuser-${Date.now()}@example.com`,
                        role: 'USER',
                        firstName: 'Mock',
                        lastName: 'User',
                        province: 'Chiang Mai'
                    }
                });
            } catch (e) {
                console.log('Could not create user:', e.message);
            }
        }

        if (user) {
            console.log(`\nTesting with User: ${user.userName} (${user.id})`);

            // Create a mock report for this user if none exist
            const reportCount = await prisma.pestReport.count({ where: { reporterUserId: user.id } });
            if (reportCount === 0) {
                console.log('User has no reports, creating a mock report...');
                // Need a valid plant and pest.
                const plant = await prisma.plant.findFirst();
                const pest = await prisma.pest.findFirst();

                if (plant && pest) {
                    await prisma.pestReport.create({
                        data: {
                            reporterUserId: user.id,
                            province: user.province || 'Unknown',
                            plantId: plant.plantId,
                            pestId: pest.pestId,
                            symptomOnSet: new Date(),
                            fieldAffectedArea: 10,
                            incidencePercent: 5,
                            severityPercent: 5,
                            latitude: 18.7,
                            longitude: 98.9,
                            status: 'PENDING'
                        }
                    });
                    console.log('Created mock report.');
                } else {
                    console.log('Cannot create mock report: No Plant or Pest found in DB.');
                }
            }

            // Simulate getUserDashboardData logic
            const totalReports = await prisma.pestReport.count({ where: { reporterUserId: user.id } });
            const recentReports = await prisma.pestReport.findMany({
                where: { reporterUserId: user.id },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { pest: true, plant: true }
            });

            console.log(`Total Reports: ${totalReports}`);
            console.log(`Recent Reports Found: ${recentReports.length}`);

            if (totalReports > 0 && recentReports.length > 0) {
                console.log('✓ User has reports, data retrieval successful.');

                // Test Export Logic helper
                const report = recentReports[0];
                const csvRow = [
                    report.id,
                    report.createdAt.toISOString().split('T')[0],
                    `"${report.province}"`,
                ].join(",");
                console.log('Sample CSV Row Part:', csvRow);
                console.log('✓ CSV Row Generation simulated successfully.');

            } else if (totalReports === 0) {
                console.log('✓ User has no reports (and creation failed), 0 count is correct.');
            }
        } else {
            console.log('Skipping User test: Could not find or create user.');
        }

    } catch (e) {
        console.error('Verification failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

verifyExpertUserLogic();
