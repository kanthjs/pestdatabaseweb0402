"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    FileText,
    CheckCircle,
    Clock,
    XCircle,
    MapPin,
    Bug,
    Download,
    Plus,
    Eye,
    BarChart3,
    Shield,
} from "lucide-react";
import { MetricsCards } from "./components/MetricsCards";
import { PestRankingChart } from "./components/PestRankingChart";
import { DashboardMetrics, UserStats, UserReportItem, exportUserReportsToCSV } from "./actions";

const AdvancedMap = dynamic(() => import("./components/AdvancedMap"), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────
interface DashboardClientProps {
    role: "guest" | "user" | "expert";
    userEmail?: string;
    userName?: string;
    metrics: DashboardMetrics;
    userStats?: UserStats;
    userReports?: UserReportItem[];
}

// ─── Status Badge ─────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "APPROVED":
            return (
                <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0 gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Approved
                </Badge>
            );
        case "PENDING":
            return (
                <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-0 gap-1">
                    <Clock className="w-3 h-3" />
                    Pending
                </Badge>
            );
        case "REJECTED":
            return (
                <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-0 gap-1">
                    <XCircle className="w-3 h-3" />
                    Rejected
                </Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

// ─── Main Component ───────────────────────────────────────────────
export default function DashboardClient({
    role,
    userName,
    metrics,
    userStats,
    userReports,
}: DashboardClientProps) {
    const [isExporting, setIsExporting] = useState(false);

    // Export CSV handler
    const handleExportCSV = async () => {
        setIsExporting(true);
        try {
            const csv = await exportUserReportsToCSV();
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `my-reports-${format(new Date(), "yyyy-MM-dd")}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export:", error);
        } finally {
            setIsExporting(false);
        }
    };

    // ─── Expert Badge ─────────────────────────────────────────────
    const isExpert = role === "expert";

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* ── Header ────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-primary" />
                            {role === "guest"
                                ? "ข้อมูลศัตรูพืช"
                                : `สวัสดี, ${userName}`
                            }
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {role === "guest"
                                ? "ภาพรวมรายงานศัตรูพืชจากฐานข้อมูล (ย้อนหลัง 30 วัน)"
                                : "แดชบอร์ดภาพรวมข้อมูลศัตรูพืช"
                            }
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isExpert && (
                            <Link href="/review">
                                <Button variant="outline" className="gap-2">
                                    <Shield className="w-4 h-4" />
                                    Review Reports
                                </Button>
                            </Link>
                        )}
                        {role !== "guest" && (
                            <Link href="/survey">
                                <Button className="bg-cta text-cta-foreground hover:bg-cta/90 gap-2">
                                    <Plus className="w-4 h-4" />
                                    Report Pest
                                </Button>
                            </Link>
                        )}
                        {isExpert && (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium dark:bg-emerald-500/10 dark:text-emerald-400">
                                Expert
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Tabs: Global / My Reports ─────────────────── */}
                {role === "guest" ? (
                    // Guest: no tabs, just global view
                    <GlobalOverview metrics={metrics} />
                ) : (
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                            <TabsTrigger value="overview" className="gap-2">
                                <MapPin className="w-4 h-4" />
                                ภาพรวมทั้งหมด
                            </TabsTrigger>
                            <TabsTrigger value="my-reports" className="gap-2">
                                <FileText className="w-4 h-4" />
                                รายงานของฉัน
                            </TabsTrigger>
                        </TabsList>

                        {/* Global Overview Tab */}
                        <TabsContent value="overview" className="mt-6">
                            <GlobalOverview metrics={metrics} />
                        </TabsContent>

                        {/* My Reports Tab */}
                        <TabsContent value="my-reports" className="mt-6 space-y-6">
                            {userStats && userReports && (
                                <MyReportsSection
                                    stats={userStats}
                                    reports={userReports}
                                    onExportCSV={handleExportCSV}
                                    isExporting={isExporting}
                                />
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
}

// ─── Global Overview Section ──────────────────────────────────────
function GlobalOverview({ metrics }: { metrics: DashboardMetrics }) {
    return (
        <div className="space-y-6">
            {/* Metrics Cards */}
            <MetricsCards metrics={metrics} loading={false} />

            {/* Map + Pest Ranking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Map */}
                <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <span className="w-2 h-6 bg-primary rounded-full" />
                            แผนที่การรายงาน
                        </CardTitle>
                        <CardDescription>
                            ตำแหน่งรายงานศัตรูพืช (30 วันล่าสุด)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] rounded-lg overflow-hidden">
                            <AdvancedMap reports={metrics.mapData} />
                        </div>
                    </CardContent>
                </Card>

                {/* Pest Ranking */}
                <PestRankingChart data={metrics.pestRanking} loading={false} />
            </div>
        </div>
    );
}

// ─── My Reports Section ───────────────────────────────────────────
function MyReportsSection({
    stats,
    reports,
    onExportCSV,
    isExporting,
}: {
    stats: UserStats;
    reports: UserReportItem[];
    onExportCSV: () => void;
    isExporting: boolean;
}) {
    return (
        <>
            {/* Personal Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    label="รายงานทั้งหมด"
                    value={stats.totalReports}
                    icon={<FileText className="w-5 h-5" />}
                    color="text-primary"
                    bgColor="bg-primary/10"
                />
                <StatCard
                    label="อนุมัติแล้ว"
                    value={stats.verifiedReports}
                    icon={<CheckCircle className="w-5 h-5" />}
                    color="text-emerald-600"
                    bgColor="bg-emerald-500/10"
                />
                <StatCard
                    label="รอตรวจสอบ"
                    value={stats.pendingReports}
                    icon={<Clock className="w-5 h-5" />}
                    color="text-amber-600"
                    bgColor="bg-amber-500/10"
                />
                <StatCard
                    label="ไม่อนุมัติ"
                    value={stats.rejectedReports}
                    icon={<XCircle className="w-5 h-5" />}
                    color="text-rose-600"
                    bgColor="bg-rose-500/10"
                />
            </div>

            {/* Recent Reports Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                        <CardTitle className="text-lg">รายงานล่าสุดของฉัน</CardTitle>
                        <CardDescription>รายงาน 10 รายการล่าสุดที่คุณบันทึก</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={onExportCSV}
                            disabled={isExporting}
                        >
                            <Download className="w-4 h-4" />
                            {isExporting ? "Exporting..." : "Export CSV"}
                        </Button>
                        <Link href="/my-reports">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Eye className="w-4 h-4" />
                                ดูทั้งหมด
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {reports.length === 0 ? (
                        <div className="text-center py-12 space-y-3">
                            <Bug className="w-12 h-12 mx-auto text-muted-foreground/30" />
                            <p className="text-muted-foreground">คุณยังไม่มีรายงาน</p>
                            <Link href="/survey">
                                <Button className="bg-cta text-cta-foreground hover:bg-cta/90 gap-2 mt-2">
                                    <Plus className="w-4 h-4" />
                                    สร้างรายงานแรกของคุณ
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">วันที่</th>
                                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">จังหวัด</th>
                                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">ศัตรูพืช</th>
                                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">พืช</th>
                                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">สถานะ</th>
                                        <th className="text-left py-3 px-2 text-muted-foreground font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr
                                            key={report.id}
                                            className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">
                                                {format(new Date(report.createdAt), "d MMM yy", { locale: th })}
                                            </td>
                                            <td className="py-3 px-2">{report.province}</td>
                                            <td className="py-3 px-2 font-medium">{report.pestName}</td>
                                            <td className="py-3 px-2">{report.plantName}</td>
                                            <td className="py-3 px-2">
                                                <StatusBadge status={report.status} />
                                                {report.status === "REJECTED" && report.rejectionReason && (
                                                    <p className="text-xs text-rose-500 mt-1 max-w-[200px]">
                                                        {report.rejectionReason}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3 px-2">
                                                <Link href={`/reports/${report.id}`}>
                                                    <Button variant="ghost" size="sm" className="gap-1">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        ดู
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

// ─── Small Stat Card ──────────────────────────────────────────────
function StatCard({ label, value, icon, color, bgColor }: {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}) {
    return (
        <Card>
            <CardContent className="p-5 flex flex-col gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${bgColor} ${color}`}>
                    {icon}
                </div>
                <span className="text-sm text-muted-foreground font-medium">{label}</span>
                <span className="text-2xl font-bold">{value}</span>
            </CardContent>
        </Card>
    );
}
