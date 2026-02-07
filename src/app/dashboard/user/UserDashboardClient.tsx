"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ClipboardCheck,
    CheckCircle,
    FileText,
    Leaf,
    Bug,
    Download
} from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { ReportStatus } from "@prisma/client";
import { exportUserReportsToCSV } from "./actions";

interface UserDashboardClientProps {
    userProfile: any;
    stats: {
        totalReports: number;
        verifiedReports: number;
    };
    recentReports: any[];
    topPests: { name: string; count: number }[];
}

export default function UserDashboardClient({ userProfile, stats, recentReports, topPests }: UserDashboardClientProps) {

    const handleExportCSV = async () => {
        try {
            const csv = await exportUserReportsToCSV();
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `my-reports-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export reports:", error);
            alert("Failed to export reports");
        }
    };

    const getStatusBadge = (status: ReportStatus) => {
        switch (status) {
            case ReportStatus.APPROVED:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">อนุมัติแล้ว</span>;
            case ReportStatus.REJECTED:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">ปฏิเสธ</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">รอตรวจสอบ</span>;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <Leaf className="w-8 h-8 text-primary" />
                            My Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            ยินดีต้อนรับคุณ {userProfile.firstName || userProfile.userName} - จัดการข้อมูลการรายงานของคุณ
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleExportCSV}>
                        <Download className="w-4 h-4 mr-2" />
                        Export My Reports
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">รายงานทั้งหมด</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalReports}</div>
                            <p className="text-xs text-muted-foreground">
                                รายงานที่คุณส่งเข้ามาในระบบ
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">ได้รับการยืนยัน</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.verifiedReports}</div>
                            <p className="text-xs text-muted-foreground">
                                รายงานที่ผ่านการตรวจสอบจากผู้เชี่ยวชาญ
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Reports Table */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>รายงานล่าสุด</CardTitle>
                                <CardDescription>ประวัติการรายงานศัตรูพืช 10 รายการล่าสุดของคุณ</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>วันที่</TableHead>
                                            <TableHead>ศัตรูพืช</TableHead>
                                            <TableHead>พืช</TableHead>
                                            <TableHead>จังหวัด</TableHead>
                                            <TableHead>สถานะ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentReports.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell className="font-medium">
                                                    {format(new Date(report.createdAt), "d MMM yyyy", { locale: th })}
                                                </TableCell>
                                                <TableCell>{report.pest.pestNameEn}</TableCell>
                                                <TableCell>{report.plant.plantNameEn}</TableCell>
                                                <TableCell>{report.province}</TableCell>
                                                <TableCell>{getStatusBadge(report.status)}</TableCell>
                                            </TableRow>
                                        ))}
                                        {recentReports.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                    ยังไม่มีข้อมูลการรายงาน
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Pests */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bug className="w-5 h-5" />
                                    ศัตรูพืชที่พบบ่อย
                                </CardTitle>
                                <CardDescription>สถิติการรายงานของคุณ</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topPests.map((pest, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                    {index + 1}
                                                </span>
                                                <span className="text-sm font-medium">{pest.name}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{pest.count} ครั้ง</span>
                                        </div>
                                    ))}
                                    {topPests.length === 0 && (
                                        <p className="text-center text-muted-foreground py-4">ไม่มีข้อมูล</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
