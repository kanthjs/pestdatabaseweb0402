import { prisma } from './src/lib/prisma';

async function checkDates() {
    const reports = await prisma.pestReport.findMany({
        select: {
            reportedAt: true,
            status: true
        },
        orderBy: { reportedAt: 'desc' },
        take: 10
    });

    console.log('Recent reports:');
    reports.forEach(r => {
        console.log(`- ${r.reportedAt.toISOString().split('T')[0]} (${r.status})`);
    });

    const approvedCount = await prisma.pestReport.count({
        where: { status: 'APPROVED' }
    });

    console.log(`\nTotal APPROVED reports: ${approvedCount}`);

    await prisma.$disconnect();
}

checkDates();
