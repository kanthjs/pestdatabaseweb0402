import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from 'react';
import { ExpertStatistics, ExpertAnalyticsData } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    ClipboardCheck,
    CheckCircle,
    TrendingUp,
    BarChart3,
    Map,
    Calendar
} from "lucide-react";
import { User } from "@supabase/supabase-js";

import DashboardClient from "../DashboardClient";

interface ExpertDashboardClientProps {
    user: User;
    stats: ExpertStatistics;
    analytics: ExpertAnalyticsData;
}

export default function ExpertDashboardClient({ user, stats, analytics }: ExpertDashboardClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const viewMode = (searchParams.get("view") as "global" | "personal") || "global";

    const setViewMode = (mode: "global" | "personal") => {
        const params = new URLSearchParams(searchParams);
        params.set("view", mode);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <ClipboardCheck className="w-8 h-8 text-primary" />
                            Expert Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            สวัสดีผู้เชี่ยวชาญ {user.email} - ตรวจสอบและติดตามสถานการณ์ศัตรูพืช
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-muted p-1 rounded-lg flex">
                            <Button
                                variant={viewMode === "global" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("global")}
                                className="h-8 text-xs px-3"
                            >
                                ALL
                            </Button>
                            <Button
                                variant={viewMode === "personal" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("personal")}
                                className="h-8 text-xs px-3"
                            >
                                My Report
                            </Button>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                            Expert Access
                        </span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="ยืนยันวันนี้"
                        value={stats.verifiedToday}
                        icon={<CheckCircle className="w-5 h-5" />}
                        color="text-green-600"
                        bgColor="bg-green-500/10"
                    />
                    <StatCard
                        title="ยืนยันสัปดาห์นี้"
                        value={stats.verifiedThisWeek}
                        icon={<TrendingUp className="w-5 h-5" />}
                        color="text-blue-600"
                        bgColor="bg-blue-500/10"
                    />
                    <StatCard
                        title="ยืนยันทั้งหมด"
                        value={stats.totalVerified}
                        icon={<BarChart3 className="w-5 h-5" />}
                        color="text-purple-600"
                        bgColor="bg-purple-500/10"
                    />
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                        <TabsTrigger value="overview" className="gap-2">
                            <Map className="w-4 h-4" />
                            Dashboard Overview
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* Dashboard Overview Tab */}
                    <TabsContent value="overview" className="mt-6">
                        <div className="bg-card border rounded-xl overflow-hidden p-0">
                            <DashboardClient
                                userEmail={viewMode === "personal" ? (user.email || undefined) : undefined}
                                title={viewMode === "personal" ? "Personal Work Summary" : "Global Crop Health Overview"}
                                description={viewMode === "personal" ? "สถิติจำนวนรายงานที่คุณเป็นผู้บันทึก" : "ภาพรวมรายงานศัตรูพืชทั้งหมดในฐานข้อมูล"}
                            />
                        </div>
                    </TabsContent>



                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Reports by Province */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">รายงานตามจังหวัด (Top 10)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {analytics.reportsByProvince.map((item, index) => (
                                            <div key={item.province} className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <span className="flex-1 text-sm">{item.province}</span>
                                                <span className="font-bold text-primary">{item.count}</span>
                                            </div>
                                        ))}
                                        {analytics.reportsByProvince.length === 0 && (
                                            <p className="text-center text-muted-foreground py-4">ไม่มีข้อมูล</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Reports by Pest */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">รายงานตามศัตรูพืช (Top 10)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {analytics.reportsByPest.map((item, index) => (
                                            <div key={item.pest} className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <span className="flex-1 text-sm">{item.pest}</span>
                                                <span className="font-bold text-rose-500">{item.count}</span>
                                            </div>
                                        ))}
                                        {analytics.reportsByPest.length === 0 && (
                                            <p className="text-center text-muted-foreground py-4">ไม่มีข้อมูล</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Daily Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    แนวโน้มรายงานรายวัน (30 วัน)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-48 flex items-end gap-1">
                                    {analytics.reportsByDay.map((item) => {
                                        const maxCount = Math.max(...analytics.reportsByDay.map(d => d.count), 1);
                                        const height = (item.count / maxCount) * 100;
                                        return (
                                            <div
                                                key={item.date}
                                                className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t cursor-pointer relative group"
                                                style={{ height: `${Math.max(height, 5)}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-10">
                                                    {item.date}: {item.count} reports
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {analytics.reportsByDay.length === 0 && (
                                        <p className="w-full text-center text-muted-foreground">ไม่มีข้อมูล</p>
                                    )}
                                </div>
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
            <CardContent className="p-6 flex flex-col gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${bgColor} ${color}`}>
                    {icon}
                </div>
                <span className="text-sm text-muted-foreground font-medium">{title}</span>
                <span className="text-2xl font-bold">{value}</span>
            </CardContent>
        </Card>
    );
}
