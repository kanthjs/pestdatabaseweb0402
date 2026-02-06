import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { markNotificationSchema } from "@/lib/validation";
import { apiErrors, handleApiError, successResponse } from "@/lib/api-utils";
import { rateLimiters } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

// GET: Fetch unread notifications
export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return apiErrors.unauthorized();
    }

    // Rate limiting
    const rateLimitResult = rateLimiters.api(`notifications:get:${user.id}`);
    if (!rateLimitResult.success) {
        return apiErrors.rateLimited();
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId: user.id,
                isRead: false,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                report: {
                    select: {
                        province: true,
                        pestId: true,
                    }
                }
            },
            take: 10,
        });

        return successResponse(notifications);
    } catch (error) {
        return handleApiError(error);
    }
}

// POST: Mark notification as read
export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return apiErrors.unauthorized();
    }

    // Rate limiting
    const rateLimitResult = rateLimiters.api(`notifications:post:${user.id}`);
    if (!rateLimitResult.success) {
        return apiErrors.rateLimited();
    }

    try {
        const body = await request.json();
        
        // Validate input with Zod
        const validationResult = markNotificationSchema.safeParse(body);
        
        if (!validationResult.success) {
            return apiErrors.validationError(validationResult.error.issues);
        }

        const { id, markAll } = validationResult.data;

        if (markAll) {
            await prisma.notification.updateMany({
                where: { userId: user.id, isRead: false },
                data: { isRead: true },
            });
        } else if (id) {
            await prisma.notification.update({
                where: { id, userId: user.id },
                data: { isRead: true },
            });
        }

        return successResponse({ message: "Notifications updated" });
    } catch (error) {
        return handleApiError(error);
    }
}
