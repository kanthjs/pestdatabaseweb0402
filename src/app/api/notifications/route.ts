import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { markNotificationSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

// GET: Fetch unread notifications
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

        return NextResponse.json(notifications);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Mark notification as read
export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        
        // Validate input with Zod
        const validationResult = markNotificationSchema.safeParse(body);
        
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Invalid input", details: validationResult.error.issues },
                { status: 400 }
            );
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

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
