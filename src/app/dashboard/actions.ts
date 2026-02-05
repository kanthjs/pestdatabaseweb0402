"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
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

const pestNames: Record<string, string> = {
    INS001: "เพลี้ยกระโดดสีน้ำตาล",
    INS002: "หนอนกระทู้ข้าวโพด",
    INS003: "เพลี้ยแป้งมันสำปะหลัง",
    DIS001: "โรคไหม้ข้าว",
};

// Cached version of getDashboardMetrics - revalidates every 60 seconds
export const getDashboardMetrics = unstable_cache(
    async (startDate: Date, endDate: Date): Promise<DashboardMetrics> => {
        const verifiedStatus = "VERIFIED";

    // 1. Key Metrics queries
    // Current Period
    const currentReports = await prisma.pestReport.findMany({
        where: {
            status: verifiedStatus,
            reportedAt: { gte: startDate, lte: endDate },
        },
        select: {
            id: true,
            pestId: true,
            province: true,
            fieldAffectedArea: true,
            severityPercent: true,
            incidencePercent: true,
            reportedAt: true,
            symptomOnSet: true,
            latitude: true,
            longitude: true,
        },
    });

    // Previous Period (for trend calculation)
    const daysDiff = differenceInDays(endDate, startDate);
    const prevStartDate = subDays(startDate, daysDiff);
    const prevEndDate = subDays(endDate, daysDiff);

    const prevReports = await prisma.pestReport.findMany({
        where: {
            status: verifiedStatus,
            reportedAt: { gte: prevStartDate, lte: prevEndDate },
        },
        select: { id: true, fieldAffectedArea: true },
    });

    // --- Calculate Metric 1: Total Verified ---
    const totalVerifiedCount = currentReports.length;
    const prevVerifiedCount = prevReports.length;
    const verifiedTrend = prevVerifiedCount === 0
        ? 100
        : Math.round(((totalVerifiedCount - prevVerifiedCount) / prevVerifiedCount) * 100);

    // --- Calculate Metric 2: Total Area ---
    const totalAreaValue = currentReports.reduce((sum, r) => sum + r.fieldAffectedArea, 0);
    const prevAreaValue = prevReports.reduce((sum, r) => sum + r.fieldAffectedArea, 0);
    const areaTrend = prevAreaValue === 0
        ? 100
        : Math.round(((totalAreaValue - prevAreaValue) / prevAreaValue) * 100);

    // --- Calculate Metric 3: Top Pest ---
    const pestCounts: Record<string, number> = {};
    currentReports.forEach(r => {
        pestCounts[r.pestId] = (pestCounts[r.pestId] || 0) + 1;
    });

    let topPestId = "";
    let topPestCount = -1;

    Object.entries(pestCounts).forEach(([id, count]) => {
        if (count > topPestCount) {
            topPestCount = count;
            topPestId = id;
        }
    });

    const topPest = topPestId ? {
        id: topPestId,
        name: pestNames[topPestId] || topPestId,
        count: topPestCount
    } : null;

    // --- Calculate Metric 4: Hot Zone ---
    const provinceStats: Record<string, { count: number; severity: number; totalArea: number }> = {};

    currentReports.forEach(r => {
        if (!provinceStats[r.province]) {
            provinceStats[r.province] = { count: 0, severity: 0, totalArea: 0 };
        }
        provinceStats[r.province].count += 1;
        provinceStats[r.province].severity += r.severityPercent;
        provinceStats[r.province].totalArea += r.fieldAffectedArea;
    });

    let hotZoneProvince = "";
    let hotZoneScore = -1;
    let hotZoneCount = 0;
    let hotZoneAvgSeverity = 0;

    Object.entries(provinceStats).forEach(([prov, stats]) => {
        // Score logic: count * avg_severity * total_area (normalized slightly for sanity?)
        // Or simpler: just count for now, or the formula requested: count * severity * area
        // Let's use avg severity
        const avgSev = stats.severity / stats.count;
        const score = stats.count * avgSev * stats.totalArea;

        if (score > hotZoneScore) {
            hotZoneScore = score;
            hotZoneProvince = prov;
            hotZoneCount = stats.count;
            hotZoneAvgSeverity = avgSev;
        }
    });

    const hotZone = hotZoneProvince ? {
        province: hotZoneProvince,
        count: hotZoneCount,
        severity: Math.round(hotZoneAvgSeverity)
    } : null;


    // --- Trend Charts Data ---
    const trendMap: Record<string, { reported: number; symptom: number }> = {};

    currentReports.forEach(r => {
        const rDate = format(r.reportedAt, 'yyyy-MM-dd');
        const sDate = format(r.symptomOnSet, 'yyyy-MM-dd');

        if (!trendMap[rDate]) trendMap[rDate] = { reported: 0, symptom: 0 };
        if (!trendMap[sDate]) trendMap[sDate] = { reported: 0, symptom: 0 };

        trendMap[rDate].reported += 1;
        trendMap[sDate].symptom += 1;
    });

    // Sort dates
    const sortedDates = Object.keys(trendMap).sort();
    const trendData = sortedDates.map(date => ({
        date,
        reported: trendMap[date].reported,
        symptom: trendMap[date].symptom
    }));


    // --- Pest Ranking Data ---
    const pestStats: Record<string, { freq: number; area: number; sev: number; inc: number }> = {};

    currentReports.forEach(r => {
        if (!pestStats[r.pestId]) pestStats[r.pestId] = { freq: 0, area: 0, sev: 0, inc: 0 };
        pestStats[r.pestId].freq += 1;
        pestStats[r.pestId].area += r.fieldAffectedArea;
        pestStats[r.pestId].sev += r.severityPercent;
        pestStats[r.pestId].inc += r.incidencePercent;
    });

    const pestRanking = Object.entries(pestStats).map(([id, stats]) => ({
        pestId: id,
        pestName: pestNames[id] || id,
        frequency: stats.freq,
        area: stats.area,
        severity: Math.round(stats.sev / stats.freq),
        incidence: Math.round(stats.inc / stats.freq)
    })).sort((a, b) => b.area - a.area).slice(0, 10);


    // --- Geo Data (Treemap/List) ---
    const geoData = Object.entries(provinceStats).map(([prov, stats]) => ({
        province: prov,
        area: stats.totalArea,
        count: stats.count,
        severity: Math.round(stats.severity / stats.count)
    })).sort((a, b) => b.area - a.area);


    // --- Map Data ---
    const mapData = currentReports.map(r => ({
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
