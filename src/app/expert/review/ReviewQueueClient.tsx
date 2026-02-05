"use client";

import { useState, useTransition } from "react";
import { verifyReport, rejectReport } from "./actions";

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
    isAnonymous: boolean;
    reporterFirstName: string | null;
    reporterLastName: string | null;
    reporterPhone: string | null;
    reporterRoles: string | null;
    status: string;
}

interface ReviewQueueClientProps {
    reports: PestReport[];
}

export default function ReviewQueueClient({ reports }: ReviewQueueClientProps) {
    const [selectedReport, setSelectedReport] = useState<PestReport | null>(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleVerify = (reportId: string) => {
        startTransition(async () => {
            const result = await verifyReport(reportId);
            if (result.success) {
                setSelectedReport(null);
            }
        });
    };

    const handleReject = (reportId: string) => {
        if (!rejectionReason.trim()) return;
        startTransition(async () => {
            const result = await rejectReport(reportId, rejectionReason);
            if (result.success) {
                setSelectedReport(null);
                setRejectModalOpen(false);
                setRejectionReason("");
            }
        });
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <>
            {/* Reports Table */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-display font-semibold text-primary">
                        Pending Reports
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Click on a report to review details and evidence
                    </p>
                </div>

                {reports.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <div className="bg-muted/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-icons-outlined text-4xl text-muted-foreground">
                                task_alt
                            </span>
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-1">
                            All caught up!
                        </h3>
                        <p className="text-muted-foreground">
                            No pending reports to review at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Province
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Pest ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Plant ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Reporter
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Evidence
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {reports.map((report) => (
                                    <tr
                                        key={report.id}
                                        className="hover:bg-muted/10 transition-colors cursor-pointer"
                                        onClick={() => setSelectedReport(report)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                            {formatDate(report.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                                            {report.province}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                                                {report.pestId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                                                {report.plantId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                            {report.isAnonymous ? (
                                                <span className="italic">Anonymous</span>
                                            ) : (
                                                `${report.reporterFirstName || ""} ${report.reporterLastName || ""}`
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {report.imageUrls.length > 0 ? (
                                                <span className="inline-flex items-center gap-1 text-sm text-secondary">
                                                    <span className="material-icons-outlined text-base">
                                                        image
                                                    </span>
                                                    {report.imageUrls.length} photo(s)
                                                </span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    No photos
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleVerify(report.id);
                                                }}
                                                disabled={isPending}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-white text-sm font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 mr-2"
                                            >
                                                <span className="material-icons-outlined text-base">
                                                    check
                                                </span>
                                                Verify
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedReport(report);
                                                    setRejectModalOpen(true);
                                                }}
                                                disabled={isPending}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-destructive text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors disabled:opacity-50"
                                            >
                                                <span className="material-icons-outlined text-base">
                                                    close
                                                </span>
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedReport && !rejectModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-2xl border border-border shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between">
                            <h3 className="text-lg font-display font-semibold text-primary">
                                Report Details
                            </h3>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Location Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                        Province
                                    </p>
                                    <p className="text-foreground font-medium">
                                        {selectedReport.province}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                        Coordinates
                                    </p>
                                    <p className="text-foreground">
                                        {selectedReport.latitude.toFixed(4)},{" "}
                                        {selectedReport.longitude.toFixed(4)}
                                    </p>
                                </div>
                            </div>

                            {/* Pest & Plant Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                        Pest
                                    </p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-destructive/10 text-destructive">
                                        {selectedReport.pestId}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                        Plant
                                    </p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary">
                                        {selectedReport.plantId}
                                    </span>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-muted/20 rounded-xl p-4 text-center">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                        Area Affected
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {selectedReport.filedAffectedArea}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Rai</p>
                                </div>
                                <div className="bg-muted/20 rounded-xl p-4 text-center">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                        Incidence
                                    </p>
                                    <p className="text-2xl font-bold text-accent">
                                        {selectedReport.incidencePercent}%
                                    </p>
                                </div>
                                <div className="bg-muted/20 rounded-xl p-4 text-center">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                        Severity
                                    </p>
                                    <p className="text-2xl font-bold text-destructive">
                                        {selectedReport.severityPercent}%
                                    </p>
                                </div>
                            </div>

                            {/* Evidence Images */}
                            {selectedReport.imageUrls.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                                        Photo Evidence
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedReport.imageUrls.map((url, index) => (
                                            <div
                                                key={index}
                                                className="rounded-xl overflow-hidden border border-border"
                                            >
                                                <img
                                                    src={url}
                                                    alt={selectedReport.imageCaptions[index] || "Evidence"}
                                                    className="w-full h-40 object-cover"
                                                />
                                                {selectedReport.imageCaptions[index] && (
                                                    <p className="p-2 text-sm text-muted-foreground bg-muted/20">
                                                        {selectedReport.imageCaptions[index]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reporter Info */}
                            <div className="bg-muted/10 rounded-xl p-4">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                    Reporter Information
                                </p>
                                {selectedReport.isAnonymous ? (
                                    <p className="text-muted-foreground italic">
                                        This report was submitted anonymously
                                    </p>
                                ) : (
                                    <div className="space-y-1 text-sm">
                                        <p>
                                            <span className="text-muted-foreground">Name:</span>{" "}
                                            <span className="text-foreground">
                                                {selectedReport.reporterFirstName}{" "}
                                                {selectedReport.reporterLastName}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="text-muted-foreground">Phone:</span>{" "}
                                            <span className="text-foreground">
                                                {selectedReport.reporterPhone || "N/A"}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="text-muted-foreground">Role:</span>{" "}
                                            <span className="text-foreground">
                                                {selectedReport.reporterRoles || "N/A"}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="sticky bottom-0 bg-card px-6 py-4 border-t border-border flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setRejectModalOpen(true);
                                }}
                                disabled={isPending}
                                className="px-5 py-2.5 rounded-xl border border-destructive text-destructive font-medium hover:bg-destructive/10 transition-colors disabled:opacity-50"
                            >
                                Reject Report
                            </button>
                            <button
                                onClick={() => handleVerify(selectedReport.id)}
                                disabled={isPending}
                                className="px-5 py-2.5 rounded-xl bg-secondary text-white font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <span className="animate-spin material-icons-outlined text-base">
                                            refresh
                                        </span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-icons-outlined text-base">
                                            verified
                                        </span>
                                        Verify Report
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectModalOpen && selectedReport && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-2xl border border-border shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-destructive/10 p-2 rounded-lg">
                                    <span className="material-icons-outlined text-destructive">
                                        warning
                                    </span>
                                </div>
                                <h3 className="text-lg font-display font-semibold text-primary">
                                    Reject Report
                                </h3>
                            </div>
                            <button
                                onClick={() => {
                                    setRejectModalOpen(false);
                                    setRejectionReason("");
                                }}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-muted-foreground mb-4">
                                Please provide a reason for rejecting this report. This will be
                                recorded for reference.
                            </p>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                className="w-full h-32 px-4 py-3 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setRejectModalOpen(false);
                                    setRejectionReason("");
                                }}
                                className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(selectedReport.id)}
                                disabled={isPending || !rejectionReason.trim()}
                                className="px-5 py-2 rounded-xl bg-destructive text-white font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
                            >
                                {isPending ? "Rejecting..." : "Reject Report"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
