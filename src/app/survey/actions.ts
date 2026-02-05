"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface PestReportSubmission {
    province: string;
    latitude: number;
    longitude: number;
    plantId: string;
    pestId: string;
    symptomOnSet: string;
    filedAffectedArea: number;
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

export async function submitPestReport(data: PestReportSubmission) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    try {
        const report = await prisma.pestReport.create({
            data: {
                province: data.province,
                latitude: data.latitude,
                longitude: data.longitude,
                plantId: data.plantId,
                pestId: data.pestId,
                symptomOnSet: new Date(data.symptomOnSet),
                filedAffectedArea: data.filedAffectedArea,
                incidencePercent: data.incidencePercent,
                severityPercent: data.severityPercent,
                imageUrls: data.imageUrls,
                imageCaptions: data.imageCaptions,
                isAnonymous: data.isAnonymous,
                reporterFirstName: data.isAnonymous ? null : data.reporterFirstName,
                reporterLastName: data.isAnonymous ? null : data.reporterLastName,
                reporterPhone: data.isAnonymous ? null : data.reporterPhone,
                reporterRoles: data.isAnonymous ? null : data.reporterRole,
                status: "PENDING", // Default status
                reporterUserId: user?.id,
                reporterEmail: user?.email,
            },
        });

        revalidatePath("/dashboard");
        return { success: true, reportId: report.id };
    } catch (error) {
        console.error("Failed to submit report:", error);
        return { success: false, error: "Failed to submit report" };
    }
}
