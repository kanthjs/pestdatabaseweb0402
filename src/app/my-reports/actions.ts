"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { ReportStatus } from "@prisma/client";

export type MyReportItem = {
    id: string;
    reportedAt: Date;
    province: string;
    pestName: string;
    status: ReportStatus;
    rejectionReason: string | null;
    imageUrl: string | null;
};

export async function getUserReports() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // Use email to match reports - more reliable for ownership
    // This handles cases where user ID might differ between auth and database
    const userEmail = user.email;

    if (!userEmail) {
        throw new Error("User email not found");
    }

    // Fetch reports by email - this includes both:
    // 1. Reports submitted while logged in (reporterEmail set)
    // 2. Reports linked to user's profile
    const reports = await prisma.pestReport.findMany({
        where: {
            OR: [
                { reporterEmail: userEmail },
                { reporterUser: { email: userEmail } },
            ],
        },
        orderBy: {
            reportedAt: "desc",
        },
        select: {
            id: true,
            reportedAt: true,
            provinceCode: true,
            status: true,
            rejectionReason: true,
            imageUrls: true,
            reporterEmail: true,
            pest: {
                select: {
                    pestNameEn: true,
                },
            },
        },
    });

    return reports.map(r => ({
        id: r.id,
        reportedAt: r.reportedAt,
        province: r.provinceCode,
        pestName: r.pest.pestNameEn,
        status: r.status,
        rejectionReason: r.rejectionReason,
        imageUrl: r.imageUrls[0] || null,
    }));
}
