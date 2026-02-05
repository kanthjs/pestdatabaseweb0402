"use client";

import Link from "next/link";

interface PestReport {
    id: string;
    createdAt: Date;
    province: string;
    plantId: string;
    pestId: string;
    symptomOnSet: Date;
    filedAffectedArea: number;
    incidencePercent: number;
    severityPercent: number;
    latitude: number;
    longitude: number;
    imageUrls: string[];
    imageCaptions: string[];
    status: string;
}

interface DashboardClientProps {
    reports: PestReport[];
    totalVerified: number;
    pestDistribution: Array<{ pestId: string; _count: number }>;
    provinceDistribution: Array<{ province: string; _count: number }>;
}

export default function DashboardClient({
    reports,
    totalVerified,
    pestDistribution,
    provinceDistribution,
}: DashboardClientProps) {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Map pest IDs to readable names (simplified)
    const pestNames: Record<string, string> = {
        INS001: "เพลี้ยกระโดดสีน้ำตาล",
        INS002: "หนอนกระทู้ข้าวโพด",
        INS003: "เพลี้ยแป้งมันสำปะหลัง",
        DIS001: "โรคไหม้ข้าว",
    };

    const plantNames: Record<string, string> = {
        P001: "ข้าว",
        P002: "ข้าวโพด",
        P003: "มันสำปะหลัง",
        P004: "อ้อย",
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="material-icons-outlined text-primary text-3xl">
                                    agriculture
                                </span>
                                <span className="font-display font-bold text-xl text-primary">
                                    RicePest<span className="text-secondary">Net</span>
                                </span>
                            </Link>
                            <span className="text-muted-foreground">|</span>
                            <h1 className="text-lg font-medium text-foreground">
                                Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/expert/review"
                                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                            >
                                <span className="material-icons-outlined text-base">admin_panel_settings</span>
                                Expert Panel
                            </Link>
                            <Link
                                href="/survey"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-cta text-cta-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all"
                            >
                                <span className="material-icons-outlined text-base">add</span>
                                Report Pest
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-secondary/20 p-3 rounded-xl">
                                <span className="material-icons-outlined text-secondary text-xl">
                                    verified
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Verified Reports
                                </p>
                                <p className="text-3xl font-bold text-secondary">
                                    {totalVerified}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-destructive/20 p-3 rounded-xl">
                                <span className="material-icons-outlined text-destructive text-xl">
                                    bug_report
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Pest Types
                                </p>
                                <p className="text-3xl font-bold text-destructive">
                                    {pestDistribution.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/20 p-3 rounded-xl">
                                <span className="material-icons-outlined text-primary text-xl">
                                    location_on
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Provinces
                                </p>
                                <p className="text-3xl font-bold text-primary">
                                    {provinceDistribution.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent/20 p-3 rounded-xl">
                                <span className="material-icons-outlined text-accent text-xl">
                                    schedule
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    This Month
                                </p>
                                <p className="text-3xl font-bold text-accent">
                                    {reports.filter(r => {
                                        const reportDate = new Date(r.createdAt);
                                        const now = new Date();
                                        return reportDate.getMonth() === now.getMonth() &&
                                            reportDate.getFullYear() === now.getFullYear();
                                    }).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Reports */}
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-display font-semibold text-primary">
                                        Verified Reports
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Showing only expert-verified pest sightings
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                                    <span className="material-icons-outlined text-base">verified</span>
                                    Verified Only
                                </span>
                            </div>

                            {reports.length === 0 ? (
                                <div className="px-6 py-16 text-center">
                                    <div className="bg-muted/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-icons-outlined text-4xl text-muted-foreground">
                                            inbox
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-medium text-foreground mb-1">
                                        No verified reports yet
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Reports will appear here after expert verification.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {reports.map((report) => (
                                        <div
                                            key={report.id}
                                            className="px-6 py-4 hover:bg-muted/10 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-destructive/10 p-2.5 rounded-xl">
                                                        <span className="material-icons-outlined text-destructive">
                                                            bug_report
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-foreground">
                                                            {pestNames[report.pestId] || report.pestId}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {plantNames[report.plantId] || report.plantId} • {report.province}
                                                        </p>
                                                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <span className="material-icons-outlined text-sm">calendar_today</span>
                                                                {formatDate(report.createdAt)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="material-icons-outlined text-sm">landscape</span>
                                                                {report.filedAffectedArea} ไร่
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                                                        <span className="material-icons-outlined text-xs">check</span>
                                                        Verified
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-4 text-sm">
                                                        <span className="text-accent font-medium">
                                                            {report.incidencePercent}% incidence
                                                        </span>
                                                        <span className="text-destructive font-medium">
                                                            {report.severityPercent}% severity
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Top Provinces */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="text-lg font-display font-semibold text-primary">
                                    Top Provinces
                                </h2>
                            </div>
                            <div className="p-6">
                                {provinceDistribution.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">No data yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {provinceDistribution.map((prov, idx) => (
                                            <div key={prov.province} className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                                    {idx + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {prov.province}
                                                    </p>
                                                    <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full"
                                                            style={{
                                                                width: `${(prov._count / Math.max(...provinceDistribution.map(p => p._count))) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-primary">
                                                    {prov._count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pest Distribution */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="text-lg font-display font-semibold text-primary">
                                    Pest Types
                                </h2>
                            </div>
                            <div className="p-6">
                                {pestDistribution.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">No data yet</p>
                                ) : (
                                    <div className="space-y-3">
                                        {pestDistribution.map((pest) => (
                                            <div
                                                key={pest.pestId}
                                                className="flex items-center justify-between p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="material-icons-outlined text-destructive text-lg">
                                                        pest_control
                                                    </span>
                                                    <span className="text-sm font-medium text-foreground">
                                                        {pestNames[pest.pestId] || pest.pestId}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold text-destructive">
                                                    {pest._count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
