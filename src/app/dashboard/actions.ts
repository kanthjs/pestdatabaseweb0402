"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { ReportStatus } from "@prisma/client";
import { subDays, differenceInDays } from "date-fns";

// ─── Types ───────────────────────────────────────────────────────
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
        trend: number;
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

export interface UserReportItem {
    id: string;
    createdAt: Date;
    province: string;
    pestName: string;
    plantName: string;
    status: ReportStatus;
    rejectionReason: string | null;
}

export interface UserStats {
    totalReports: number;
    verifiedReports: number;
    pendingReports: number;
    rejectedReports: number;
}

export interface DashboardData {
    role: "guest" | "user" | "expert";
    userEmail?: string;
    userName?: string;
    metrics: DashboardMetrics;
    userStats?: UserStats;
    userReports?: UserReportItem[];
}

// ─── Helper ──────────────────────────────────────────────────────
async function getPestName(pestId: string): Promise<string> {
    const pest = await prisma.pest.findUnique({
        where: { pestId },
        select: { pestNameEn: true }
    });
    return pest?.pestNameEn || pestId;
}

// ─── Get Current User Info ───────────────────────────────────────
export async function getCurrentUserInfo() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { role: "guest" as const };

    let profile = await prisma.userProfile.findUnique({
        where: { id: user.id },
    });

    if (!profile && user.email) {
        profile = await prisma.userProfile.findUnique({
            where: { email: user.email },
        });
    }

    const role = profile?.role === "EXPERT" || profile?.role === "ADMIN"
        ? "expert" as const
        : "user" as const;

    return {
        role,
        userId: profile?.id || user.id,
        userEmail: user.email || undefined,
        userName: profile?.userName || user.email?.split("@")[0] || "User",
    };
}

// ─── Global Dashboard Metrics (Approved reports, last 30 days) ──
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
    const endDate = new Date();
    const startDate = subDays(endDate, 30);
    const daysDiff = differenceInDays(endDate, startDate);
    const prevStartDate = subDays(startDate, daysDiff);
    const prevEndDate = subDays(endDate, daysDiff);

    const baseWhere = {
        reportedAt: { gte: startDate, lte: endDate },
        status: ReportStatus.APPROVED,
    };

    const prevWhere = {
        reportedAt: { gte: prevStartDate, lte: prevEndDate },
        status: ReportStatus.APPROVED,
    };

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
        prisma.pestReport.count({ where: baseWhere }),
        prisma.pestReport.count({ where: prevWhere }),
        prisma.pestReport.count({ where: { status: ReportStatus.APPROVED } }),
        prisma.pestReport.aggregate({
            _sum: { fieldAffectedArea: true },
            where: baseWhere
        }),
        prisma.pestReport.aggregate({
            _sum: { fieldAffectedArea: true },
            where: prevWhere
        }),
        prisma.pestReport.groupBy({
            by: ['pestId'],
            where: baseWhere,
            _count: { _all: true },
            _sum: { fieldAffectedArea: true, severityPercent: true, incidencePercent: true }
        }),
        prisma.pestReport.groupBy({
            by: ['provinceCode'],
            where: baseWhere,
            _count: { _all: true },
            _sum: { fieldAffectedArea: true, severityPercent: true }
        }),
        prisma.pestReport.findMany({
            where: {
                ...baseWhere,
                latitude: { not: 0 },
            },
            select: {
                id: true,
                latitude: true,
                longitude: true,
                severityPercent: true,
                incidencePercent: true,
                pest: { select: { pestNameEn: true } }
            },
            orderBy: { reportedAt: 'desc' },
            take: 500
        })
    ]);

    // Trends
    const verifiedTrend = prevCount === 0 ? 100
        : Math.round(((currentCount - prevCount) / prevCount) * 100);
    const totalAreaValue = currentAreaAgg._sum?.fieldAffectedArea || 0;
    const prevAreaValue = prevAreaAgg._sum?.fieldAffectedArea || 0;
    const areaTrend = prevAreaValue === 0 ? 100
        : Math.round(((totalAreaValue - prevAreaValue) / prevAreaValue) * 100);

    // Pest Ranking (Top 5)
    const sortedPestStats = [...pestStats].sort((a, b) => (b._count?._all || 0) - (a._count?._all || 0));
    const pestRanking = await Promise.all(
        sortedPestStats.slice(0, 5).map(async (stat) => ({
            id: stat.pestId,
            name: await getPestName(stat.pestId),
            count: stat._count?._all || 0,
            totalArea: stat._sum?.fieldAffectedArea || 0,
            avgSeverity: Math.round((stat._sum?.severityPercent || 0) / (stat._count?._all || 1)),
            avgIncidence: Math.round((stat._sum?.incidencePercent || 0) / (stat._count?._all || 1))
        }))
    );

    const topPest = pestRanking.length > 0 ? {
        id: pestRanking[0].id,
        name: pestRanking[0].name,
        count: pestRanking[0].count
    } : null;

    // Hot Zone
    let hotZone = null;
    if (provinceStats.length > 0) {
        const hotStats = provinceStats
            .map(stat => ({
                province: stat.provinceCode,
                count: stat._count?._all || 0,
                totalArea: stat._sum?.fieldAffectedArea || 0,
                avgSeverity: ((stat._sum?.severityPercent || 0) / (stat._count?._all || 1))
            }))
            .sort((a, b) => (b.count * b.avgSeverity * b.totalArea) - (a.count * a.avgSeverity * a.totalArea))[0];

        hotZone = {
            province: hotStats.province,
            count: hotStats.count,
            severity: Math.round(hotStats.avgSeverity)
        };
    }

    // Map Data
    const mapData = mapReports.map(r => ({
        id: r.id,
        lat: r.latitude,
        lng: r.longitude,
        severity: r.severityPercent,
        incidence: r.incidencePercent,
        pestName: r.pest.pestNameEn
    }));

    return {
        totalVerified: { count: currentCount, trend: verifiedTrend },
        totalReportsEver: totalEver,
        totalArea: { value: totalAreaValue, trend: areaTrend },
        topPest,
        pestRanking,
        hotZone,
        mapData,
    };
}

