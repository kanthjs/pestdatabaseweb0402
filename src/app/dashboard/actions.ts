"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format, differenceInDays } from "date-fns";
import { unstable_cache } from "next/cache";

export interface DashboardMetrics {
    totalVerified: {
        count: number;
        trend: number; // percentage change vs previous period
    };
    totalArea: {
        value: number;
        trend: number;
    };
    topPest: {
        id: string;
        name: string;
        count: number;
    } | null;
    hotZone: {
        province: string;
        count: number;
        severity: number;
    } | null;

    // Charts
    trendData: Array<{
        date: string;
        reported: number;
        symptom: number;
    }>;
    pestRanking: Array<{
        pestId: string;
        pestName: string;
        frequency: number;
        area: number;
        severity: number;
        incidence: number;
    }>;
    geoData: Array<{
        province: string;
        area: number;
        count: number;
        severity: number;
    }>;

    // Map
    mapData: Array<{
        id: string;
        lat: number;
        lng: number;
        severity: number;
        incidence: number;
        pestName: string;
    }>;
}

// Helper to fetch pest names mapping
async function getPestNamesMap(): Promise<Record<string, string>> {
    const pests = await prisma.pest.findMany();
    return pests.reduce((acc, pest) => {
        acc[pest.pestId] = pest.pestNameEn;
        return acc;
    }, {} as Record<string, string>);
}

