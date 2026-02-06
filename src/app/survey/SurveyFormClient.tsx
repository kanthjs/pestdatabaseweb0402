"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { submitPestReport } from "./actions";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";

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
    fieldAffectedArea: number;
    incidencePercent: number;
    severityPercent: number;
    imageUrls: string[];
    imageCaptions: string[];
    isAnonymous: boolean;
    reporterFirstName: string;
    reporterLastName: string;
    reporterPhone: string;
    reporterRole: string;
}

// Reporter Roles
const REPORTER_ROLES = [
    { id: "REP001", label: "Farmer (เกษตรกร)" },
    { id: "REP002", label: "Agriculture Volunteer (อาสาสมัครเกษตร)" },
    { id: "REP003", label: "Agricultural Extension Officer (เจ้าหน้าที่ส่งเสริมการเกษตร)" },
    { id: "REP004", label: "Rice Research Center Staff (เจ้าหน้าที่ศูนย์วิจัยข้าว)" },
    { id: "REP005", label: "Government Officials (เจ้าหน้าที่ราชการ)" },
    { id: "REP006", label: "Community Leader (ผู้นำชุมชน)" },
    { id: "REP007", label: "University Researcher (อาจารย์มหาวิทยาลัย)" },
    { id: "REP008", label: "Student (นักศึกษา)" },
    { id: "REP009", label: "Not Specified (ไม่ระบุ)" },
];

