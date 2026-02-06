import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ count: 0 }, { status: 401 });
        }

        // Check if user is expert or admin
        const profile = await prisma.userProfile.findFirst({
            where: {
                OR: [
                    { id: user.id },
                    { email: user.email || "" },
                ],
            },
        });

        if (!profile || (profile.role !== "EXPERT" && profile.role !== "ADMIN")) {
            return NextResponse.json({ count: 0 }, { status: 403 });
        }

        // Count pending reports
        const count = await prisma.pestReport.count({
            where: {
                status: "PENDING",
            },
        });

        return NextResponse.json({ count });
    } catch (error) {
        console.error("Error fetching pending count:", error);
        return NextResponse.json({ count: 0 }, { status: 500 });
    }
}
