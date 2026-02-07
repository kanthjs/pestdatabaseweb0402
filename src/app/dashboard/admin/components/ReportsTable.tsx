"use client";

import React, { useState, useEffect } from "react";
import { getAdminReports, updateReportStatus, deleteReport, AdminReportItem, exportReportsToCSV } from "../actions";
import { ReportStatus } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, XCircle, Trash2, Filter, Download } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReportsTable() {
    const [reports, setReports] = useState<AdminReportItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");

    const fetchReports = async () => {
        setLoading(true);
        try {
            const status = statusFilter === "ALL" ? undefined : statusFilter;
            const data = await getAdminReports(page, 20, status);
            setReports(data.reports);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [page, statusFilter]);

    const handleStatusChange = async (id: string, newStatus: ReportStatus) => {
        if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
        try {
            await updateReportStatus(id, newStatus);
            fetchReports(); // Refresh
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this report? This action cannot be undone immediately.")) return;
        try {
            await deleteReport(id);
            fetchReports(); // Refresh
        } catch (error) {
            console.error("Failed to delete report:", error);
            alert("Failed to delete report");
        }
    };



    const handleExportCSV = async () => {
        try {
            const csv = await exportReportsToCSV();
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reports-${new Date().toISOString().split('T')[0]}.csv`;
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
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
            case ReportStatus.REJECTED:
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
            case ReportStatus.PENDING:
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Report Management</CardTitle>
                        <CardDescription>View and moderate pest reports.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleExportCSV}>
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ReportStatus | "ALL")}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value={ReportStatus.PENDING}>Pending</SelectItem>
                                <SelectItem value={ReportStatus.APPROVED}>Approved</SelectItem>
                                <SelectItem value={ReportStatus.REJECTED}>Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-4">Loading reports...</div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Reporter</TableHead>
                                    <TableHead>Pest / Plant</TableHead>
                                    <TableHead>Province</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No reports found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell>
                                                {format(new Date(report.createdAt), "d MMM yyyy", { locale: th })}
                                            </TableCell>
                                            <TableCell>{report.reporterName}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{report.pestName}</span>
                                                    <span className="text-xs text-muted-foreground">{report.plantName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{report.province}</TableCell>
                                            <TableCell>{getStatusBadge(report.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusChange(report.id, ReportStatus.APPROVED)}
                                                            disabled={report.status === ReportStatus.APPROVED}
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                            Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusChange(report.id, ReportStatus.REJECTED)}
                                                            disabled={report.status === ReportStatus.REJECTED}
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                                            Reject
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleDelete(report.id)} className="text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                    >
                        Next
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