// 5 Step configuration
const STEPS = [
    { id: "location", label: "Location", icon: "location_on" },
    { id: "plant", label: "Plant", icon: "grass" },
    { id: "pest", label: "Pest", icon: "bug_report" },
    { id: "issue", label: "Issue Details", icon: "pest_control" },
    { id: "reporter", label: "Reporter", icon: "person" },
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
        fieldAffectedArea: 0,
        incidencePercent: 0,
        severityPercent: 0,
        imageUrls: [],
        imageCaptions: [],
        isAnonymous: false,
        reporterFirstName: "",
        reporterLastName: "",
        reporterPhone: "",
        reporterRole: "",
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [autoFilled, setAutoFilled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
    const progressPercent = ((currentStepIndex + 1) / STEPS.length) * 100;

    // Check auth state
    useEffect(() => {
        const supabase = createClient();

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setAuthLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setAuthLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Autofill reporter info when user is logged in and reaches Step 5
    useEffect(() => {
        if (user && currentStep === "reporter" && !autoFilled && !formData.isAnonymous) {
            const fullName = user.user_metadata?.full_name || "";
            const nameParts = fullName.split(" ");
            const firstName = nameParts[0] || user.email?.split("@")[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            setFormData((prev) => ({
                ...prev,
                reporterFirstName: prev.reporterFirstName || firstName,
                reporterLastName: prev.reporterLastName || lastName,
            }));
            setAutoFilled(true);
        }
    }, [user, currentStep, autoFilled, formData.isAnonymous]);

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

    const uploadImages = async (): Promise<string[]> => {
        if (selectedFiles.length === 0) return [];

        const supabase = createClient();
        const uploadPromises = selectedFiles.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('pestPics')
                .upload(filePath, file);

            if (uploadError) {
                console.error("Error uploading image:", uploadError);
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('pestPics')
                .getPublicUrl(filePath);

            return data.publicUrl;
        });

        return Promise.all(uploadPromises);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            // 1. Upload Images
            const uploadedUrls = await uploadImages();

            // 2. Prepare submission data
            const submissionData = {
                ...formData,
                imageUrls: uploadedUrls
            };

            console.log("Submitting form data:", submissionData);

            // 3. Submit to Server Action
            const result = await submitPestReport(submissionData);

            if (result.success) {
                // Redirect to dashboard or success page
                router.push("/dashboard?success=true");
            } else {
                alert("Failed to submit report. Please try again.");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("An error occurred during submission.");
            setIsSubmitting(false);
        }
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
                            href="/dashboard"
                        >
                            Manage
                        </Link>
                    </nav>
                    <Separator orientation="vertical" className="h-8 border-border" />
                    <ThemeToggle />
                    {/* Show user info or login link */}
                    {!authLoading && (
                        user ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10">
                                <span className="material-icons-outlined text-primary text-lg">person</span>
                                <span className="text-sm font-medium text-primary truncate max-w-[120px]">
                                    {user.email?.split("@")[0]}
                                </span>
                            </div>
                        ) : (
                            <Link
                                href={`/login?redirectTo=${pathname}`}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            >
                                Log In
                            </Link>
                        )
                    )}
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
                                                <div className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 peer-checked:scale-[1.02] ${formData.pestId === pest.pestId
                                                    ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5"
                                                    : "border-border bg-card text-muted-foreground hover:border-secondary/50 hover:bg-muted/30"
                                                    }`}>
                                                    <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${formData.pestId === pest.pestId ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-secondary/10 group-hover:text-secondary"}`}>
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
                                                    value={formData.fieldAffectedArea || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "fieldAffectedArea",
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

                                        {/* Image Upload Section */}
                                        <div className="col-span-1 md:col-span-2 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                                    Photo Evidence
                                                </Label>
                                                <span className="text-xs text-muted-foreground">
                                                    {selectedFiles.length}/2 images selected
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Upload Button Area */}
                                                {selectedFiles.length < 2 && (
                                                    <div className="col-span-1 md:col-span-2">
                                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 hover:border-primary/50 transition-all group">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <div className="bg-primary/5 p-3 rounded-full mb-3 group-hover:bg-primary/10 transition-colors">
                                                                    <span className="material-icons-outlined text-primary text-2xl">
                                                                        add_a_photo
                                                                    </span>
                                                                </div>
                                                                <p className="mb-1 text-sm text-muted-foreground font-medium">
                                                                    <span className="font-bold text-primary">Click to upload</span> or drag and drop
                                                                </p>
                                                                <p className="text-xs text-muted-foreground/70">
                                                                    PNG, JPG or GIF (max. 5MB, up to 2 images)
                                                                </p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                multiple
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files.length > 0) {
                                                                        const newFiles = Array.from(e.target.files);
                                                                        const remaining = 2 - selectedFiles.length;
                                                                        const filesToAdd = newFiles.slice(0, remaining);
                                                                        const newUrls = filesToAdd.map(file => URL.createObjectURL(file));

                                                                        setSelectedFiles(prev => [...prev, ...filesToAdd]);
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            imageUrls: [...prev.imageUrls, ...newUrls],
                                                                            imageCaptions: [...prev.imageCaptions, ...new Array(newUrls.length).fill("")]
                                                                        }));
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                )}

                                                {/* Image Previews */}
                                                {formData.imageUrls.map((url, index) => (
                                                    <div key={index} className="relative group flex gap-4 p-3 rounded-xl border border-border bg-card hover:shadow-md transition-all">
                                                        <div className="relative size-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                                                            <img
                                                                src={url}
                                                                alt={`Evidence ${index + 1}`}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-2 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-xs font-bold text-muted-foreground">Caption</Label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            imageUrls: prev.imageUrls.filter((_, i) => i !== index),
                                                                            imageCaptions: prev.imageCaptions.filter((_, i) => i !== index)
                                                                        }));
                                                                    }}
                                                                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                                                    title="Remove image"
                                                                >
                                                                    <span className="material-icons-outlined text-lg">close</span>
                                                                </button>
                                                            </div>
                                                            <Input
                                                                type="text"
                                                                placeholder="Describe this photo..."
                                                                className="h-8 text-sm rounded-lg border-border bg-background"
                                                                value={formData.imageCaptions[index]}
                                                                onChange={(e) => {
                                                                    const newCaptions = [...formData.imageCaptions];
                                                                    newCaptions[index] = e.target.value;
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        imageCaptions: newCaptions
                                                                    }));
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tip Callout */}
                                        <div className="col-span-1 md:col-span-2 mt-2 pt-6 border-t border-border">
                                            <Card className="bg-accent/10 dark:bg-accent/5 border-accent/20 dark:border-accent/15">
                                                <CardContent className="flex items-center gap-4 p-4">
                                                    <div className="bg-accent/20 dark:bg-accent/15 p-2 rounded-xl text-accent">
                                                        <span className="material-icons-outlined">
                                                            lightbulb
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-foreground dark:text-accent">
                                                            Tip: Clear photos help experts verify the pest type accurately.
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </CardContent>
                            </>
                        )}
                        {/* ===== STEP 5: Reporter ===== */}
                        {currentStep === "reporter" && (
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

                                        {/* Auth Status Banner */}
                                        {user ? (
                                            /* Logged in — show autofill confirmation */
                                            <div className="flex items-center gap-4 p-4 rounded-xl border border-secondary/30 bg-secondary/5">
                                                <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary shrink-0">
                                                    <span className="material-icons-outlined text-xl">check_circle</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-primary">Logged in as {user.email}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        Your information has been auto-filled. You can still edit or submit anonymously.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Not logged in — show login prompt */
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-border bg-muted/20">
                                                <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0">
                                                    <span className="material-icons-outlined text-xl">login</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-primary">Have an account?</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        Log in to auto-fill your info and track your reports.
                                                    </p>
                                                </div>
                                                <Link
                                                    href={`/login?redirectTo=${pathname}`}
                                                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all"
                                                >
                                                    <span className="material-icons-outlined text-lg">login</span>
                                                    Log In to Autofill
                                                </Link>
                                            </div>
                                        )}

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
                                                    // Re-trigger autofill when switching back to non-anonymous
                                                    if (!checked && user) {
                                                        setAutoFilled(false);
                                                    }
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
                                                    placeholder={user ? "Auto-filled from your account" : "Enter your first name"}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Last Name</Label>
                                                <Input
                                                    disabled={formData.isAnonymous}
                                                    value={formData.reporterLastName}
                                                    onChange={(e) => handleInputChange("reporterLastName", e.target.value)}
                                                    className="h-12 rounded-xl border-border bg-background"
                                                    placeholder={user ? "Auto-filled from your account" : "Enter your last name"}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Phone Number</Label>
                                                <Input
                                                    disabled={formData.isAnonymous}
                                                    value={formData.reporterPhone}
                                                    onChange={(e) => handleInputChange("reporterPhone", e.target.value)}
                                                    className="h-12 rounded-xl border-border bg-background"
                                                    placeholder="Enter your phone number"
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
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center">
                                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                                    Submitting...
                                                </span>
                                            ) : (
                                                <>
                                                    Submit Report
                                                    <span className="material-icons-outlined ml-2">check</span>
                                                </>
                                            )}
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