// Cached version of getDashboardMetrics - revalidates every 60 seconds
export const getDashboardMetrics = unstable_cache(
    async (startDate: Date, endDate: Date): Promise<DashboardMetrics> => {
        const verifiedStatus = "APPROVED";

        // 0. Fetch Pest Names (Lookup)
        const pestNames = await getPestNamesMap();

        // 1. Key Metrics queries parallelization
        const daysDiff = differenceInDays(endDate, startDate);
        const prevStartDate = subDays(startDate, daysDiff);
        const prevEndDate = subDays(endDate, daysDiff);

        const [
            currentCount,
            prevCount,
            currentAreaAgg,
            prevAreaAgg,
            pestStats,
            provinceStats,
            rawDates,
            mapReports
        ] = await Promise.all([
            // Total Verified (Current)
            prisma.pestReport.count({
                where: { status: verifiedStatus, reportedAt: { gte: startDate, lte: endDate } }
            }),
            // Total Verified (Previous)
            prisma.pestReport.count({
                where: { status: verifiedStatus, reportedAt: { gte: prevStartDate, lte: prevEndDate } }
            }),
            // Total Area (Current)
            prisma.pestReport.aggregate({
                _sum: { fieldAffectedArea: true },
                where: { status: verifiedStatus, reportedAt: { gte: startDate, lte: endDate } }
            }),
            // Total Area (Previous)
            prisma.pestReport.aggregate({
                _sum: { fieldAffectedArea: true },
                where: { status: verifiedStatus, reportedAt: { gte: prevStartDate, lte: prevEndDate } }
            }),
            // Pest Stats (Ranking & Top Pest) - Group By Pest
            prisma.pestReport.groupBy({
                by: ['pestId'],
                where: { status: verifiedStatus, reportedAt: { gte: startDate, lte: endDate } },
                _count: { _all: true },
                _sum: { fieldAffectedArea: true, severityPercent: true, incidencePercent: true }
            }),
            // Province Stats (Hot Zone & Geo Data) - Group By Province
            prisma.pestReport.groupBy({
                by: ['province'],
                where: { status: verifiedStatus, reportedAt: { gte: startDate, lte: endDate } },
                _count: { _all: true },
                _sum: { fieldAffectedArea: true, severityPercent: true }
            }),
            // Trend Data (Lite fetch)
            prisma.pestReport.findMany({
                where: { status: verifiedStatus, reportedAt: { gte: startDate, lte: endDate } },
                select: { reportedAt: true, symptomOnSet: true }
            }),
            // Map Data (Limited to reports with location)
            prisma.pestReport.findMany({
                where: {
                    status: verifiedStatus,
                    reportedAt: { gte: startDate, lte: endDate },
                    latitude: { not: 0 }, // Ensure valid location if default is 0 or check for not null
                    // Note: Schema says Float, usually non-null. 
                },
                select: {
                    id: true,
                    pestId: true,
                    latitude: true,
                    longitude: true,
                    severityPercent: true,
                    incidencePercent: true,
                },
                orderBy: { reportedAt: 'desc' },
                take: 500 // Limit for performance
            })
        ]);

        // --- Calculate Metric 1: Total Verified ---
        const totalVerifiedCount = currentCount;
        const prevVerifiedCount = prevCount;
        const verifiedTrend = prevVerifiedCount === 0
            ? 100
            : Math.round(((totalVerifiedCount - prevVerifiedCount) / prevVerifiedCount) * 100);

        // --- Calculate Metric 2: Total Area ---
        const totalAreaValue = currentAreaAgg._sum.fieldAffectedArea || 0;
        const prevAreaValue = prevAreaAgg._sum.fieldAffectedArea || 0;
        const areaTrend = prevAreaValue === 0
            ? 100
            : Math.round(((totalAreaValue - prevAreaValue) / prevAreaValue) * 100);

        // --- Calculate Metric 3: Top Pest & Ranking ---
        const formattedPestStats = pestStats.map(stat => ({
            pestId: stat.pestId,
            pestName: pestNames[stat.pestId] || stat.pestId,
            frequency: stat._count._all,
            area: stat._sum.fieldAffectedArea || 0,
            severity: Math.round((stat._sum.severityPercent || 0) / stat._count._all),
            incidence: Math.round((stat._sum.incidencePercent || 0) / stat._count._all)
        }));

        const pestRanking = [...formattedPestStats].sort((a, b) => b.area - a.area).slice(0, 10);

        // Top pest by frequency
        const topPestStat = [...formattedPestStats].sort((a, b) => b.frequency - a.frequency)[0];
        const topPest = topPestStat ? {
            id: topPestStat.pestId,
            name: topPestStat.pestName,
            count: topPestStat.frequency
        } : null;

        // --- Calculate Metric 4: Hot Zone & Geo Data ---
        const formattedProvinceStats = provinceStats.map(stat => ({
            province: stat.province,
            count: stat._count._all,
            totalArea: stat._sum.fieldAffectedArea || 0,
            avgSeverity: (stat._sum.severityPercent || 0) / stat._count._all
        }));

        const geoData = [...formattedProvinceStats]
            .map(s => ({
                province: s.province,
                area: s.totalArea,
                count: s.count,
                severity: Math.round(s.avgSeverity)
            }))
            .sort((a, b) => b.area - a.area);

        // Find Hot Zone (highest score based on simple heuristic: count * severity * area)
        let hotZone = null;
        if (formattedProvinceStats.length > 0) {
            const hotStats = [...formattedProvinceStats].sort((a, b) => {
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

        // --- Trend Charts Data ---
        const trendMap: Record<string, { reported: number; symptom: number }> = {};

        rawDates.forEach(r => {
            const rDate = format(r.reportedAt, 'yyyy-MM-dd');
            const sDate = format(r.symptomOnSet, 'yyyy-MM-dd');

            if (!trendMap[rDate]) trendMap[rDate] = { reported: 0, symptom: 0 };
            if (!trendMap[sDate]) trendMap[sDate] = { reported: 0, symptom: 0 };

            trendMap[rDate].reported += 1;
            trendMap[sDate].symptom += 1;
        });

        const sortedDates = Object.keys(trendMap).sort();
        const trendData = sortedDates.map(date => ({
            date,
            reported: trendMap[date].reported,
            symptom: trendMap[date].symptom
        }));

        // --- Map Data ---
        const mapData = mapReports.map(r => ({
            id: r.id,
            lat: r.latitude,
            lng: r.longitude,
            severity: r.severityPercent,
            incidence: r.incidencePercent,
            pestName: pestNames[r.pestId] || r.pestId
        }));

        return {
            totalVerified: { count: totalVerifiedCount, trend: verifiedTrend },
            totalArea: { value: totalAreaValue, trend: areaTrend },
            topPest,
            hotZone,
            trendData,
            pestRanking,
            geoData,
            mapData
        };
    },
    ["dashboard-metrics"],
    { revalidate: 60 } // Revalidate every 60 seconds
);
