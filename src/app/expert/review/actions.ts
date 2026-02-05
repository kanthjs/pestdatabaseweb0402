"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function verifyReport(reportId: string, verifiedBy: string = "Expert") {
    try {
        await prisma.pestReport.update({
            where: { id: reportId },
            data: {
                status: "VERIFIED",
                verifiedAt: new Date(),
                verifiedBy: verifiedBy,
            },
        });

        revalidatePath("/expert/review");
        return { success: true, message: "Report verified successfully" };
    } catch (error) {
        console.error("Error verifying report:", error);
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
                status: "REJECTED",
                verifiedAt: new Date(),
                verifiedBy: rejectedBy,
                rejectionReason: reason,
            },
        });

        revalidatePath("/expert/review");
        return { success: true, message: "Report rejected successfully" };
    } catch (error) {
        console.error("Error rejecting report:", error);
        return { success: false, message: "Failed to reject report" };
    }
}
