"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ReportStatus } from "@prisma/client";

// Helper to log errors only in development
function logError(message: string, error: unknown) {
    if (process.env.NODE_ENV === "development") {
        console.error(message, error);
    }
}

export async function verifyReport(reportId: string, verifiedBy: string = "Expert") {
    try {
        await prisma.pestReport.update({
            where: { id: reportId },
            data: {
                status: ReportStatus.VERIFIED,
                verifiedAt: new Date(),
                verifiedBy: verifiedBy,
            },
        });

        revalidatePath("/expert/review");
        return { success: true, message: "Report verified successfully" };
    } catch (error) {
        logError("Error verifying report:", error);
        return { success: false, message: "Failed to verify report" };
    }
}

export async function rejectReport(
    reportId: string,
    reason: string,
    rejectedBy: string = "Expert"
) {
    try {
        await prisma.pestReport.update({
            where: { id: reportId },
            data: {
                status: ReportStatus.REJECTED,
                verifiedAt: new Date(),
                verifiedBy: rejectedBy,
                rejectionReason: reason,
            },
        });

        revalidatePath("/expert/review");
        return { success: true, message: "Report rejected successfully" };
    } catch (error) {
        logError("Error rejecting report:", error);
        return { success: false, message: "Failed to reject report" };
    }
}
