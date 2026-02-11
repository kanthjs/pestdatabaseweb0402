"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { Province, PestReportFormData } from "./types";

const ReportMap = dynamic(() => import("@/components/ReportMap"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center text-muted-foreground">Loading Map...</div>
});

interface LocationStepProps {
    provinces: Province[];
    formData: PestReportFormData;
    setFormData: React.Dispatch<React.SetStateAction<PestReportFormData>>;
}

export function LocationStep({ provinces, formData, setFormData }: LocationStepProps) {
    const handleInputChange = (field: keyof PestReportFormData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
                <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary">
                    <span className="material-icons-outlined text-2xl">location_on</span>
                </div>
                <div>
                    <CardTitle className="text-xl font-display text-primary">Location Information</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">Where did you find the pest?</p>
                </div>
            </CardHeader>
            <CardContent className="pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    {/* Province Selection */}
                    <div className="col-span-1 space-y-3">
                        <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Province</Label>
                        <div className="relative">
                            <select
                                title="Select province"
                                className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                                value={formData.provinceCode}
                                onChange={(e) => handleInputChange("provinceCode", e.target.value)}
                            >
                                <option value="">Select a province</option>
                                {provinces.map((p) => (
                                    <option key={p.provinceId} value={p.provinceCode}>
                                        {p.provinceNameTh || p.provinceNameEn}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-primary">
                                <span className="material-icons-outlined">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Lat/Long display */}
                    <div className="col-span-1 grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Latitude</Label>
                            <div className="h-12 px-4 rounded-xl border border-border bg-muted/30 flex items-center text-primary font-mono text-sm">
                                {formData.latitude.toFixed(6)}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Longitude</Label>
                            <div className="h-12 px-4 rounded-xl border border-border bg-muted/30 flex items-center text-primary font-mono text-sm">
                                {formData.longitude.toFixed(6)}
                            </div>
                        </div>
                    </div>

                    {/* GPS Button */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-12 rounded-xl border-border bg-background text-primary hover:bg-muted/50"
                            onClick={() => {
                                if (navigator.geolocation) {
                                    navigator.geolocation.getCurrentPosition((pos) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            latitude: pos.coords.latitude,
                                            longitude: pos.coords.longitude,
                                        }));
                                    });
                                }
                            }}
                        >
                            <span className="material-icons-outlined mr-2">my_location</span>
                            Use Current Location
                        </Button>

                        {/* Map Integration */}
                        {(formData.latitude !== 0 || formData.longitude !== 0) && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                                <Label className="text-sm text-muted-foreground font-normal">Location Preview</Label>
                                <ReportMap
                                    latitude={formData.latitude}
                                    longitude={formData.longitude}
                                    onLocationChange={(lat, lng) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            latitude: lat,
                                            longitude: lng,
                                        }));
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </>
    );
}
