import { UserRole } from "@prisma/client";

export const PERMISSIONS = {
    VIEW_PUBLIC_DASHBOARD: ["ANONYMOUS", UserRole.USER, UserRole.EXPERT, UserRole.ADMIN],
    VIEW_PERSONAL_DASHBOARD: [UserRole.USER, UserRole.EXPERT, UserRole.ADMIN],
    VIEW_EXPERT_DASHBOARD: [UserRole.EXPERT, UserRole.ADMIN],
    VERIFY_REPORTS: [UserRole.EXPERT, UserRole.ADMIN],
    MANAGE_SYSTEM: [UserRole.ADMIN],
};

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: UserRole | "ANONYMOUS" | undefined | null, permission: Permission): boolean {
    const currentRole = role || "ANONYMOUS";
    // @ts-ignore - Dynamic check is safe here
    return PERMISSIONS[permission].includes(currentRole as any);
}

export function canViewReport(userRole: UserRole, reporterId: string, currentUserId: string): boolean {
    if (hasPermission(userRole, "VIEW_EXPERT_DASHBOARD")) return true;
    return reporterId === currentUserId;
}
