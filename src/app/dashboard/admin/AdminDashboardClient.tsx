"use client";

import React, { useState } from 'react';
import { AdminStatistics, UserListItem, SystemHealth, updateUserRole, approveExpertRequest, rejectExpertRequest } from "./actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
    Shield,
    Users,
    FileText,
    Clock,
    UserCog,
    Database,
    Activity,
    Settings,
    CheckCircle,
    Crown,
    User as UserIcon,
    GraduationCap,
    MoreVertical
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { UserRole } from "@prisma/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface AdminDashboardClientProps {
    user: User;
    stats: AdminStatistics;
    users: UserListItem[];
    health: SystemHealth;
}

export default function AdminDashboardClient({ user: _user, stats, users, health }: AdminDashboardClientProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        setIsLoading(true);
        try {
            await updateUserRole(userId, newRole);
            router.refresh();
        } catch (error) {
            console.error("Error updating role:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproveExpert = async (userId: string) => {
        setIsLoading(true);
        try {
            await approveExpertRequest(userId);
            router.refresh();
        } catch (error) {
            console.error("Error approving expert:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRejectExpert = async (userId: string) => {
        setIsLoading(true);
        try {
            await rejectExpertRequest(userId);
            router.refresh();
        } catch (error) {
            console.error("Error rejecting expert:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleBadge = (role: UserRole) => {
        const styles = {
            ADMIN: { bg: "bg-purple-100", text: "text-purple-700", icon: <Crown className="w-3 h-3" /> },
            EXPERT: { bg: "bg-emerald-100", text: "text-emerald-700", icon: <GraduationCap className="w-3 h-3" /> },
            USER: { bg: "bg-blue-100", text: "text-blue-700", icon: <UserIcon className="w-3 h-3" /> },
        };
        const style = styles[role] || styles.USER;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                {style.icon}
                {role}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <Shield className="w-8 h-8 text-purple-600" />
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            ระบบจัดการผู้ใช้และการตั้งค่าระบบ
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                            Administrator
                        </span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <StatCard
                        title="ผู้ใช้ทั้งหมด"
                        value={stats.totalUsers}
                        icon={<Users className="w-5 h-5" />}
                        color="text-blue-600"
                        bgColor="bg-blue-500/10"
                    />
                    <StatCard
                        title="ผู้เชี่ยวชาญ"
                        value={stats.totalExperts}
                        icon={<GraduationCap className="w-5 h-5" />}
                        color="text-emerald-600"
                        bgColor="bg-emerald-500/10"
                    />
                    <StatCard
                        title="รายงานทั้งหมด"
                        value={stats.totalReports}
                        icon={<FileText className="w-5 h-5" />}
                        color="text-purple-600"
                        bgColor="bg-purple-500/10"
                    />
                    <StatCard
                        title="รอตรวจสอบ"
                        value={stats.pendingReports}
                        icon={<Clock className="w-5 h-5" />}
                        color="text-yellow-600"
                        bgColor="bg-yellow-500/10"
                    />
                    <StatCard
                        title="ขอเป็นผู้เชี่ยวชาญ"
                        value={stats.expertRequests}
                        icon={<UserCog className="w-5 h-5" />}
                        color="text-rose-600"
                        bgColor="bg-rose-500/10"
                    />
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:w-[500px]">
                        <TabsTrigger value="users" className="gap-2">
                            <Users className="w-4 h-4" />
                            จัดการผู้ใช้
                        </TabsTrigger>
                        <TabsTrigger value="system" className="gap-2">
                            <Activity className="w-4 h-4" />
                            สถานะระบบ
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2">
                            <Settings className="w-4 h-4" />
                            ตั้งค่า
                        </TabsTrigger>
                    </TabsList>

                    {/* User Management Tab */}
                    <TabsContent value="users" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    รายชื่อผู้ใช้งาน
                                </CardTitle>
                                <CardDescription>
                                    จัดการบัญชีผู้ใช้และกำหนดสิทธิ์การเข้าถึง
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b text-left text-sm text-muted-foreground">
                                                <th className="pb-3 font-medium">ผู้ใช้</th>
                                                <th className="pb-3 font-medium">Email</th>
                                                <th className="pb-3 font-medium">Role</th>
                                                <th className="pb-3 font-medium text-center">รายงาน</th>
                                                <th className="pb-3 font-medium">สมัครเมื่อ</th>
                                                <th className="pb-3 font-medium text-right">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((u) => (
                                                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/50">
                                                    <td className="py-4">
                                                        <span className="font-medium">{u.userName}</span>
                                                    </td>
                                                    <td className="py-4 text-sm text-muted-foreground">
                                                        {u.email}
                                                    </td>
                                                    <td className="py-4">
                                                        {getRoleBadge(u.role)}
                                                    </td>
                                                    <td className="py-4 text-center">
                                                        <span className="font-bold">{u.reportCount}</span>
                                                    </td>
                                                    <td className="py-4 text-sm text-muted-foreground">
                                                        {format(new Date(u.createdAt), "d MMM yyyy", { locale: th })}
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" disabled={isLoading}>
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={() => handleRoleChange(u.id, UserRole.USER)}
                                                                    disabled={u.role === UserRole.USER}
                                                                >
                                                                    <UserIcon className="w-4 h-4 mr-2" />
                                                                    Set as USER
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleRoleChange(u.id, UserRole.EXPERT)}
                                                                    disabled={u.role === UserRole.EXPERT}
                                                                >
                                                                    <GraduationCap className="w-4 h-4 mr-2" />
                                                                    Set as EXPERT
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => handleRoleChange(u.id, UserRole.ADMIN)}
                                                                    disabled={u.role === UserRole.ADMIN}
                                                                    className="text-purple-600"
                                                                >
                                                                    <Crown className="w-4 h-4 mr-2" />
                                                                    Set as ADMIN
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* System Health Tab */}
                    <TabsContent value="system" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Database className="w-5 h-5" />
                                        Database
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Size</span>
                                            <span className="font-medium">{health.databaseSize}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Status</span>
                                            <span className="flex items-center gap-1 text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                                Connected
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Activity className="w-5 h-5" />
                                        Activity Today
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">New Reports</span>
                                            <span className="font-bold text-2xl">{health.reportsToday}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Active Users</span>
                                            <span className="font-medium">{health.activeUsers}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Security
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Auth Provider</span>
                                            <span className="font-medium">Supabase</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">RLS</span>
                                            <span className="flex items-center gap-1 text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                                Enabled
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    ตั้งค่าระบบ
                                </CardTitle>
                                <CardDescription>
                                    การตั้งค่าระบบและการกำหนดค่าต่างๆ
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-center py-8">
                                    ส่วนนี้กำลังพัฒนา...
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, bgColor }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}) {
    return (
        <Card>
            <CardContent className="p-4 flex flex-col gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${bgColor} ${color}`}>
                    {icon}
                </div>
                <span className="text-xs text-muted-foreground font-medium">{title}</span>
                <span className="text-xl font-bold">{value}</span>
            </CardContent>
        </Card>
    );
}
