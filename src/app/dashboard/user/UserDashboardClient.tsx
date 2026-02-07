"use client";

import React, { useState, useMemo } from 'react';
import { UserStatistics, UserReportHistory, UserGalleryItem } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
    LayoutDashboard,
    History,
    Camera,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronRight,
    Filter
} from "lucide-react";
import Image from "next/image";
import { User } from "@supabase/supabase-js";

interface UserDashboardClientProps {
    user: User;
    stats: UserStatistics;
    history: UserReportHistory[];
    gallery: UserGalleryItem[];
}

export default function UserDashboardClient({ user, stats, history, gallery }: UserDashboardClientProps) {
    const [selectedPlant, setSelectedPlant] = useState<string | null>(null);

    const uniquePlants = useMemo(() => {
        const plants = gallery.map(item => item.plantName);
        return Array.from(new Set(plants));
    }, [gallery]);

    const filteredGallery = useMemo(() => {
        if (!selectedPlant) return gallery;
        return gallery.filter(item => item.plantName === selectedPlant);
    }, [gallery, selectedPlant]);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">แผงควบคุมผู้ใช้งาน</h1>
                        <p className="text-muted-foreground mt-1">
                            ยินดีต้อนรับกลับมา, {user.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            ผู้ใช้งานทั่วไป
                        </span>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        title="รายงานทั้งหมด"
                        value={stats.totalReports}
                        icon={<LayoutDashboard className="w-5 h-5" />}
                        color="text-blue-600"
                        bgColor="bg-blue-500/10"
                    />
                    <StatCard
                        title="ได้รับการอนุมัติ"
                        value={stats.verifiedReports}
                        icon={<CheckCircle2 className="w-5 h-5" />}
                        color="text-green-600"
                        bgColor="bg-green-500/10"
                    />
                    <StatCard
                        title="รอตรวจสอบ"
                        value={stats.pendingReports}
                        icon={<Clock className="w-5 h-5" />}
                        color="text-yellow-600"
                        bgColor="bg-yellow-500/10"
                    />
                    <StatCard
                        title="ไม่ผ่านการอนุมัติ"
                        value={stats.rejectedReports}
                        icon={<XCircle className="w-5 h-5" />}
                        color="text-red-600"
                        bgColor="bg-red-500/10"
                    />
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="timeline" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                        <TabsTrigger value="timeline" className="flex items-center gap-2">
                            <History className="w-4 h-4" />
                            ไทม์ไลน์และประวัติ
                        </TabsTrigger>
                        <TabsTrigger value="gallery" className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            สมุดภาพ (Diary)
                        </TabsTrigger>
                    </TabsList>

                    {/* Timeline Tab Content */}
                    <TabsContent value="timeline" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">ประวัติรายงายล่าสุด</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {history.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground">
                                        ยังไม่มีประวัติการรายงาน
                                    </div>
                                ) : (
                                    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                        {history.map((report) => (
                                            <div key={report.id} className="relative flex items-start gap-6 pl-12 group">
                                                <div className="absolute left-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-sm ring-8 ring-background group-hover:scale-110 transition-transform">
                                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                                </div>
                                                <div className="flex-1 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-lg">{report.pestName}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {report.plantName} | {report.province}
                                                            </p>
                                                        </div>
                                                        <StatusBadge status={report.status} />
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                                                        <span>{format(new Date(report.reportedAt), "d MMM yyyy HH:mm", { locale: th })}</span>
                                                        <Button variant="ghost" size="sm" className="h-8 gap-1 group/btn">
                                                            ดูรายละเอียด <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Gallery Tab Content */}
                    <TabsContent value="gallery" className="mt-6">
                        <div className="space-y-6">
                            {/* Filter Section */}
                            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                <Button
                                    variant={selectedPlant === null ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedPlant(null)}
                                    className="rounded-full shrink-0"
                                >
                                    ทั้งหมด
                                </Button>
                                {uniquePlants.map(plant => (
                                    <Button
                                        key={plant}
                                        variant={selectedPlant === plant ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedPlant(plant)}
                                        className="rounded-full shrink-0"
                                    >
                                        {plant}
                                    </Button>
                                ))}
                            </div>

                            {filteredGallery.length === 0 ? (
                                <Card>
                                    <CardContent className="py-20 text-center text-muted-foreground">
                                        ไม่พบรูปภาพในหมวดหมู่นี้
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {filteredGallery.map((item) => (
                                        <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden border bg-muted shadow-sm hover:shadow-lg transition-all">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.caption || item.pestName}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                                <p className="text-white text-xs font-bold truncate">{item.pestName}</p>
                                                <p className="text-white/70 text-[10px] truncate">{item.plantName}</p>
                                                <p className="text-white/50 text-[9px] mt-1">
                                                    {format(new Date(item.reportedAt), "d MMM yy", { locale: th })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, bgColor }: { title: string, value: number, icon: React.ReactNode, color: string, bgColor: string }) {
    return (
        <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
            <CardContent className="px-6 py-5 flex flex-col gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${bgColor} ${color}`}>
                    {icon}
                </div>
                <span className="text-sm text-muted-foreground font-medium">{title}</span>
                <span className="text-2xl font-bold">{value}</span>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        APPROVED: "bg-green-100 text-green-700 border-green-200",
        PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
        REJECTED: "bg-red-100 text-red-700 border-red-200",
    };
    const labels = {
        APPROVED: "อนุมัติแล้ว",
        PENDING: "รอตรวจสอบ",
        REJECTED: "ไม่ผ่าน",
    };

    const key = status as keyof typeof styles;

    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${styles[key] || "bg-gray-100 text-gray-700"}`}>
            {labels[key] || status}
        </span>
    );
}
