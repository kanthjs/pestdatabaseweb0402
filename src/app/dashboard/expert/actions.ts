"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReportStatus, UserRole } from "@prisma/client";

export interface ExpertStatistics {
    pendingVerification: number;
    verifiedToday: number;
    verifiedThisWeek: number;
    totalVerified: number;
}

export interface PendingReport {
    id: string;
    reportedAt: Date;
    pestName: string;
    plantName: string;
    province: string;
    reporterName: string;
    imageUrls: string[];
    incidencePercent: number;
    severityPercent: number;
    fieldAffectedArea: number;
}

export interface ExpertAnalyticsData {
    reportsByDay: { date: string; count: number }[];
    reportsByProvince: { province: string; count: number }[];
    reportsByPest: { pest: string; count: number }[];
}

async function checkExpertAccess() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    // Check if user is EXPERT or ADMIN
    const userProfile = await prisma.userProfile.findUnique({
        where: { id: user.id },
        select: { role: true }
    });

    if (!userProfile || (userProfile.role !== UserRole.EXPERT && userProfile.role !== UserRole.ADMIN)) {
        redirect("/dashboard"); // Redirect to public dashboard if not authorized
    }

    return user;
}

export async function getExpertDashboardData() {
    const user = await checkExpertAccess();

    // 1. Get Statistics
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [pendingCount, verifiedTodayCount, verifiedWeekCount, totalVerifiedCount] = await Promise.all([
        prisma.pestReport.count({ where: { status: ReportStatus.PENDING } }),
        prisma.pestReport.count({
            where: {
                status: ReportStatus.APPROVED,
                verifiedAt: { gte: todayStart }
            }
        }),
        prisma.pestReport.count({
            where: {
                status: ReportStatus.APPROVED,
                verifiedAt: { gte: weekStart }
            }
        }),
        prisma.pestReport.count({ where: { status: ReportStatus.APPROVED } })
    ]);

    const stats: ExpertStatistics = {
        pendingVerification: pendingCount,
        verifiedToday: verifiedTodayCount,
        verifiedThisWeek: verifiedWeekCount,
        totalVerified: totalVerifiedCount
    };

    // 2. Get Pending Reports for Verification
    const pendingReportsData = await prisma.pestReport.findMany({
        where: { status: ReportStatus.PENDING },
        orderBy: { reportedAt: 'asc' }, // Oldest first
        select: {
            id: true,
            reportedAt: true,
            pest: { select: { pestNameEn: true } },
            plant: { select: { plantNameEn: true } },
            province: true,
            reporterFirstName: true,
            reporterLastName: true,
            imageUrls: true,
            incidencePercent: true,
            severityPercent: true,
            fieldAffectedArea: true
        },
        take: 20
    });

    const pendingReports: PendingReport[] = pendingReportsData.map(r => ({
        id: r.id,
        reportedAt: r.reportedAt,
        pestName: r.pest.pestNameEn,
        plantName: r.plant.plantNameEn,
        province: r.province,
        reporterName: `${r.reporterFirstName || ''} ${r.reporterLastName || ''}`.trim() || 'Anonymous',
        imageUrls: r.imageUrls,
        incidencePercent: r.incidencePercent,
        severityPercent: r.severityPercent,
        fieldAffectedArea: r.fieldAffectedArea
    }));

    // 3. Get Analytics Data (Last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentReports = await prisma.pestReport.findMany({
        where: {
            reportedAt: { gte: thirtyDaysAgo }
        },
        select: {
            reportedAt: true,
            province: true,
            pest: { select: { pestNameEn: true } }
        }
    });

    // Group by day
    const reportsByDayMap = new Map<string, number>();
    recentReports.forEach(r => {
        const dateStr = r.reportedAt.toISOString().split('T')[0];
        reportsByDayMap.set(dateStr, (reportsByDayMap.get(dateStr) || 0) + 1);
    });
    const reportsByDay = Array.from(reportsByDayMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

    // Group by province
    const reportsByProvinceMap = new Map<string, number>();
    recentReports.forEach(r => {
        reportsByProvinceMap.set(r.province, (reportsByProvinceMap.get(r.province) || 0) + 1);
    });
    const reportsByProvince = Array.from(reportsByProvinceMap.entries())
        .map(([province, count]) => ({ province, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // Group by pest
    const reportsByPestMap = new Map<string, number>();
    recentReports.forEach(r => {
        reportsByPestMap.set(r.pest.pestNameEn, (reportsByPestMap.get(r.pest.pestNameEn) || 0) + 1);
    });
    const reportsByPest = Array.from(reportsByPestMap.entries())
        .map(([pest, count]) => ({ pest, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const analytics: ExpertAnalyticsData = {
        reportsByDay,
        reportsByProvince,
        reportsByPest
    };

    return {
        user,
        stats,
        pendingReports,
        analytics
    };
}

export async function approveReport(reportId: string) {
    const user = await checkExpertAccess();

    await prisma.pestReport.update({
        where: { id: reportId },
        data: {
            status: ReportStatus.APPROVED,
            verifiedAt: new Date(),
            verifiedBy: user.id
        }
    });

    return { success: true, message: "Report approved successfully" };
}

export async function rejectReport(reportId: string, reason: string) {
    const user = await checkExpertAccess();

    await prisma.pestReport.update({
        where: { id: reportId },
        data: {
            status: ReportStatus.REJECTED,
            verifiedAt: new Date(),
            verifiedBy: user.id,
            rejectionReason: reason
        }
    });

    return { success: true, message: "Report rejected" };
}
