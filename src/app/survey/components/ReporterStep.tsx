"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PestReportFormData, REPORTER_ROLES } from "./types";

interface ReporterStepProps {
    formData: PestReportFormData;
    setFormData: React.Dispatch<React.SetStateAction<PestReportFormData>>;
}

export function ReporterStep({ formData, setFormData }: ReporterStepProps) {
    const handleInputChange = (field: keyof PestReportFormData, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
                <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary">
                    <span className="material-icons-outlined text-2xl">person</span>
                </div>
                <div>
                    <CardTitle className="text-xl font-display text-primary">Reporter Information</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">Who is reporting this outbreak?</p>
                </div>
            </CardHeader>
            <CardContent className="pt-8">
                <div className="space-y-8">
                    {/* Anonymous Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                        <div className="space-y-0.5">
                            <Label className="text-base font-bold text-primary">Report Anonymously</Label>
                            <p className="text-sm text-muted-foreground">
                                Hide your identity from the public report.
                            </p>
                        </div>
                        <Switch
                            checked={formData.isAnonymous}
                            onCheckedChange={(checked) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    isAnonymous: checked,
                                    reporterFirstName: checked ? "" : prev.reporterFirstName,
                                    reporterLastName: checked ? "" : prev.reporterLastName,
                                    reporterPhone: checked ? "" : prev.reporterPhone,
                                    reporterRole: checked ? "" : prev.reporterRole,
                                }));
                            }}
                        />
                    </div>

                    {/* Reporter Fields */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 transition-all duration-300 ${formData.isAnonymous ? "opacity-50 pointer-events-none grayscale" : ""}`}>
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">First Name</Label>
                            <Input
                                disabled={formData.isAnonymous}
                                value={formData.reporterFirstName}
                                onChange={(e) => handleInputChange("reporterFirstName", e.target.value)}
                                className="h-12 rounded-xl border-border bg-background"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Last Name</Label>
                            <Input
                                disabled={formData.isAnonymous}
                                value={formData.reporterLastName}
                                onChange={(e) => handleInputChange("reporterLastName", e.target.value)}
                                className="h-12 rounded-xl border-border bg-background"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Phone Number</Label>
                            <Input
                                disabled={formData.isAnonymous}
                                value={formData.reporterPhone}
                                onChange={(e) => handleInputChange("reporterPhone", e.target.value)}
                                className="h-12 rounded-xl border-border bg-background"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Role</Label>
                            <div className="relative">
                                <select
                                    title="Select reporter role"
                                    disabled={formData.isAnonymous}
                                    value={formData.reporterRole}
                                    onChange={(e) => handleInputChange("reporterRole", e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-border bg-background appearance-none outline-none disabled:cursor-not-allowed"
                                >
                                    <option value="">Select your role</option>
                                    {REPORTER_ROLES.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                                    <span className="material-icons-outlined">expand_more</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </>
    );
}
