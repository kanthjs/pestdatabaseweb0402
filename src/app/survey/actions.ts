"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ReportStatus, UserRole } from "@prisma/client";
import { rateLimiters } from "@/lib/rate-limit";

interface PestReportSubmission {
    provinceCode: string;
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

    // Server-side image validation
    if (!data.imageUrls || data.imageUrls.length === 0) {
        return { success: false, error: "At least one photo is required / ต้องแนบรูปภาพอย่างน้อย 1 รูป" };
    }

    // If user is logged in, ensure their profile exists in our database
    let effectiveUserId = user?.id;
    let isExpert = false;

    if (user) {
        try {
            let profile = await prisma.userProfile.findUnique({
                where: { id: user.id },
            });

            if (!profile && user.email) {
                // Try to find by email in case user was created with different id
                profile = await prisma.userProfile.findUnique({
                    where: { email: user.email },
                });
            }

            if (!profile) {
                // If profile is missing (e.g. database was reset), create it on the fly
                const fullName = user.user_metadata?.full_name || "";
                const nameParts = fullName.split(" ");
                const firstName = user.user_metadata?.first_name || nameParts[0] || user.email?.split("@")[0] || "User";
                const lastName = user.user_metadata?.last_name || nameParts.slice(1).join(" ") || "";
                const userName = user.email
                    ? user.email.split('@')[0] + '_' + Date.now().toString(36)
                    : 'user_' + Date.now().toString(36);

                try {
                    profile = await prisma.userProfile.create({
                        data: {
                            id: user.id,
                            userName,
                            email: user.email || "",
                            firstName: firstName,
                            lastName: lastName,
                            role: UserRole.USER,
                        },
                    });
                } catch (createError: unknown) {
                    const isUniqueConstraintError =
                        createError instanceof Error &&
                        'code' in createError &&
                        createError.code === "P2002";

                    if (isUniqueConstraintError && user.email) {
                        profile = await prisma.userProfile.findUnique({
                            where: { email: user.email },
                        });
                    } else {
                        throw createError;
                    }
                }
            }

            // If profile exists with different id, use that id for the report
            if (profile) {
                effectiveUserId = profile.id;
                isExpert = profile.role === UserRole.EXPERT || profile.role === UserRole.ADMIN;
            }
        } catch (profileError) {
            logError("Failed to sync user profile:", profileError);
            // Return error instead of continuing, as we need a valid profile
            return { success: false, error: "Failed to sync user profile" };
        }
    }

    try {
        // Auto-approve reports from experts/admins
        const reportStatus = isExpert ? ReportStatus.APPROVED : ReportStatus.PENDING;
        const verifiedAt = isExpert ? new Date() : null;
        const verifiedBy = isExpert ? effectiveUserId : null;

        const report = await prisma.pestReport.create({
            data: {
                province: { connect: { provinceCode: data.provinceCode } },
                latitude: data.latitude,
                longitude: data.longitude,
                plant: { connect: { plantId: data.plantId } },
                pest: { connect: { pestId: data.pestId } },
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
                occupationRoles: data.isAnonymous ? null : data.reporterRole,
                status: reportStatus,
                verifiedAt,
                verifiedBy,
                reporterUser: effectiveUserId ? { connect: { id: effectiveUserId } } : undefined,
                reporterEmail: user?.email,
            },
        });

        revalidatePath("/my-reports");
        return { success: true, reportId: report.id, autoApproved: isExpert };
    } catch (error) {
        logError("Failed to submit report:", error);
        return { success: false, error: "Failed to submit report" };
    }
}

/**
 * Perform reverse geocoding on the server to avoid CORS issues and comply with Nominatim policy
 */
export async function reverseGeocode(lat: number, lon: number) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1&accept-language=th`,
            {
                headers: {
                    "User-Agent": "PestDatabaseWeb/1.0 (Contact: admin@example.com)",
                    "Accept-Language": "th,en;q=0.9",
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Nominatim API error: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        logError("Reverse geocoding failed:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to resolve address"
        };
    }
}

