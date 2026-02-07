"use server";

import { prisma } from "@/lib/prisma";
import { ReportStatus } from "@prisma/client";
import { subDays, differenceInDays } from "date-fns";

export interface PestRanking {
    id: string;
    name: string;
    count: number;
    totalArea: number;
    avgSeverity: number;
    avgIncidence: number;
}

export interface DashboardMetrics {
    totalVerified: {
        count: number;
        trend: number; // percentage change vs previous period
    };
    totalReportsEver: number;
    totalArea: {
        value: number;
        trend: number;
    };
    topPest: {
        id: string;
        name: string;
        count: number;
    } | null;
    pestRanking: PestRanking[];
    hotZone: {
        province: string;
        count: number;
        severity: number;
    } | null;
    mapData: Array<{
        id: string;
        lat: number;
        lng: number;
        severity: number;
        incidence: number;
        pestName: string;
    }>;
}

// Helper to fetch pest name for a single ID
async function getPestName(pestId: string): Promise<string> {
    const pest = await prisma.pest.findUnique({
        where: { pestId },
        select: { pestNameEn: true }
    });
    return pest?.pestNameEn || pestId;
}

// getDashboardMetrics - Now optionally filters by user email for accurate user-specific data
export async function getDashboardMetrics(startDate: Date, endDate: Date, userEmail?: string): Promise<DashboardMetrics> {
    // For personal dashboard (userEmail provided), show all their reports regardless of status
    // This matches how /my-reports works for consistency

    const baseWhereClause: any = {
        reportedAt: { gte: startDate, lte: endDate }
    };

    if (userEmail) {
        // Match both reporterEmail field and email from linked UserProfile
        baseWhereClause.OR = [
            { reporterEmail: userEmail },
            { reporterUser: { email: userEmail } }
        ];
    } else {
        baseWhereClause.status = ReportStatus.APPROVED;
    }

    // Calculate previous period dates for trend comparison
    const daysDiff = differenceInDays(endDate, startDate);
    const prevStartDate = subDays(startDate, daysDiff);
    const prevEndDate = subDays(endDate, daysDiff);

    const prevWhereClause: any = {
        reportedAt: { gte: prevStartDate, lte: prevEndDate }
    };

    if (userEmail) {
        prevWhereClause.OR = [
            { reporterEmail: userEmail },
            { reporterUser: { email: userEmail } }
        ];
    } else {
        prevWhereClause.status = ReportStatus.APPROVED;
    }

    const totalEverWhereClause: any = userEmail
        ? {
            OR: [
                { reporterEmail: userEmail },
                { reporterUser: { email: userEmail } }
            ]
        }
        : { status: ReportStatus.APPROVED };

    const [
        currentCount,
        prevCount,
        totalEver,
        currentAreaAgg,
        prevAreaAgg,
        pestStats,
        provinceStats,
        mapReports
    ] = await Promise.all([
        // Total Verified (Current)
        prisma.pestReport.count({ where: baseWhereClause }),
        // Total Verified (Previous)
        prisma.pestReport.count({ where: prevWhereClause }),
        // Total Reports Ever
        prisma.pestReport.count({ where: totalEverWhereClause }),
        // Total Area (Current)
        prisma.pestReport.aggregate({
            _sum: { fieldAffectedArea: true },
            where: baseWhereClause
        }),
        // Total Area (Previous)
        prisma.pestReport.aggregate({
            _sum: { fieldAffectedArea: true },
            where: prevWhereClause
        }),
        // Pest Stats (for Top Pest) - Group By Pest
        prisma.pestReport.groupBy({
            by: ['pestId'],
            where: baseWhereClause,
            _count: { _all: true },
            _sum: { fieldAffectedArea: true, severityPercent: true, incidencePercent: true }
        }),
        // Province Stats (for Hot Zone) - Group By Province
        prisma.pestReport.groupBy({
            by: ['province'],
            where: baseWhereClause,
            _count: { _all: true },
            _sum: { fieldAffectedArea: true, severityPercent: true }
        }),
        // Map Data (Limited to reports with location)
        prisma.pestReport.findMany({
            where: {
                ...baseWhereClause,
                latitude: { not: 0 },
            },
            select: {
                id: true,
                latitude: true,
                longitude: true,
                severityPercent: true,
                incidencePercent: true,
                pest: {
                    select: {
                        pestNameEn: true
                    }
                }
            },
            orderBy: { reportedAt: 'desc' },
            take: 500
        })
    ]);

    // --- Calculate Metric 1: Total Verified ---
    const totalVerifiedCount = currentCount;
    const prevVerifiedCount = prevCount;
    const verifiedTrend = prevVerifiedCount === 0
        ? 100
        : Math.round(((totalVerifiedCount - prevVerifiedCount) / prevVerifiedCount) * 100);

    // --- Calculate Metric 2: Total Area ---
    const totalAreaValue = currentAreaAgg._sum?.fieldAffectedArea || 0;
    const prevAreaValue = prevAreaAgg._sum?.fieldAffectedArea || 0;
    const areaTrend = prevAreaValue === 0
        ? 100
        : Math.round(((totalAreaValue - prevAreaValue) / prevAreaValue) * 100);

    // --- Calculate Metric 3: Pest Ranking (Top 5) ---
    const sortedPestStats = [...pestStats].sort((a, b) => (b._count?._all || 0) - (a._count?._all || 0));

    const pestRankingPromises = sortedPestStats.slice(0, 5).map(async (stat) => ({
        id: stat.pestId,
        name: await getPestName(stat.pestId),
        count: stat._count?._all || 0,
        totalArea: stat._sum?.fieldAffectedArea || 0,
        avgSeverity: Math.round((stat._sum?.severityPercent || 0) / (stat._count?._all || 1)),
        avgIncidence: Math.round((stat._sum?.incidencePercent || 0) / (stat._count?._all || 1))
    }));

    const pestRanking = await Promise.all(pestRankingPromises);
    const topPest = pestRanking.length > 0 ? {
        id: pestRanking[0].id,
        name: pestRanking[0].name,
        count: pestRanking[0].count
    } : null;

    // --- Calculate Metric 4: Hot Zone ---
    // Find Hot Zone (highest score based on simple heuristic: count * severity * area)
    let hotZone = null;
    if (provinceStats.length > 0) {
        const hotStats = provinceStats
            .map(stat => ({
                province: stat.province,
                count: stat._count?._all || 0,
                totalArea: stat._sum?.fieldAffectedArea || 0,
                avgSeverity: ((stat._sum?.severityPercent || 0) / (stat._count?._all || 1))
            }))
            .sort((a, b) => {
                const scoreA = a.count * a.avgSeverity * a.totalArea;
                const scoreB = b.count * b.avgSeverity * b.totalArea;
                return scoreB - scoreA;
            })[0];

        hotZone = {
            province: hotStats.province,
            count: hotStats.count,
            severity: Math.round(hotStats.avgSeverity)
        };
    }

    // --- Map Data ---
    const mapData = mapReports.map(r => ({
        id: r.id,
        lat: r.latitude,
        lng: r.longitude,
        severity: r.severityPercent,
        incidence: r.incidencePercent,
        pestName: r.pest.pestNameEn
    }));

    return {
        totalVerified: { count: totalVerifiedCount, trend: verifiedTrend },
        totalReportsEver: totalEver,
        totalArea: { value: totalAreaValue, trend: areaTrend },
        topPest,
        pestRanking,
        hotZone,
        mapData,
    };
}
