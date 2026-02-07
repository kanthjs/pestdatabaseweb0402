"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserRole, ReportStatus, ExpertStatus, Prisma } from "@prisma/client";

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
    expertRequest: ExpertStatus;
}

export interface SystemHealth {
    databaseSize: string;
    reportsToday: number;
    activeUsers: number;
}

export interface AdminReportItem {
    id: string;
    createdAt: Date;
    province: string;
    pestName: string;
    plantName: string;
    reporterName: string;
    status: ReportStatus;
    verifiedBy?: string | null;
}

export interface AdminActivityLogItem {
    id: string;
    action: string;
    adminName: string;
    entityType: string | null;
    entityId: string | null;
    details: any;
    createdAt: Date;
}

// --- Internal Helper: Log Admin Action ---
async function logAdminAction(
    adminId: string,
    action: string,
    entityType: string,
    entityId: string,
    details?: any
) {
    try {
        await prisma.activityLog.create({
            data: {
                adminId,
                action,
                entityType,
                entityId,
                details: details || {},
            },
        });
    } catch (error) {
        console.error("Failed to log admin action:", error);
    }
}

async function checkAdminAccess() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    // Check if user is ADMIN
    // Try find by ID first, then by email
    let userProfile = await prisma.userProfile.findUnique({
        where: { id: user.id },
        select: { role: true }
    });
    
    // If not found by ID and user has email, try looking up by email
    if (!userProfile && user.email) {
        userProfile = await prisma.userProfile.findUnique({
            where: { email: user.email },
            select: { role: true }
        });
    }

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
        prisma.pestReport.count({ where: { deletedAt: null } }), // Exclude soft-deleted
        prisma.pestReport.count({ where: { status: ReportStatus.PENDING, deletedAt: null } }),
        prisma.userProfile.count({ where: { expertRequest: ExpertStatus.PENDING } })
    ]);

    const stats: AdminStatistics = {
        totalUsers,
        totalExperts,
        totalReports,
        pendingReports,
        expertRequests
    };

    // 2. Get User List (Limited to 50 for overview)
    const usersData = await prisma.userProfile.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            userName: true,
            email: true,
            role: true,
            createdAt: true,
            expertRequest: true,
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
        reportCount: u._count.pestReports,
        expertRequest: u.expertRequest
    }));

    // 3. System Health
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const reportsToday = await prisma.pestReport.count({
        where: {
            createdAt: { gte: todayStart },
            deletedAt: null
        }
    });

    // Get Database Size (Postgres specific)
    let databaseSize = "Unknown";
    try {
        const dbName = process.env.DATABASE_URL?.split("/").pop()?.split("?")[0] || "postgres";
        const result = await prisma.$queryRaw`
            SELECT pg_size_pretty(pg_database_size(${dbName})) as size;
        `;
        // @ts-ignore
        if (result && result[0] && result[0].size) {
            // @ts-ignore
            databaseSize = result[0].size;
        }
    } catch (e) {
        console.error("Failed to get DB size:", e);
    }

    const health: SystemHealth = {
        databaseSize,
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

// --- CSV Export Actions ---

export async function exportReportsToCSV() {
    await checkAdminAccess();

    const reports = await prisma.pestReport.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        include: {
            pest: true,
            plant: true,
            reporterUser: {
                select: { userName: true, email: true }
            }
        }
    });

    // CSV Header
    const header = "ID,Date,Province,District,SubDistrict,Pest,Plant,Reporter,Status,Verification Status\n";

    // CSV Rows
    const rows = reports.map(r => {
        const date = r.createdAt.toISOString().split('T')[0];
        const reporter = r.reporterUser?.userName || (r.isAnonymous ? "Anonymous" : r.reporterFirstName || "Unknown");
        // Escape fields that might contain commas
        const escape = (text: string | null) => text ? `"${text.replace(/"/g, '""')}"` : "";

        return [
            r.id,
            date,
            escape(r.province),
            escape(r.pest.pestNameEn),
            escape(r.plant.plantNameEn),
            escape(reporter),
            r.status,
            r.verifiedBy ? "Verified" : "Pending"
        ].join(",");
    }).join("\n");

    return header + rows;
}

export async function exportUsersToCSV() {
    await checkAdminAccess();

    const users = await prisma.userProfile.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { pestReports: true }
            }
        }
    });

    const header = "ID,Username,Email,Role,First Name,Last Name,Province,Report Count,Created At\n";

    const rows = users.map(u => {
        const date = u.createdAt.toISOString().split('T')[0];
        const escape = (text: string | null) => text ? `"${text.replace(/"/g, '""')}"` : "";

        return [
            u.id,
            escape(u.userName),
            escape(u.email),
            u.role,
            escape(u.firstName),
            escape(u.lastName),
            escape(u.province),
            u._count.pestReports,
            date
        ].join(",");
    }).join("\n");

    return header + rows;
}

