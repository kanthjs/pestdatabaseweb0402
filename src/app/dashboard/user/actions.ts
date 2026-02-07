"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReportStatus, UserRole } from "@prisma/client";

export async function getUserDashboardData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get User Profile to ensure they exist
    const userProfile = await prisma.userProfile.findUnique({
        where: { id: user.id }
    });

    if (!userProfile) {
        redirect("/login");
    }

    // 1. Stats
    const [totalReports, verifiedReports] = await Promise.all([
        prisma.pestReport.count({
            where: { reporterUserId: user.id }
        }),
        prisma.pestReport.count({
            where: {
                reporterUserId: user.id,
                status: ReportStatus.APPROVED
            }
        })
    ]);

    // 2. Recent Reports
    const recentReports = await prisma.pestReport.findMany({
        where: { reporterUserId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
            pest: true,
            plant: true
        }
    });

    // 3. Top Pests
    const topPests = await prisma.pestReport.groupBy({
        by: ['pestId'],
        where: { reporterUserId: user.id },
        _count: {
            pestId: true
        },
        orderBy: {
            _count: {
                pestId: 'desc'
            }
        },
        take: 5
    });

    const pestNames = await Promise.all(topPests.map(async (item) => {
        const pest = await prisma.pest.findUnique({
            where: { pestId: item.pestId },
            select: { pestNameEn: true, pestNameTh: true }
        });
        return {
            name: pest?.pestNameEn || pest?.pestNameTh || "Unknown",
            count: item._count.pestId
        };
    }));

    return {
        userProfile,
        stats: {
            totalReports,
            verifiedReports
        },
        recentReports,
        topPests: pestNames
    };
}

export async function exportUserReportsToCSV() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const reports = await prisma.pestReport.findMany({
        where: { reporterUserId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
            pest: true,
            plant: true
        }
    });

    const header = "ID,Date,Province,Pest,Plant,Status,Verification Status\n";
    const rows = reports.map(r => {
        const date = r.createdAt.toISOString().split('T')[0];
        const escape = (text: string | null) => text ? `"${text.replace(/"/g, '""')}"` : "";

        return [
            r.id,
            date,
            escape(r.province),
            escape(r.pest.pestNameEn),
            escape(r.plant.plantNameEn),
            r.status,
            r.verifiedBy ? "Verified" : "Pending"
        ].join(",");
    }).join("\n");

    return header + rows;
}
