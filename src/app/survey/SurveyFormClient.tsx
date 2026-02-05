"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";

// Dynamic import for the Map component to avoid SSR errors
const ReportMap = dynamic(() => import("@/components/ReportMap"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center text-muted-foreground">Loading Map...</div>
});

// Types for the props from database
interface Province {
    provinceId: number;
    provinceNameEn: string;
}

interface Plant {
    plantId: string;
    plantNameEn: string;
}

interface Pest {
    pestId: string;
    pestNameEn: string;
}

interface SurveyFormClientProps {
    provinces: Province[];
    plants: Plant[];
    pests: Pest[];
}

// Form data type matching Prisma schema
interface PestReportFormData {
    province: string;
    latitude: number;
    longitude: number;
    plantId: string;
    pestId: string;
    symptomOnSet: string;
    filedAffectedArea: number;
    incidencePercent: number;
    severityPercent: number;
}

// 4 Step configuration
const STEPS = [
    { id: "location", label: "Location", icon: "location_on" },
    { id: "plant", label: "Plant", icon: "grass" },
    { id: "pest", label: "Pest", icon: "bug_report" }, // แยกออกมาเป็น step ใหม่
    { id: "issue", label: "Issue Details", icon: "pest_control" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export default function SurveyFormClient({
    provinces,
    plants,
    pests,
}: SurveyFormClientProps) {
    const [currentStep, setCurrentStep] = useState<StepId>("location");
    const [formData, setFormData] = useState<PestReportFormData>({
        province: "",
        latitude: 0,
        longitude: 0,
        plantId: "",
        pestId: "",
        symptomOnSet: new Date().toISOString().split("T")[0],
        filedAffectedArea: 0,
        incidencePercent: 0,
        severityPercent: 0,
    });

    const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
    const progressPercent = ((currentStepIndex + 1) / STEPS.length) * 100;

    const handleInputChange = (
        field: keyof PestReportFormData,
        value: string | number
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const goToNextStep = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < STEPS.length) {
            setCurrentStep(STEPS[nextIndex].id);
        }
    };

    const goToPrevStep = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(STEPS[prevIndex].id);
        }
    };

    const handleSubmit = () => {
        console.log("Submitting form data:", formData);
        // TODO: Add server action call here
    };

    return (
        <div className="bg-background text-foreground min-h-screen flex flex-col font-sans transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6 py-4 lg:px-10">
                <Link href="/" className="flex items-center gap-4">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <span className="material-icons-outlined text-2xl">agriculture</span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight text-primary font-display">
                        Rice Pest Survey Network
                    </h2>
                </Link>
                <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                    <nav className="flex items-center gap-6">
                        <Link
                            className="text-sm font-medium text-primary hover:opacity-80 transition-colors"
                            href="/survey"
                        >
                            Report
                        </Link>
                        <Link
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            href="#"
                        >
                            Manage
                        </Link>
                    </nav>
                    <Separator orientation="vertical" className="h-8 border-border" />
                    <ThemeToggle />
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-border shadow-sm cursor-pointer hover:ring-2 ring-primary ring-offset-2 transition-all bg-muted" />
                </div>
                <button className="md:hidden p-2 text-muted-foreground">
                    <span className="material-icons-outlined text-2xl">menu</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8 lg:py-12">
                {/* Main Progress Tracker */}
                <div className="max-w-4xl mx-auto w-full px-6 pt-12">
                    <div className="flex justify-between mb-8 overflow-x-auto pb-2 scrollbar-hide">
                        {STEPS.map((step, idx) => {
                            const isCompleted = idx < currentStepIndex;
                            const isActive = step.id === currentStep;

                            return (
                                <div
                                    key={step.id}
                                    className="flex flex-col items-center gap-3 min-w-[80px]"
                                >
                                    <div
                                        className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                                            : isCompleted
                                                ? "bg-secondary text-secondary-foreground"
                                                : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        <span className="material-icons-outlined text-2xl">
                                            {step.icon}
                                        </span>
                                    </div>
                                    <span
                                        className={`text-xs font-bold uppercase tracking-wider transition-colors ${isActive ? "text-primary" : "text-muted-foreground"
                                            }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-12">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Form Content */}
                <div className="max-w-4xl mx-auto w-full px-6 pb-20">
                    <Card className="border-none shadow-xl shadow-black/5 bg-card overflow-hidden rounded-2xl">
                        <div className="bg-primary/5 px-8 py-1 border-b border-primary/10">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Pest Monitoring Form</span>
                        </div>
                        {/* ===== STEP 1: Location ===== */}
                        {currentStep === "location" && (
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
                                                    value={formData.province}
                                                    onChange={(e) =>
                                                        handleInputChange("province", e.target.value)
                                                    }
                                                >
                                                    <option value="">Select a province</option>
                                                    {provinces.map((p) => (
                                                        <option
                                                            key={p.provinceId}
                                                            value={p.provinceNameEn}
                                                        >
                                                            {p.provinceNameEn}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-primary">
                                                    <span className="material-icons-outlined">
                                                        expand_more
                                                    </span>
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
                                                <span className="material-icons-outlined mr-2">
                                                    my_location
                                                </span>
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
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                latitude: lat,
                                                                longitude: lng
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </>
                        )}

                        {/* ===== STEP 2: Plant ===== */}
                        {currentStep === "plant" && (
                            <>
                                <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
                                    <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary">
                                        <span className="material-icons-outlined text-2xl">grass</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-display text-primary">Plant Selection</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">Select the affected crop</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-8">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {plants.map((plant) => (
                                            <label key={plant.plantId} className="cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="plant"
                                                    value={plant.plantId}
                                                    checked={formData.plantId === plant.plantId}
                                                    onChange={() => handleInputChange("plantId", plant.plantId)}
                                                    className="peer sr-only"
                                                />
                                                <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 transform peer-checked:scale-105 ${formData.plantId === plant.plantId
                                                    ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5"
                                                    : "border-border bg-card text-muted-foreground hover:border-secondary/50 hover:bg-muted/30"
                                                    }`}>
                                                    <div className={`size-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${formData.plantId === plant.plantId ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-secondary/10 group-hover:text-secondary"}`}>
                                                        <span className="material-icons-outlined text-2xl">grass</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-center">{plant.plantNameEn}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </CardContent>
                            </>
                        )}
                        {/* ===== STEP 3: Pest ===== */}
                        {currentStep === "pest" && (
                            <>
                                <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
                                    <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary">
                                        <span className="material-icons-outlined text-2xl">bug_report</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-display text-primary">Pest & Disease</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">What is affecting the plant?</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {pests.map((pest) => (
                                            <label key={pest.pestId} className="cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="pest"
                                                    value={pest.pestId}
                                                    checked={formData.pestId === pest.pestId}
                                                    onChange={() => handleInputChange("pestId", pest.pestId)}
                                                    className="peer sr-only"
                                                />
                                                <div className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-300 peer-checked:translate-x-2 ${formData.pestId === pest.pestId
                                                    ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5"
                                                    : "border-border bg-card text-muted-foreground hover:border-secondary/50 hover:bg-muted/30"
                                                    }`}>
                                                    <div className={`size-10 rounded-lg flex items-center justify-center transition-colors ${formData.pestId === pest.pestId ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-secondary/10 group-hover:text-secondary"}`}>
                                                        <span className="material-icons-outlined text-xl">bug_report</span>
                                                    </div>
                                                    <span className="text-sm font-bold">{pest.pestNameEn}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </CardContent>
                            </>
                        )}
                        {/* ===== STEP 4: Issue ===== */}
                        {currentStep === "issue" && (
                            <>
                                <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
                                    <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary">
                                        <span className="material-icons-outlined text-2xl">pest_control</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-display text-primary">Issue Details</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">Tell us more about the outbreak</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        {/* Symptom Onset Date */}
                                        <div className="col-span-1 space-y-3">
                                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Symptom Onset Date</Label>
                                            <Input
                                                type="date"
                                                className="h-12 rounded-xl border-border bg-background focus:ring-primary/20"
                                                value={formData.symptomOnSet}
                                                onChange={(e) =>
                                                    handleInputChange("symptomOnSet", e.target.value)
                                                }
                                            />
                                        </div>

                                        {/* Affected Area */}
                                        <div className="col-span-1 space-y-3">
                                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Affected Area (Rai)</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="0.0"
                                                    className="h-12 pr-16 rounded-xl border-border bg-background focus:ring-primary/20"
                                                    value={formData.filedAffectedArea || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "filedAffectedArea",
                                                            parseFloat(e.target.value) || 0
                                                        )
                                                    }
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground text-sm font-bold">
                                                    Rai
                                                </div>
                                            </div>
                                        </div>

                                        {/* Incidence Percent */}
                                        <div className="col-span-1 space-y-3">
                                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Incidence Percent</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    title="Incidence percentage"
                                                    className="h-12 pr-12 rounded-xl border-border bg-background focus:ring-primary/20"
                                                    value={formData.incidencePercent || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "incidencePercent",
                                                            parseInt(e.target.value) || 0
                                                        )
                                                    }
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground text-sm font-bold">
                                                    %
                                                </div>
                                            </div>
                                        </div>

                                        {/* Severity Percent */}
                                        <div className="col-span-1 space-y-3">
                                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Severity Percent</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    title="Severity percentage"
                                                    className="h-12 pr-12 rounded-xl border-border bg-background focus:ring-primary/20"
                                                    value={formData.severityPercent || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "severityPercent",
                                                            parseInt(e.target.value) || 0
                                                        )
                                                    }
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground text-sm font-bold">
                                                    %
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tip Callout */}
                                        <div className="col-span-1 md:col-span-2 mt-2 pt-6 border-t">
                                            <Card className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/30">
                                                <CardContent className="flex items-center gap-4 p-4">
                                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full text-yellow-700 dark:text-yellow-500">
                                                        <span className="material-icons-outlined">
                                                            lightbulb
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                                                            Tip: Accurate assessment helps us deploy the right
                                                            solutions.
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </CardContent>
                            </>
                        )}
                        <Separator className="bg-border" />

                        {/* Navigation Buttons */}
                        <CardContent className="py-8 bg-muted/30">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                {currentStepIndex > 0 ? (
                                    <Button
                                        variant="ghost"
                                        className="w-full sm:w-auto px-8 h-12 rounded-full text-muted-foreground hover:text-primary transition-all font-medium"
                                        onClick={goToPrevStep}
                                    >
                                        <span className="material-icons-outlined mr-2">west</span>
                                        Back
                                    </Button>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        asChild
                                        className="w-full sm:w-auto px-8 h-12 rounded-full text-muted-foreground hover:text-primary transition-all font-medium"
                                    >
                                        <Link href="/">
                                            <span className="material-icons-outlined mr-2">close</span>
                                            Cancel
                                        </Link>
                                    </Button>
                                )}

                                <div className="flex w-full sm:w-auto gap-4">
                                    {currentStepIndex < STEPS.length - 1 ? (
                                        <Button
                                            className="grow sm:grow-0 px-10 h-12 rounded-full bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all font-bold"
                                            onClick={goToNextStep}
                                        >
                                            Next Step
                                            <span className="material-icons-outlined ml-2">east</span>
                                        </Button>
                                    ) : (
                                        <Button
                                            className="grow sm:grow-0 px-10 h-12 rounded-full bg-cta text-cta-foreground hover:opacity-90 shadow-lg shadow-orange-500/20 transition-all font-bold"
                                            onClick={handleSubmit}
                                        >
                                            Submit Report
                                            <span className="material-icons-outlined ml-2">check</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer Credits */}
                    <div className="mt-8 text-center px-4">
                        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.3em] mb-2">
                            Agricultural Intelligence System
                        </p>
                        <p className="text-xs text-muted-foreground">
                            RicePestNet System • Ver 1.4.2 • Secured with End-to-End Encryption
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
