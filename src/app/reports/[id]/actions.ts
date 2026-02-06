"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getReportDetail(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // Find the user's profile to get the correct ID
    let profile = await prisma.userProfile.findUnique({
        where: { id: user.id },
    });

    if (!profile && user.email) {
        profile = await prisma.userProfile.findUnique({
            where: { email: user.email },
        });
    }

    const effectiveUserId = profile?.id || user.id;

    const report = await prisma.pestReport.findUnique({
        where: { id },
    });

    if (!report) {
        throw new Error("Report not found");
    }

    // Check if user owns this report (or is admin/expert)
    const isOwner = report.reporterUserId === effectiveUserId;
    const isAdmin = profile?.role === "ADMIN";
    const isExpert = profile?.role === "EXPERT";

    if (!isOwner && !isAdmin && !isExpert) {
        throw new Error("Access denied");
    }

    // Get pest name
    const pest = await prisma.pest.findUnique({
        where: { pestId: report.pestId },
    });

    // Get plant name
    const plant = await prisma.plant.findUnique({
        where: { plantId: report.plantId },
    });

    return {
        ...report,
        pestName: pest?.pestNameEn || report.pestId,
        plantName: plant?.plantNameEn || report.plantId,
        isOwner,
    };
}
