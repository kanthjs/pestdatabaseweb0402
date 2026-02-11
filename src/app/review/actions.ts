"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { ReportStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────
export interface ReviewReport {
    id: string;
    createdAt: Date;
    reportedAt: Date;
    province: string;
    pestName: string;
    plantName: string;
    fieldAffectedArea: number;
    incidencePercent: number;
    severityPercent: number;
    latitude: number;
    longitude: number;
    imageUrls: string[];
    imageCaptions: string[];
    reporterName: string;
    reporterEmail: string | null;
    isAnonymous: boolean;
    status: ReportStatus;
    rejectionReason: string | null;
    verifiedAt: Date | null;
    verifiedBy: string | null;
}

export interface ReviewStats {
    pending: number;
    approvedToday: number;
    rejectedToday: number;
    total: number;
}

// ─── Access Check ────────────────────────────────────────────────
async function checkExpertAccess() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    let profile = await prisma.userProfile.findUnique({
        where: { id: user.id },
    });

    if (!profile && user.email) {
        profile = await prisma.userProfile.findUnique({
            where: { email: user.email },
        });
    }

    if (!profile || (profile.role !== "EXPERT" && profile.role !== "ADMIN")) {
        redirect("/dashboard");
    }

    return { user, profile };
}

// ─── Get Review Data ─────────────────────────────────────────────
export async function getReviewData(statusFilter: ReportStatus = ReportStatus.PENDING) {
    const { profile } = await checkExpertAccess();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [stats, reports] = await Promise.all([
        // Stats
        Promise.all([
            prisma.pestReport.count({ where: { status: ReportStatus.PENDING, deletedAt: null } }),
            prisma.pestReport.count({ where: { status: ReportStatus.APPROVED, verifiedAt: { gte: today }, deletedAt: null } }),
            prisma.pestReport.count({ where: { status: ReportStatus.REJECTED, verifiedAt: { gte: today }, deletedAt: null } }),
            prisma.pestReport.count({ where: { deletedAt: null } }),
        ]).then(([pending, approvedToday, rejectedToday, total]) => ({
            pending, approvedToday, rejectedToday, total
        })),

        // Reports list
        prisma.pestReport.findMany({
            where: {
                status: statusFilter,
                deletedAt: null,
            },
            orderBy: statusFilter === ReportStatus.PENDING
                ? { createdAt: "asc" }    // oldest first for pending (FIFO)
                : { verifiedAt: "desc" }, // newest first for reviewed
            take: 50,
            include: {
                pest: { select: { pestNameEn: true } },
                plant: { select: { plantNameEn: true } },
            },
        }),
    ]);

    const reviewReports: ReviewReport[] = reports.map(r => ({
        id: r.id,
        createdAt: r.createdAt,
        reportedAt: r.reportedAt,
        province: r.provinceCode,
        pestName: r.pest.pestNameEn,
        plantName: r.plant.plantNameEn,
        fieldAffectedArea: r.fieldAffectedArea,
        incidencePercent: r.incidencePercent,
        severityPercent: r.severityPercent,
        latitude: r.latitude,
        longitude: r.longitude,
        imageUrls: r.imageUrls,
        imageCaptions: r.imageCaptions,
        reporterName: r.isAnonymous
            ? "Anonymous"
            : [r.reporterFirstName, r.reporterLastName].filter(Boolean).join(" ") || "ไม่ระบุชื่อ",
        reporterEmail: r.reporterEmail,
        isAnonymous: r.isAnonymous,
        status: r.status,
        rejectionReason: r.rejectionReason,
        verifiedAt: r.verifiedAt,
        verifiedBy: r.verifiedBy,
    }));

    return {
        stats,
        reports: reviewReports,
        expertName: profile.userName || profile.email,
    };
}

// ─── Approve Report ─────────────────────────────────────────────
export async function approveReport(reportId: string, note?: string) {
    const { profile } = await checkExpertAccess();

    await prisma.pestReport.update({
        where: { id: reportId },
        data: {
            status: ReportStatus.APPROVED,
            verifiedAt: new Date(),
            verifiedBy: profile.userName || profile.email,
            rejectionReason: note || null,
        },
    });

    // Create notification for the reporter
    const report = await prisma.pestReport.findUnique({
        where: { id: reportId },
        select: { reporterUserId: true, pest: { select: { pestNameEn: true } } },
    });

    if (report?.reporterUserId) {
        await prisma.notification.create({
            data: {
                userId: report.reporterUserId,
                type: "VERIFIED",
                message: `รายงาน "${report.pest.pestNameEn}" ของคุณได้รับการอนุมัติแล้ว${note ? ` (Note: ${note})` : ""}`,
                reportId,
            },
        });
    }

    revalidatePath("/review");
    revalidatePath("/dashboard");
    return { success: true };
}

// ─── Reject Report ──────────────────────────────────────────────
export async function rejectReport(reportId: string, reason: string) {
    if (!reason.trim()) {
        return { success: false, error: "กรุณาระบุเหตุผลที่ไม่อนุมัติ" };
    }

    const { profile } = await checkExpertAccess();

    await prisma.pestReport.update({
        where: { id: reportId },
        data: {
            status: ReportStatus.REJECTED,
            verifiedAt: new Date(),
            verifiedBy: profile.userName || profile.email,
            rejectionReason: reason,
        },
    });

    // Create notification for the reporter
    const report = await prisma.pestReport.findUnique({
        where: { id: reportId },
        select: { reporterUserId: true, pest: { select: { pestNameEn: true } } },
    });

    if (report?.reporterUserId) {
        await prisma.notification.create({
            data: {
                userId: report.reporterUserId,
                type: "REJECTED",
                message: `รายงาน "${report.pest.pestNameEn}" ของคุณไม่ผ่านการตรวจสอบ: ${reason}`,
                reportId,
            },
        });
    }

    revalidatePath("/review");
    revalidatePath("/dashboard");
    return { success: true };
}
