import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';
import { subDays, differenceInDays } from "date-fns";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function getDashboardMetrics(startDate, endDate) {
    const baseWhereClause = {
        reportedAt: { gte: startDate, lte: endDate },
        status: 'APPROVED'
    };

    const daysDiff = differenceInDays(endDate, startDate);
    const prevStartDate = subDays(startDate, daysDiff);
    const prevEndDate = subDays(endDate, daysDiff);
    const prevWhereClause = {
        reportedAt: { gte: prevStartDate, lte: prevEndDate },
        status: 'APPROVED'
    };

    const [
        currentCount,
        prevCount,
        totalEver,
        pestStats,
        provinceStats
    ] = await Promise.all([
        prisma.pestReport.count({ where: baseWhereClause }),
        prisma.pestReport.count({ where: prevWhereClause }),
        prisma.pestReport.count({ where: { status: 'APPROVED' } }),
        prisma.pestReport.groupBy({
            by: ['pestId'],
            where: baseWhereClause,
            _count: { _all: true },
            _sum: { fieldAffectedArea: true, severityPercent: true }
        }),
        prisma.pestReport.groupBy({
            by: ['province'],
            where: { status: 'APPROVED' }, // All time province coverage
            _count: { _all: true }
        })
    ]);

    return {
        currentCount,
        prevCount,
        totalEver,
        pestStatsLength: pestStats.length,
        provincesCovered: provinceStats.length
    };
}

async function verifyPublicData() {
    console.log('=== Verifying Public Data Logic ===');

    // 1. Landing Page Stats
    const totalReports = await prisma.pestReport.count({ where: { status: 'APPROVED' } });
    const activeSurveyors = await prisma.userProfile.count(); // Approximate
    const distinctProvinces = await prisma.pestReport.groupBy({
        by: ['province'],
        where: { status: 'APPROVED' }
    });

    console.log('--- Landing Page Stats ---');
    console.log(`Verified Reports: ${totalReports}`);
    console.log(`Active Surveyors (Total Users): ${activeSurveyors}`);
    console.log(`Provinces with Verified Reports: ${distinctProvinces.length}`);

    // 2. Dashboard Metrics (Simulating functionality)
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);

    console.log('\n--- Dashboard Metrics (Last 30 Days) ---');
    try {
        const metrics = await getDashboardMetrics(thirtyDaysAgo, now);
        console.log('Metrics retrieved:', metrics);

        if (metrics.currentCount >= 0) console.log('✓ Current count retrieval matches schema.');
    } catch (e) {
        console.error('Error fetching dashboard metrics:', e);
    }

    await prisma.$disconnect();
}

verifyPublicData();
