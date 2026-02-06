"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserReports, MyReportItem } from "./actions";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function MyReportsClient() {
    const { data: reports, isLoading, isError } = useQuery({
        queryKey: ["my-reports"],
        queryFn: getUserReports,
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive">Failed to load reports. Please try again.</p>
            </div>
        );
    }

    if (!reports || reports.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
                <div className="bg-muted p-4 rounded-full w-fit mx-auto mb-4">
                    <span className="material-icons-outlined text-4xl text-muted-foreground">inventory_2</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">No reports yet</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
                    You haven't submitted any pest reports yet. Help the community by reporting what you see!
                </p>
                <Button asChild className="rounded-full bg-primary text-primary-foreground hover:opacity-90">
                    <Link href="/survey">
                        <span className="material-icons-outlined mr-2">add_a_photo</span>
                        Report Pest
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-display">My Submission History</h2>
                <Button asChild size="sm" variant="outline" className="rounded-full">
                    <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                        "Date,Province,Pest,Status\n" +
                        reports.map(r => `${format(new Date(r.reportedAt), 'yyyy-MM-dd')},${r.province},${r.pestName},${r.status}`).join("\n")
                    )}`} download="my_reports.csv">
                        <span className="material-icons-outlined mr-2">download</span>
                        Export CSV
                    </a>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {reports.map((report) => (
                    <Card key={report.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                            {/* Image Thumbnail */}
                            <div className="h-24 w-24 shrink-0 rounded-lg bg-muted overflow-hidden">
                                {report.imageUrl ? (
                                    <img src={report.imageUrl} alt={report.pestName} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                        <span className="material-icons-outlined">image_not_supported</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg truncate">{report.pestName}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <span className="material-icons-outlined text-[14px]">calendar_today</span>
                                            {format(new Date(report.reportedAt), "PPP")}
                                            <span className="mx-1">•</span>
                                            <span className="material-icons-outlined text-[14px]">location_on</span>
                                            {report.province}
                                        </p>
                                    </div>
                                    <Badge variant={
                                        report.status === "APPROVED" ? "default" :
                                            report.status === "REJECTED" ? "destructive" : "secondary"
                                    } className={`uppercase tracking-wider font-bold ${report.status === "APPROVED" ? "bg-green-500 hover:bg-green-600" : ""
                                        }`}>
                                        {report.status}
                                    </Badge>
                                </div>

                                {report.status === "REJECTED" && (
                                    <div className="bg-destructive/10 text-destructive text-sm p-2 rounded-lg mt-2">
                                        <strong>Reason:</strong> {report.rejectionReason || "No reason provided"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
