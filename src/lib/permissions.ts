import { UserRole } from "@prisma/client";

export const PERMISSIONS = {
    VIEW_PUBLIC_DASHBOARD: ["ANONYMOUS", UserRole.USER, UserRole.EXPERT, UserRole.ADMIN] as const,
    VIEW_PERSONAL_DASHBOARD: [UserRole.USER, UserRole.EXPERT, UserRole.ADMIN] as const,
    VIEW_EXPERT_DASHBOARD: [UserRole.EXPERT, UserRole.ADMIN] as const,
    VERIFY_REPORTS: [UserRole.EXPERT, UserRole.ADMIN] as const,
    MANAGE_SYSTEM: [UserRole.ADMIN] as const,
};

export type Permission = keyof typeof PERMISSIONS;
export type Role = UserRole | "ANONYMOUS";

export function hasPermission(role: UserRole | "ANONYMOUS" | undefined | null, permission: Permission): boolean {
    const currentRole: Role = role || "ANONYMOUS";
    const allowedRoles = PERMISSIONS[permission] as readonly Role[];
    return allowedRoles.includes(currentRole);
}

export function canViewReport(userRole: UserRole, reporterId: string, currentUserId: string): boolean {
    if (hasPermission(userRole, "VIEW_EXPERT_DASHBOARD")) return true;
    return reporterId === currentUserId;
}
