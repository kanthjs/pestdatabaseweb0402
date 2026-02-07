"use client";

import React, { useState } from 'react';
import { ExpertStatistics, PendingReport, ExpertAnalyticsData, approveReport, rejectReport } from "./actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
    ClipboardCheck,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    BarChart3,
    Eye,
    ThumbsUp,
    ThumbsDown,
    Map,
    AlertTriangle,
    Calendar
} from "lucide-react";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

interface ExpertDashboardClientProps {
    user: User;
    stats: ExpertStatistics;
    pendingReports: PendingReport[];
    analytics: ExpertAnalyticsData;
}

export default function ExpertDashboardClient({ user, stats, pendingReports, analytics }: ExpertDashboardClientProps) {
    const router = useRouter();
    const [selectedReport, setSelectedReport] = useState<PendingReport | null>(null);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleApprove = async (reportId: string) => {
        setIsLoading(true);
        try {
            await approveReport(reportId);
            router.refresh();
        } catch (error) {
            console.error("Error approving report:", error);
        } finally {
            setIsLoading(false);
            setSelectedReport(null);
        }
    };

    const handleReject = async () => {
        if (!selectedReport) return;
        setIsLoading(true);
        try {
            await rejectReport(selectedReport.id, rejectionReason);
            router.refresh();
        } catch (error) {
            console.error("Error rejecting report:", error);
        } finally {
            setIsLoading(false);
            setIsRejectDialogOpen(false);
            setSelectedReport(null);
            setRejectionReason("");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <ClipboardCheck className="w-8 h-8 text-primary" />
                            Expert Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            สวัสดีผู้เชี่ยวชาญ {user.email} - ตรวจสอบและยืนยันรายงานศัตรูพืช
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                            Expert Access
                        </span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        title="รอการตรวจสอบ"
                        value={stats.pendingVerification}
                        icon={<Clock className="w-5 h-5" />}
                        color="text-yellow-600"
                        bgColor="bg-yellow-500/10"
                    />
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
                <Tabs defaultValue="queue" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                        <TabsTrigger value="queue" className="gap-2">
                            <ClipboardCheck className="w-4 h-4" />
                            Verification Queue
                            {stats.pendingVerification > 0 && (
                                <span className="ml-1 px-2 py-0.5 rounded-full bg-yellow-500 text-white text-xs">
                                    {stats.pendingVerification}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* Verification Queue Tab */}
                    <TabsContent value="queue" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-yellow-500" />
                                    รายงานที่รอการตรวจสอบ
                                </CardTitle>
                                <CardDescription>
                                    ตรวจสอบและยืนยันรายงานจากผู้ใช้งาน (เรียงจากเก่าสุดก่อน)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingReports.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                                        <p className="font-medium">ไม่มีรายงานที่รอการตรวจสอบ</p>
                                        <p className="text-sm">คุณทำงานได้ดีมาก!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingReports.map((report) => (
                                            <div
                                                key={report.id}
                                                className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    {/* Images */}
                                                    <div className="flex gap-2 shrink-0">
                                                        {report.imageUrls.slice(0, 2).map((url, i) => (
                                                            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                                                <Image
                                                                    src={url}
                                                                    alt="Report image"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                        {report.imageUrls.length === 0 && (
                                                            <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                                                                <span className="text-xs text-muted-foreground">No Image</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-lg">{report.pestName}</h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    พืช: {report.plantName} | จ.{report.province}
                                                                </p>
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">
                                                                {format(new Date(report.reportedAt), "d MMM yyyy HH:mm", { locale: th })}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-wrap gap-4 text-sm">
                                                            <div className="flex items-center gap-1">
                                                                <Map className="w-4 h-4 text-muted-foreground" />
                                                                <span>{report.fieldAffectedArea} ไร่</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                                                <span>Incidence: {report.incidencePercent}%</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                                                <span>Severity: {report.severityPercent}%</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                                <span>โดย: {report.reporterName}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex md:flex-col gap-2 shrink-0">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="gap-1"
                                                            onClick={() => setSelectedReport(report)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            ดูรายละเอียด
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="gap-1 bg-green-600 hover:bg-green-700"
                                                            onClick={() => handleApprove(report.id)}
                                                            disabled={isLoading}
                                                        >
                                                            <ThumbsUp className="w-4 h-4" />
                                                            อนุมัติ
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="gap-1"
                                                            onClick={() => {
                                                                setSelectedReport(report);
                                                                setIsRejectDialogOpen(true);
                                                            }}
                                                            disabled={isLoading}
                                                        >
                                                            <ThumbsDown className="w-4 h-4" />
                                                            ปฏิเสธ
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

            {/* Reject Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ปฏิเสธรายงาน</DialogTitle>
                        <DialogDescription>
                            กรุณาระบุเหตุผลในการปฏิเสธรายงานนี้
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="เหตุผลในการปฏิเสธ..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={4}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                            ยกเลิก
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={!rejectionReason.trim() || isLoading}
                        >
                            ยืนยันปฏิเสธ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
