"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ReportStatus } from "@prisma/client";
import { rateLimiters } from "@/lib/rate-limit";

interface PestReportSubmission {
    province: string;
    latitude: number;
    longitude: number;
    plantId: string;
    pestId: string;
    symptomOnSet: string;
    fieldAffectedArea: number;
    incidencePercent: number;
    severityPercent: number;
    imageUrls: string[];
    imageCaptions: string[];
    isAnonymous: boolean;
    reporterFirstName: string;
    reporterLastName: string;
    reporterPhone: string;
    reporterRole: string;
}

// Helper to log errors only in development
function logError(message: string, error: unknown) {
    if (process.env.NODE_ENV === "development") {
        console.error(message, error);
    }
}

export async function submitPestReport(data: PestReportSubmission) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Rate limiting check - by user ID or IP
    const rateLimitKey = user?.id || "anonymous";
    const rateLimitResult = rateLimiters.survey(`submit:${rateLimitKey}`);
    if (!rateLimitResult.success) {
        return { success: false, error: rateLimitResult.error };
    }

    try {
        const report = await prisma.pestReport.create({
            data: {
                province: data.province,
                latitude: data.latitude,
                longitude: data.longitude,
                plantId: data.plantId,
                pestId: data.pestId,
                symptomOnSet: new Date(data.symptomOnSet),
                fieldAffectedArea: data.fieldAffectedArea,
                incidencePercent: data.incidencePercent,
                severityPercent: data.severityPercent,
                imageUrls: data.imageUrls,
                imageCaptions: data.imageCaptions,
                isAnonymous: data.isAnonymous,
                reporterFirstName: data.isAnonymous ? null : data.reporterFirstName,
                reporterLastName: data.isAnonymous ? null : data.reporterLastName,
                reporterPhone: data.isAnonymous ? null : data.reporterPhone,
                reporterRoles: data.isAnonymous ? null : data.reporterRole,
                status: ReportStatus.PENDING, // Default status
                reporterUserId: user?.id,
                reporterEmail: user?.email,
            },
        });

        revalidatePath("/dashboard");
        return { success: true, reportId: report.id };
    } catch (error) {
        logError("Failed to submit report:", error);
        return { success: false, error: "Failed to submit report" };
    }
}
