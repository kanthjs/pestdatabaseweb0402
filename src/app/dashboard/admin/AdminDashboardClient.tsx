"use client";

import React from 'react';
import { AdminStatistics, UserListItem, SystemHealth } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    GraduationCap,
    List
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import UsersTable from "./components/UsersTable";
import ReportsTable from "./components/ReportsTable";
import ActivityLogsTable from "./components/ActivityLogsTable";
import MasterDataTab from "./components/MasterDataTab";

interface AdminDashboardClientProps {
    user: User;
    stats: AdminStatistics;
    users: UserListItem[];
    health: SystemHealth;
}

export default function AdminDashboardClient({ user: _user, stats, users, health }: AdminDashboardClientProps) {
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
                <Tabs defaultValue="reports" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 md:w-[700px]">
                        <TabsTrigger value="reports" className="gap-2">
                            <FileText className="w-4 h-4" />
                            Reports
                        </TabsTrigger>
                        <TabsTrigger value="users" className="gap-2">
                            <Users className="w-4 h-4" />
                            Users
                        </TabsTrigger>
                        <TabsTrigger value="master" className="gap-2">
                            <Database className="w-4 h-4" />
                            Data
                        </TabsTrigger>
                        <TabsTrigger value="logs" className="gap-2">
                            <List className="w-4 h-4" />
                            Logs
                        </TabsTrigger>
                        <TabsTrigger value="system" className="gap-2">
                            <Activity className="w-4 h-4" />
                            System
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2">
                            <Settings className="w-4 h-4" />
                            Config
                        </TabsTrigger>
                    </TabsList>

                    {/* Reports Tab */}
                    <TabsContent value="reports" className="mt-6">
                        <ReportsTable />
                    </TabsContent>

                    {/* Users Management Tab */}
                    <TabsContent value="users" className="mt-6">
                        <UsersTable users={users} />
                    </TabsContent>

                    {/* Master Data Tab */}
                    <TabsContent value="master" className="mt-6">
                        <MasterDataTab />
                    </TabsContent>

                    {/* Activity Logs Tab */}
                    <TabsContent value="logs" className="mt-6">
                        <ActivityLogsTable />
                    </TabsContent>

                    {/* System Health Tab */}
                    <TabsContent value="system" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-100 rounded-full">
                                            <Database className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Database Size</p>
                                            <h3 className="text-2xl font-bold">{health.databaseSize}</h3>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center text-sm text-green-600">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Operational
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-100 rounded-full">
                                            <Activity className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Reports Today</p>
                                            <h3 className="text-2xl font-bold">{health.reportsToday}</h3>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-purple-100 rounded-full">
                                            <Shield className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Security</p>
                                            <h3 className="text-2xl font-bold">Standard</h3>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center text-sm text-green-600">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        RLS Enabled
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="mt-6">
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium">System Settings</h3>
                                <p className="text-muted-foreground mt-2">
                                    Configuration options coming soon in Phase 3.
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
