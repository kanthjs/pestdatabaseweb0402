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

    const reports = await prisma.pestReport.findMany({
        where: {
            reporterUserId: user.id,
        },
        orderBy: {
            reportedAt: "desc",
        },
        select: {
            id: true,
            reportedAt: true,
            province: true,
            pestId: true, // we need to join with Pest table usually, but we have pestId. 
            // Actually schema says Pest model exists.
            // Let's fetch pest name if possible.
            status: true,
            rejectionReason: true,
            imageUrls: true,
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
