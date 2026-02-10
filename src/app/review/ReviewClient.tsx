"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Clock,
    CheckCircle,
    XCircle,
    Shield,
    MapPin,
    Bug,
    Leaf,
    Calendar,
    ImageIcon,
    User,
    ArrowLeft,
    Filter,
    AlertTriangle,
} from "lucide-react";
import { ReviewReport, ReviewStats, approveReport, rejectReport } from "./actions";

// ─── Types ────────────────────────────────────────────────────────
interface ReviewClientProps {
    stats: ReviewStats;
    reports: ReviewReport[];
    expertName: string;
    currentFilter: string;
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

// ─── Severity Color ───────────────────────────────────────────────
function getSeverityColor(severity: number) {
    if (severity >= 80) return "text-rose-600 bg-rose-500/10";
    if (severity >= 60) return "text-orange-600 bg-orange-500/10";
    if (severity >= 30) return "text-amber-600 bg-amber-500/10";
    return "text-emerald-600 bg-emerald-500/10";
}

// ─── Main Component ───────────────────────────────────────────────
export default function ReviewClient({
    stats,
    reports,
    expertName,
    currentFilter,
}: ReviewClientProps) {
    const router = useRouter();
    const [selectedReport, setSelectedReport] = useState<ReviewReport | null>(null);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [processing, setProcessing] = useState<string | null>(null);
    const [note, setNote] = useState("");

    const handleApprove = async (report: ReviewReport) => {
        setProcessing(report.id);
        try {
            await approveReport(report.id, note || undefined);
            setSelectedReport(null);
            setNote("");
            router.refresh();
        } catch (error) {
            console.error("Approve failed:", error);
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async () => {
        if (!selectedReport || !rejectReason.trim()) return;
        setProcessing(selectedReport.id);
        try {
            const result = await rejectReport(selectedReport.id, rejectReason);
            if (result.success) {
                setIsRejectDialogOpen(false);
                setSelectedReport(null);
                setRejectReason("");
                router.refresh();
            }
        } catch (error) {
            console.error("Reject failed:", error);
        } finally {
            setProcessing(null);
        }
    };

    const setFilter = (status: string) => {
        router.push(`/review?status=${status}`);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* ── Header ────────────────────────────────── */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                                <Shield className="w-8 h-8 text-primary" />
                                Expert Review
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                ตรวจสอบและยืนยันรายงานศัตรูพืช — {expertName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Stats ──────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => setFilter("PENDING")} className="text-left">
                        <Card className={`transition-all hover:shadow-md cursor-pointer ${currentFilter === "PENDING" ? "ring-2 ring-amber-500" : ""}`}>
                            <CardContent className="p-5 flex flex-col gap-1">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1 bg-amber-500/10 text-amber-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <span className="text-sm text-muted-foreground font-medium">รอตรวจสอบ</span>
                                <span className="text-2xl font-bold">{stats.pending}</span>
                            </CardContent>
                        </Card>
                    </button>
                    <button onClick={() => setFilter("APPROVED")} className="text-left">
                        <Card className={`transition-all hover:shadow-md cursor-pointer ${currentFilter === "APPROVED" ? "ring-2 ring-emerald-500" : ""}`}>
                            <CardContent className="p-5 flex flex-col gap-1">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1 bg-emerald-500/10 text-emerald-600">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <span className="text-sm text-muted-foreground font-medium">อนุมัติวันนี้</span>
                                <span className="text-2xl font-bold">{stats.approvedToday}</span>
                            </CardContent>
                        </Card>
                    </button>
                    <button onClick={() => setFilter("REJECTED")} className="text-left">
                        <Card className={`transition-all hover:shadow-md cursor-pointer ${currentFilter === "REJECTED" ? "ring-2 ring-rose-500" : ""}`}>
                            <CardContent className="p-5 flex flex-col gap-1">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1 bg-rose-500/10 text-rose-600">
                                    <XCircle className="w-5 h-5" />
                                </div>
                                <span className="text-sm text-muted-foreground font-medium">ไม่อนุมัติวันนี้</span>
                                <span className="text-2xl font-bold">{stats.rejectedToday}</span>
                            </CardContent>
                        </Card>
                    </button>
                    <Card>
                        <CardContent className="p-5 flex flex-col gap-1">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1 bg-primary/10 text-primary">
                                <Filter className="w-5 h-5" />
                            </div>
                            <span className="text-sm text-muted-foreground font-medium">รายงานทั้งหมด</span>
                            <span className="text-2xl font-bold">{stats.total}</span>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Reports List ───────────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <StatusBadge status={currentFilter} />
                            <span>
                                {currentFilter === "PENDING" && "รายงานที่รอการตรวจสอบ"}
                                {currentFilter === "APPROVED" && "รายงานที่อนุมัติแล้ว"}
                                {currentFilter === "REJECTED" && "รายงานที่ไม่อนุมัติ"}
                            </span>
                            <span className="text-muted-foreground font-normal">({reports.length})</span>
                        </CardTitle>
                        <CardDescription>
                            {currentFilter === "PENDING"
                                ? "คลิกที่รายงานเพื่ออ่านรายละเอียดและทำการตรวจสอบ"
                                : "รายงานที่ผ่านการตรวจสอบแล้ว"
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {reports.length === 0 ? (
                            <div className="text-center py-12 space-y-3">
                                <CheckCircle className="w-12 h-12 mx-auto text-emerald-500/30" />
                                <p className="text-muted-foreground">
                                    {currentFilter === "PENDING"
                                        ? "ไม่มีรายงานที่รอตรวจสอบ 🎉"
                                        : "ไม่มีรายงานในหมวดนี้"
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        className={`p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer ${selectedReport?.id === report.id ? "ring-2 ring-primary bg-muted/50" : ""
                                            }`}
                                        onClick={() => setSelectedReport(report)}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            {/* Left: Main Info */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-base flex items-center gap-1.5">
                                                        <Bug className="w-4 h-4 text-rose-500" />
                                                        {report.pestName}
                                                    </span>
                                                    <span className="text-muted-foreground">on</span>
                                                    <span className="font-medium flex items-center gap-1.5">
                                                        <Leaf className="w-4 h-4 text-emerald-500" />
                                                        {report.plantName}
                                                    </span>
                                                    <StatusBadge status={report.status} />
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {report.province}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {format(new Date(report.reportedAt), "d MMM yy HH:mm", { locale: th })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3.5 h-3.5" />
                                                        {report.reporterName}
                                                    </span>
                                                    {report.imageUrls.length > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <ImageIcon className="w-3.5 h-3.5" />
                                                            {report.imageUrls.length} รูป
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Severity/Incidence */}
                                            <div className="flex items-center gap-3">
                                                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getSeverityColor(report.severityPercent)}`}>
                                                    Sev: {report.severityPercent}%
                                                </div>
                                                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getSeverityColor(report.incidencePercent)}`}>
                                                    Inc: {report.incidencePercent}%
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {report.fieldAffectedArea} ไร่
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rejection reason */}
                                        {report.status === "REJECTED" && report.rejectionReason && (
                                            <div className="mt-3 p-3 bg-rose-500/5 rounded-lg border border-rose-500/10">
                                                <p className="text-sm text-rose-600 flex items-start gap-2">
                                                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <span><strong>เหตุผล:</strong> {report.rejectionReason}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── Report Detail Panel ────────────────────── */}
                {selectedReport && (
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>รายละเอียดรายงาน</span>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)}>
                                    ✕
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InfoItem icon={<Bug className="w-4 h-4" />} label="ศัตรูพืช" value={selectedReport.pestName} />
                                <InfoItem icon={<Leaf className="w-4 h-4" />} label="พืช" value={selectedReport.plantName} />
                                <InfoItem icon={<MapPin className="w-4 h-4" />} label="จังหวัด" value={selectedReport.province} />
                                <InfoItem icon={<Calendar className="w-4 h-4" />} label="วันที่รายงาน" value={format(new Date(selectedReport.reportedAt), "d MMMM yyyy HH:mm", { locale: th })} />
                                <InfoItem icon={<User className="w-4 h-4" />} label="ผู้รายงาน" value={selectedReport.reporterName} />
                                <InfoItem label="พื้นที่" value={`${selectedReport.fieldAffectedArea} ไร่`} />
                                <InfoItem label="ความรุนแรง (Severity)" value={`${selectedReport.severityPercent}%`} highlight={getSeverityColor(selectedReport.severityPercent)} />
                                <InfoItem label="การระบาด (Incidence)" value={`${selectedReport.incidencePercent}%`} highlight={getSeverityColor(selectedReport.incidencePercent)} />
                                <InfoItem label="พิกัด" value={`${selectedReport.latitude.toFixed(4)}, ${selectedReport.longitude.toFixed(4)}`} />
                            </div>

                            {/* Images */}
                            {selectedReport.imageUrls.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        รูปภาพ ({selectedReport.imageUrls.length})
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedReport.imageUrls.map((url, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                                                    <Image
                                                        src={url}
                                                        alt={selectedReport.imageCaptions[i] || `Image ${i + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                    />
                                                </div>
                                                {selectedReport.imageCaptions[i] && (
                                                    <p className="text-sm text-muted-foreground italic">
                                                        {selectedReport.imageCaptions[i]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons — only for PENDING */}
                            {selectedReport.status === "PENDING" && (
                                <div className="space-y-4 pt-4 border-t border-border">
                                    {/* Optional note for approve */}
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                                            Note (ไม่บังคับ)
                                        </label>
                                        <Textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="เพิ่มบันทึก (optional)..."
                                            className="resize-none"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 flex-1 md:flex-initial"
                                            onClick={() => handleApprove(selectedReport)}
                                            disabled={processing === selectedReport.id}
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            {processing === selectedReport.id ? "กำลังดำเนินการ..." : "Approve"}
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="gap-2 flex-1 md:flex-initial"
                                            onClick={() => {
                                                setRejectReason("");
                                                setIsRejectDialogOpen(true);
                                            }}
                                            disabled={processing === selectedReport.id}
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Show verified info for non-pending */}
                            {selectedReport.status !== "PENDING" && selectedReport.verifiedBy && (
                                <div className="pt-4 border-t border-border">
                                    <p className="text-sm text-muted-foreground">
                                        ตรวจสอบโดย <strong>{selectedReport.verifiedBy}</strong>
                                        {selectedReport.verifiedAt && (
                                            <span> เมื่อ {format(new Date(selectedReport.verifiedAt), "d MMM yy HH:mm", { locale: th })}</span>
                                        )}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* ── Reject Dialog ──────────────────────────────── */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <XCircle className="w-5 h-5" />
                            ไม่อนุมัติรายงาน
                        </DialogTitle>
                        <DialogDescription>
                            กรุณาระบุเหตุผลที่ไม่อนุมัติรายงานนี้ เหตุผลจะถูกส่งให้ผู้รายงานทราบ
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="ระบุเหตุผลที่ไม่อนุมัติ... (บังคับ)"
                        className="resize-none"
                        rows={4}
                    />
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRejectDialogOpen(false)}>
                            ยกเลิก
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={!rejectReason.trim() || processing !== null}
                        >
                            {processing ? "กำลังดำเนินการ..." : "ยืนยันไม่อนุมัติ"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ─── Info Item ────────────────────────────────────────────────────
function InfoItem({ icon, label, value, highlight }: {
    icon?: React.ReactNode;
    label: string;
    value: string;
    highlight?: string;
}) {
    return (
        <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                {icon}
                {label}
            </p>
            <p className={`font-semibold ${highlight ? `inline-block px-2 py-0.5 rounded ${highlight}` : ""}`}>
                {value}
            </p>
        </div>
    );
}
