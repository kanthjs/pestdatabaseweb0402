"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReportStatus } from "@prisma/client";

export interface UserStatistics {
    totalReports: number;
    verifiedReports: number;
    pendingReports: number;
    rejectedReports: number;
}

export interface UserReportHistory {
    id: string;
    reportedAt: Date;
    pestName: string;
    plantName: string;
    province: string;
    status: string;
    imageUrls: string[];
}

export interface UserGalleryItem {
    id: string;
    imageUrl: string;
    caption: string;
    plantName: string;
    pestName: string;
    reportedAt: Date;
}

export async function getUserDashboardData() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    const userId = user.id;

    // 1. Get Statistics
    const [total, verified, pending, rejected] = await Promise.all([
        prisma.pestReport.count({ where: { reporterUserId: userId } }),
        prisma.pestReport.count({ where: { reporterUserId: userId, status: ReportStatus.APPROVED } }),
        prisma.pestReport.count({ where: { reporterUserId: userId, status: ReportStatus.PENDING } }),
        prisma.pestReport.count({ where: { reporterUserId: userId, status: ReportStatus.REJECTED } })
    ]);

    const stats: UserStatistics = {
        totalReports: total,
        verifiedReports: verified,
        pendingReports: pending,
        rejectedReports: rejected
    };

    // 2. Get Report History (Timeline)
    const historyData = await prisma.pestReport.findMany({
        where: { reporterUserId: userId },
        orderBy: { reportedAt: 'desc' },
        select: {
            id: true,
            reportedAt: true,
            pest: { select: { pestNameEn: true } },
            plant: { select: { plantNameEn: true } },
            province: true,
            status: true,
            imageUrls: true
        },
        take: 50 // Recent 50 reports
    });

    const history: UserReportHistory[] = historyData.map(r => ({
        id: r.id,
        reportedAt: r.reportedAt,
        pestName: r.pest.pestNameEn,
        plantName: r.plant.plantNameEn,
        province: r.province,
        status: r.status,
        imageUrls: r.imageUrls
    }));

    // 3. Get Gallery Items (All images)
    const galleryReports = await prisma.pestReport.findMany({
        where: {
            reporterUserId: userId,
            imageUrls: { isEmpty: false }
        },
        orderBy: { reportedAt: 'desc' },
        select: {
            id: true,
            imageUrls: true,
            imageCaptions: true,
            pest: { select: { pestNameEn: true } },
            plant: { select: { plantNameEn: true } },
            reportedAt: true
        },
        take: 20 // Recent 20 reports with images
    });

    const gallery: UserGalleryItem[] = [];
    galleryReports.forEach(report => {
        report.imageUrls.forEach((url, index) => {
            gallery.push({
                id: `${report.id}-${index}`,
                imageUrl: url,
                caption: report.imageCaptions[index] || "",
                plantName: report.plant.plantNameEn,
                pestName: report.pest.pestNameEn,
                reportedAt: report.reportedAt
            });
        });
    });

    return {
        user,
        stats,
        history,
        gallery
    };
}
