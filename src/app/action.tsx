"use server";

import { prisma } from "@/lib/prisma";
import { ReportStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Helper to log errors only in development
function logError(message: string, error: unknown) {
    if (process.env.NODE_ENV === "development") {
        console.error(message, error);
    }
}

export async function createPestReport(formData: {
    province: string;
    plantId: string;
    pestId: string;
    symptomOnSet: string;
    fieldAffectedArea: string;
    incidencePercent: string;
    severityPercent: string;
    latitude: string;
    longitude: string;
}) {
    try {
        const report = await prisma.pestReport.create({
            data: {
                province: formData.province,
                plantId: formData.plantId,
                pestId: formData.pestId,
                symptomOnSet: new Date(formData.symptomOnSet),
                fieldAffectedArea: parseFloat(formData.fieldAffectedArea),
                incidencePercent: parseFloat(formData.incidencePercent),
                severityPercent: parseFloat(formData.severityPercent),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                imageUrls: [],
                imageCaptions: [],
                status: ReportStatus.PENDING,
            },
        });

        revalidatePath("/dashboard");
        return { success: true, data: report };
    } catch (error) {
        logError("Error creating pest report:", error);
        return { success: false, error: "Failed to save report" };
    }
}