// ─── User's Personal Stats & Reports ─────────────────────────────
export async function getUserPersonalData(userId: string): Promise<{
    stats: UserStats;
    reports: UserReportItem[];
    mapData: Array<{
        id: string;
        lat: number;
        lng: number;
        severity: number;
        incidence: number;
        pestName: string;
    }>;
    pestRanking: PestRanking[];
}> {
    const [totalReports, verifiedReports, pendingReports, rejectedReports, recentReports, personalPestStats] = await Promise.all([
        prisma.pestReport.count({ where: { reporterUserId: userId } }),
        prisma.pestReport.count({ where: { reporterUserId: userId, status: ReportStatus.APPROVED } }),
        prisma.pestReport.count({ where: { reporterUserId: userId, status: ReportStatus.PENDING } }),
        prisma.pestReport.count({ where: { reporterUserId: userId, status: ReportStatus.REJECTED } }),
        prisma.pestReport.findMany({
            where: { reporterUserId: userId },
            orderBy: { createdAt: 'desc' },
            take: 20, // increased for map
            include: { pest: true, plant: true }
        }),
        prisma.pestReport.groupBy({
            by: ['pestId'],
            where: { reporterUserId: userId },
            _count: { _all: true },
            _sum: { fieldAffectedArea: true, severityPercent: true, incidencePercent: true }
        })
    ]);

    const pestRanking = await Promise.all(
        personalPestStats
            .sort((a, b) => (b._count?._all || 0) - (a._count?._all || 0))
            .slice(0, 5)
            .map(async (stat) => ({
                id: stat.pestId,
                name: await getPestName(stat.pestId),
                count: stat._count?._all || 0,
                totalArea: stat._sum?.fieldAffectedArea || 0,
                avgSeverity: Math.round((stat._sum?.severityPercent || 0) / (stat._count?._all || 1)),
                avgIncidence: Math.round((stat._sum?.incidencePercent || 0) / (stat._count?._all || 1))
            }))
    );

    return {
        stats: { totalReports, verifiedReports, pendingReports, rejectedReports },
        reports: recentReports.slice(0, 10).map(r => ({
            id: r.id,
            createdAt: r.createdAt,
            province: r.provinceCode,
            pestName: r.pest.pestNameEn,
            plantName: r.plant.plantNameEn,
            status: r.status,
            rejectionReason: r.rejectionReason,
        })),
        mapData: recentReports.map(r => ({
            id: r.id,
            lat: r.latitude,
            lng: r.longitude,
            severity: r.severityPercent,
            incidence: r.incidencePercent,
            pestName: r.pest.pestNameEn,
        })),
        pestRanking
    };
}

// ─── CSV Export ──────────────────────────────────────────────────
export async function exportUserReportsToCSV() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    let userProfile = await prisma.userProfile.findUnique({ where: { id: user.id } });
    if (!userProfile && user.email) {
        userProfile = await prisma.userProfile.findUnique({ where: { email: user.email } });
    }
    if (!userProfile) throw new Error("User profile not found");

    const reports = await prisma.pestReport.findMany({
        where: { reporterUserId: userProfile.id },
        orderBy: { createdAt: 'desc' },
        include: { pest: true, plant: true }
    });

    const header = "ID,Date,Province,Pest,Plant,Status,Rejection Reason\n";
    const rows = reports.map(r => {
        const date = r.createdAt.toISOString().split('T')[0];
        const escape = (text: string | null) => text ? `"${text.replace(/"/g, '""')}"` : "";
        return [
            r.id, date, escape(r.provinceCode),
            escape(r.pest.pestNameEn), escape(r.plant.plantNameEn),
            r.status, escape(r.rejectionReason)
        ].join(",");
    }).join("\n");

    return header + rows;
}
