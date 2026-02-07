"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserRole, ReportStatus, ExpertStatus } from "@prisma/client";

export interface AdminStatistics {
    totalUsers: number;
    totalExperts: number;
    totalReports: number;
    pendingReports: number;
    expertRequests: number;
}

export interface UserListItem {
    id: string;
    userName: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    reportCount: number;
}

export interface SystemHealth {
    databaseSize: string;
    reportsToday: number;
    activeUsers: number;
}

async function checkAdminAccess() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    // Check if user is ADMIN
    const userProfile = await prisma.userProfile.findUnique({
        where: { id: user.id },
        select: { role: true }
    });

    if (!userProfile || userProfile.role !== UserRole.ADMIN) {
        redirect("/dashboard"); // Redirect to public dashboard if not authorized
    }

    return user;
}

export async function getAdminDashboardData() {
    const user = await checkAdminAccess();

    // 1. Get Statistics
    const [totalUsers, totalExperts, totalReports, pendingReports, expertRequests] = await Promise.all([
        prisma.userProfile.count(),
        prisma.userProfile.count({ where: { role: UserRole.EXPERT } }),
        prisma.pestReport.count(),
        prisma.pestReport.count({ where: { status: ReportStatus.PENDING } }),
        prisma.userProfile.count({ where: { expertRequest: ExpertStatus.PENDING } })
    ]);

    const stats: AdminStatistics = {
        totalUsers,
        totalExperts,
        totalReports,
        pendingReports,
        expertRequests
    };

    // 2. Get User List
    const usersData = await prisma.userProfile.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            userName: true,
            email: true,
            role: true,
            createdAt: true,
            _count: {
                select: { pestReports: true }
            }
        },
        take: 50
    });

    const users: UserListItem[] = usersData.map(u => ({
        id: u.id,
        userName: u.userName,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        reportCount: u._count.pestReports
    }));

    // 3. System Health
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const reportsToday = await prisma.pestReport.count({
        where: { createdAt: { gte: todayStart } }
    });

    const health: SystemHealth = {
        databaseSize: "N/A", // Would need direct DB query
        reportsToday,
        activeUsers: totalUsers
    };

    return {
        user,
        stats,
        users,
        health
    };
}

export async function updateUserRole(userId: string, newRole: UserRole) {
    await checkAdminAccess();

    await prisma.userProfile.update({
        where: { id: userId },
        data: { role: newRole }
    });

    return { success: true, message: `User role updated to ${newRole}` };
}

export async function approveExpertRequest(userId: string) {
    await checkAdminAccess();

    await prisma.userProfile.update({
        where: { id: userId },
        data: {
            role: UserRole.EXPERT,
            expertRequest: ExpertStatus.NONE
        }
    });

    return { success: true, message: "Expert request approved" };
}

export async function rejectExpertRequest(userId: string) {
    await checkAdminAccess();

    await prisma.userProfile.update({
        where: { id: userId },
        data: { expertRequest: ExpertStatus.REJECTED }
    });

    return { success: true, message: "Expert request rejected" };
}