// --- Pagination and Filtering for Reports ---
export async function getAdminReports(
    page: number = 1,
    limit: number = 20,
    status?: ReportStatus
) {
    await checkAdminAccess();
    const skip = (page - 1) * limit;

    const whereClause: Prisma.PestReportWhereInput = {
        deletedAt: null,
        ...(status ? { status } : {})
    };

    const [reports, total] = await Promise.all([
        prisma.pestReport.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                pest: true,
                plant: true,
                reporterUser: {
                    select: { userName: true, firstName: true, lastName: true }
                }
            }
        }),
        prisma.pestReport.count({ where: whereClause })
    ]);

    const formattedReports: AdminReportItem[] = reports.map(r => ({
        id: r.id,
        createdAt: r.createdAt,
        province: r.province,
        pestName: r.pest.pestNameEn,
        plantName: r.plant.plantNameEn,
        reporterName: r.reporterUser?.userName || (r.isAnonymous ? "Anonymous" : r.reporterFirstName || "Unknown"),
        status: r.status,
        verifiedBy: r.verifiedBy
    }));

    return {
        reports: formattedReports,
        total,
        totalPages: Math.ceil(total / limit)
    };
}

// --- Activity Logs ---
export async function getAdminActivityLogs(limit: number = 50) {
    await checkAdminAccess();

    const logs = await prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
            admin: {
                select: { userName: true, email: true }
            }
        }
    });

    return logs.map(log => ({
        id: log.id,
        action: log.action,
        adminName: log.admin.userName || log.admin.email,
        entityType: log.entityType,
        entityId: log.entityId,
        details: log.details,
        createdAt: log.createdAt
    }));
}

// --- Actions Modifying State ---

export async function updateUserRole(userId: string, newRole: UserRole) {
    const adminUser = await checkAdminAccess();

    const oldUser = await prisma.userProfile.findUnique({
        where: { id: userId },
        select: { role: true }
    });

    await prisma.userProfile.update({
        where: { id: userId },
        data: { role: newRole }
    });

    await logAdminAction(adminUser.id, "CHANGE_ROLE", "USER", userId, {
        oldRole: oldUser?.role,
        newRole
    });

    return { success: true, message: `User role updated to ${newRole}` };
}

export async function approveExpertRequest(userId: string) {
    const adminUser = await checkAdminAccess();

    await prisma.userProfile.update({
        where: { id: userId },
        data: {
            role: UserRole.EXPERT,
            expertRequest: ExpertStatus.APPROVED
        }
    });

    await logAdminAction(adminUser.id, "APPROVE_EXPERT", "USER", userId, {});

    return { success: true, message: "Expert request approved" };
}

export async function rejectExpertRequest(userId: string) {
    const adminUser = await checkAdminAccess();

    await prisma.userProfile.update({
        where: { id: userId },
        data: { expertRequest: ExpertStatus.REJECTED }
    });

    await logAdminAction(adminUser.id, "REJECT_EXPERT", "USER", userId, {});

    return { success: true, message: "Expert request rejected" };
}

export async function updateReportStatus(reportId: string, status: ReportStatus, reason?: string) {
    const adminUser = await checkAdminAccess();

    const oldReport = await prisma.pestReport.findUnique({
        where: { id: reportId },
        select: { status: true }
    });

    await prisma.pestReport.update({
        where: { id: reportId },
        data: {
            status,
            verifiedAt: status !== ReportStatus.PENDING ? new Date() : null,
            verifiedBy: adminUser.id,
            rejectionReason: status === ReportStatus.REJECTED ? reason : null
        }
    });

    await logAdminAction(adminUser.id, `UPDATE_REPORT_${status}`, "REPORT", reportId, {
        oldStatus: oldReport?.status,
        newStatus: status,
        reason
    });

    return { success: true, message: `Report status updated to ${status}` };
}

export async function deleteReport(reportId: string, reason?: string) {
    const adminUser = await checkAdminAccess();

    // Soft delete
    await prisma.pestReport.update({
        where: { id: reportId },
        data: {
            deletedAt: new Date()
        }
    });

    await logAdminAction(adminUser.id, "DELETE_REPORT", "REPORT", reportId, { reason });

    return { success: true, message: "Report deleted successfully" };
}


