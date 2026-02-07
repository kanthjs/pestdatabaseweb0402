import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ role: null }, { status: 401 });
        }

        // Get user role from profile
        const profile = await prisma.userProfile.findFirst({
            where: {
                OR: [
                    { id: user.id },
                    { email: user.email || "" },
                ],
            },
            select: {
                role: true,
            },
        });

        const role = profile?.role || "USER";
        console.log(`API [GET] /api/user-role: User ${user.email} has role ${role}`);
        return NextResponse.json({ role });
    } catch (error) {
        console.error("Error fetching user role:", error);
        return NextResponse.json({ role: "USER" }, { status: 500 });
    }
}
