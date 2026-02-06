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
            province: true,
            pestId: true,
            status: true,
            rejectionReason: true,
            imageUrls: true,
            reporterEmail: true,
        },
    });

    // We need to map pestId to pestName. 
    // Ideally use include: { pest: true }? No relation defined in schema yet...
    // Wait, schema has:
    // model Pest { pestId String @id, pestNameEn String }
    // model PestReport { ... pestId String ... } -- No @relation defined!

    // I should fetch pects to map names or add relation. 
    // Adding relation is better but I just pushed schema.
    // For now I'll fetch all pests or just show pestId (which might be readable?).
    // Actually pestId keys are like "PEST001".
    // Let's fetch all pests and map them manually for now to avoid another schema change immediately.

    const pests = await prisma.pest.findMany();
    const pestMap = new Map(pests.map(p => [p.pestId, p.pestNameEn]));

    return reports.map(r => ({
        id: r.id,
        reportedAt: r.reportedAt,
        province: r.province,
        pestName: pestMap.get(r.pestId) || r.pestId,
        status: r.status,
        rejectionReason: r.rejectionReason,
        imageUrl: r.imageUrls[0] || null,
    }));
}
