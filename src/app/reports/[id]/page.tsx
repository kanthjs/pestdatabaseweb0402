import { notFound, redirect } from "next/navigation";
import { getReportDetail } from "./actions";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Bug, Sprout, Ruler, Percent, User, Phone, Mail, CheckCircle, XCircle, Clock } from "lucide-react";

interface ReportDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
    const { id } = await params;

    let report;
    try {
        report = await getReportDetail(id);
    } catch (error) {
        if ((error as Error).message === "Unauthorized") {
            redirect("/login?next=/reports/" + id);
        }
        if ((error as Error).message === "Access denied") {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <div className="bg-destructive/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                            <XCircle className="text-destructive w-10 h-10" />
                        </div>
                        <h1 className="text-2xl font-display font-bold text-primary mb-2">
                            Access Denied
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            You don&apos;t have permission to view this report.
                        </p>
                        <Link href="/my-reports">
                            <Button>Back to My Reports</Button>
                        </Link>
                    </div>
                </div>
            );
        }
        notFound();
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "REJECTED":
                return <XCircle className="w-5 h-5 text-destructive" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
            case "REJECTED":
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="secondary">Pending</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Link href="/my-reports">
                    <Button variant="ghost" className="mb-6 -ml-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to My Reports
                    </Button>
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(report.status)}
                        <h1 className="text-3xl font-bold">Report Details</h1>
                        {getStatusBadge(report.status)}
                    </div>
                    <p className="text-muted-foreground">
                        Submitted on {format(new Date(report.reportedAt), "PPP 'at' p")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pest Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bug className="w-5 h-5" />
                                Pest Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm text-muted-foreground">Pest Type</label>
                                <p className="font-medium text-lg">{report.pestName}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Affected Plant</label>
                                <p className="font-medium flex items-center gap-2">
                                    <Sprout className="w-4 h-4" />
                                    {report.plantName}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Symptom Onset Date</label>
                                <p className="font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(report.symptomOnSet), "PPP")}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location & Area */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Location & Impact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm text-muted-foreground">Province</label>
                                <p className="font-medium text-lg">{report.provinceCode}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Coordinates</label>
                                    <p className="font-medium text-sm">
                                        {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Affected Area</label>
                                    <p className="font-medium flex items-center gap-2">
                                        <Ruler className="w-4 h-4" />
                                        {report.fieldAffectedArea} Rai
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Incidence</label>
                                    <p className="font-medium flex items-center gap-2">
                                        <Percent className="w-4 h-4" />
                                        {report.incidencePercent}%
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Severity</label>
                                    <p className="font-medium flex items-center gap-2">
                                        <Percent className="w-4 h-4" />
                                        {report.severityPercent}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reporter Information */}
                    {!report.isAnonymous && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Reporter Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Name</label>
                                    <p className="font-medium">
                                        {report.reporterFirstName} {report.reporterLastName}
                                    </p>
                                </div>
                                {report.reporterPhone && (
                                    <div>
                                        <label className="text-sm text-muted-foreground">Phone</label>
                                        <p className="font-medium flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            {report.reporterPhone}
                                        </p>
                                    </div>
                                )}
                                {report.reporterEmail && (
                                    <div>
                                        <label className="text-sm text-muted-foreground">Email</label>
                                        <p className="font-medium flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {report.reporterEmail}
                                        </p>
                                    </div>
                                )}
                                {report.occupationRoles && (
                                    <div>
                                        <label className="text-sm text-muted-foreground">Role</label>
                                        <p className="font-medium">{report.occupationRoles}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Verification Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Verification Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm text-muted-foreground">Current Status</label>
                                <div className="mt-1">{getStatusBadge(report.status)}</div>
                            </div>
                            {report.verifiedAt && (
                                <div>
                                    <label className="text-sm text-muted-foreground">Verified On</label>
                                    <p className="font-medium">
                                        {format(new Date(report.verifiedAt), "PPP 'at' p")}
                                    </p>
                                </div>
                            )}
                            {report.verifiedBy && (
                                <div>
                                    <label className="text-sm text-muted-foreground">Verified By</label>
                                    <p className="font-medium">{report.verifiedBy}</p>
                                </div>
                            )}
                            {report.status === "REJECTED" && report.rejectionReason && (
                                <div className="bg-destructive/10 p-4 rounded-lg">
                                    <label className="text-sm text-destructive font-medium">Rejection Reason</label>
                                    <p className="text-destructive mt-1">{report.rejectionReason}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Images */}
                {report.imageUrls && report.imageUrls.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Photos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {report.imageUrls.map((url, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                            <img
                                                src={url}
                                                alt={`Report image ${index + 1}`}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        {report.imageCaptions[index] && (
                                            <p className="text-sm text-muted-foreground text-center">
                                                {report.imageCaptions[index]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