// --- Master Data Management (Pests & Plants) ---

// -- Pests --
export async function getPests() {
    await checkAdminAccess();
    const pests = await prisma.pest.findMany({
        orderBy: { pestNameEn: 'asc' }
    });
    // Map pestId to id for frontend compatibility
    return pests.map(p => ({
        ...p,
        id: p.pestId
    }));
}

export async function createPest(data: { pestId: string; pestNameEn: string; pestNameTh?: string; imageUrl?: string }) {
    const adminUser = await checkAdminAccess();

    try {
        const pest = await prisma.pest.create({
            data: {
                pestId: data.pestId,
                pestNameEn: data.pestNameEn,
                pestNameTh: data.pestNameTh,
                imageUrl: data.imageUrl
            }
        });

        await logAdminAction(adminUser.id, "CREATE_PEST", "PEST", pest.pestId, { data });
        return { success: true, message: "Pest created successfully" };
    } catch (error) {
        console.error("Failed to create pest:", error);
        return { success: false, message: "Failed to create pest. ID might already exist." };
    }
}

export async function updatePest(id: string, data: { pestNameEn?: string; pestNameTh?: string; imageUrl?: string }) {
    const adminUser = await checkAdminAccess();

    try {
        await prisma.pest.update({
            where: { pestId: id }, // Use pestId as key
            data
        });

        await logAdminAction(adminUser.id, "UPDATE_PEST", "PEST", id, { data });
        return { success: true, message: "Pest updated successfully" };
    } catch (error) {
        console.error("Failed to update pest:", error);
        return { success: false, message: "Failed to update pest" };
    }
}

export async function deletePest(id: string) {
    const adminUser = await checkAdminAccess();

    try {
        // Check for dependencies (reports)
        const reportCount = await prisma.pestReport.count({ where: { pestId: id } });
        if (reportCount > 0) {
            return { success: false, message: `Cannot delete pest. It is used in ${reportCount} reports.` };
        }

        await prisma.pest.delete({ where: { pestId: id } }); // Use pestId as key
        await logAdminAction(adminUser.id, "DELETE_PEST", "PEST", id, {});
        return { success: true, message: "Pest deleted successfully" };
    } catch (error) {
        console.error("Failed to delete pest:", error);
        return { success: false, message: "Failed to delete pest" };
    }
}

// -- Plants --
export async function getPlants() {
    await checkAdminAccess();
    const plants = await prisma.plant.findMany({
        orderBy: { plantNameEn: 'asc' }
    });
    // Map plantId to id for frontend compatibility
    return plants.map(p => ({
        ...p,
        id: p.plantId
    }));
}

export async function createPlant(data: { plantId: string; plantNameEn: string; plantNameTh?: string; imageUrl?: string }) {
    const adminUser = await checkAdminAccess();

    try {
        const plant = await prisma.plant.create({
            data: {
                plantId: data.plantId,
                plantNameEn: data.plantNameEn,
                plantNameTh: data.plantNameTh,
                imageUrl: data.imageUrl
            }
        });

        await logAdminAction(adminUser.id, "CREATE_PLANT", "PLANT", plant.plantId, { data });
        return { success: true, message: "Plant created successfully" };
    } catch (error) {
        console.error("Failed to create plant:", error);
        return { success: false, message: "Failed to create plant. ID might already exist." };
    }
}

export async function updatePlant(id: string, data: { plantNameEn?: string; plantNameTh?: string; imageUrl?: string }) {
    const adminUser = await checkAdminAccess();

    try {
        await prisma.plant.update({
            where: { plantId: id }, // Use plantId as key
            data
        });

        await logAdminAction(adminUser.id, "UPDATE_PLANT", "PLANT", id, { data });
        return { success: true, message: "Plant updated successfully" };
    } catch (error) {
        console.error("Failed to update plant:", error);
        return { success: false, message: "Failed to update plant" };
    }
}

export async function deletePlant(id: string) {
    const adminUser = await checkAdminAccess();

    try {
        // Check for dependencies (reports)
        const reportCount = await prisma.pestReport.count({ where: { plantId: id } });
        if (reportCount > 0) {
            return { success: false, message: `Cannot delete plant. It is used in ${reportCount} reports.` };
        }

        await prisma.plant.delete({ where: { plantId: id } }); // Use plantId as key
        await logAdminAction(adminUser.id, "DELETE_PLANT", "PLANT", id, {});
        return { success: true, message: "Plant deleted successfully" };
    } catch (error) {
        console.error("Failed to delete plant:", error);
        return { success: false, message: "Failed to delete plant" };
    }
}
