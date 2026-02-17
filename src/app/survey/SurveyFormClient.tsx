"use client";

import { useState, useEffect, useRef } from "react";
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
import { submitPestReport, reverseGeocode } from "./actions";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";

// Dynamic import for the Map component to avoid SSR errors
const ReportMap = dynamic(() => import("@/components/ReportMap"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center text-muted-foreground">กำลังโหลดแผนที่...</div>
});

// Types for the props from database
interface Province {
    provinceId: number;
    provinceCode: string;
    provinceNameEn: string;
    provinceNameTh: string | null;
}

interface Plant {
    plantId: string;
    plantNameEn: string;
    plantNameTh?: string | null;
    imageUrl?: string | null;
}

interface Pest {
    pestId: string;
    pestNameEn: string;
    pestNameTh?: string | null;
    imageUrl?: string | null;
}

interface SurveyFormClientProps {
    provinces: Province[];
    plants: Plant[];
    pests: Pest[];
}

// Form data type matching Prisma schema
interface PestReportFormData {
    provinceCode: string;
    latitude: number;
    longitude: number;
    plantId: string;
    plantGrowthStage: string;
    pestId: string;
    symptomOnSet: string;
    fieldAffectedArea: number;
    incidencePercent: number;
    severityPercent: number;
    imageUrls: string[];
    imageCaptions: string[];
    notes: string;
    isAnonymous: boolean;
    reporterFirstName: string;
    reporterLastName: string;
    reporterPhone: string;
    reporterRole: string;
}

// Reporter Roles
const REPORTER_ROLES = [
    { id: "REP001", label: "เกษตรกร" },
    { id: "REP002", label: "อาสาสมัครเกษตร" },
    { id: "REP003", label: "เจ้าหน้าที่ส่งเสริมการเกษตร" },
    { id: "REP004", label: "เจ้าหน้าที่ศูนย์วิจัยข้าว" },
    { id: "REP005", label: "เจ้าหน้าที่ราชการ" },
    { id: "REP006", label: "ผู้นำชุมชน" },
    { id: "REP007", label: "อาจารย์มหาวิทยาลัย" },
    { id: "REP008", label: "นักศึกษา" },
    { id: "REP009", label: "ไม่ระบุ" },
];

// Plant Growth Stages
const PLANT_GROWTH_STAGES = [
    { id: "seedling", label: "ต้นกล้า / Seedling", image: "/images/plantGrowthStage/rcie_seedling.jpg" },
    { id: "tillering", label: "การหยั่งรากและการแตกพัง / Tillering", image: "/images/plantGrowthStage/rice_tillering.jpg" },
    { id: "booting", label: "การออกรวง / Booting", image: "/images/plantGrowthStage/rice_booting.jpg" },
    { id: "flowering", label: "การออกดอก / Flowering", image: "/images/plantGrowthStage/rice_flowering.jpg" },
    { id: "ripening", label: "การสุกผล / Ripening", image: "/images/plantGrowthStage/rice_ripening.jpg" },
];

// 6 Step configuration
const STEPS = [
    { id: "location", label: "ตำแหน่งที่พบ", icon: "location_on" },
    { id: "plant", label: "ชนิดพืช", icon: "grass" },
    { id: "growth", label: "ระยะเจริญเติบโต", icon: "nature" },
    { id: "pest", label: "ศัตรูข้าว", icon: "bug_report" },
    { id: "issue", label: "รายละเอียด", icon: "pest_control" },
    { id: "reporter", label: "ผู้รายงาน", icon: "person" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export default function SurveyFormClient({
    provinces,
    plants,
    pests,
}: SurveyFormClientProps) {
    const [currentStep, setCurrentStep] = useState<StepId>("location");
    const [formData, setFormData] = useState<PestReportFormData>({
        provinceCode: "",
        latitude: 0,
        longitude: 0,
        plantId: "",
        plantGrowthStage: "",
        pestId: "",
        symptomOnSet: new Date().toISOString().split("T")[0],
        fieldAffectedArea: 0,
        incidencePercent: 0,
        severityPercent: 0,
        imageUrls: [],
        imageCaptions: [],
        notes: "",
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
    const [isLocating, setIsLocating] = useState(false);
    const [locationStatus, setLocationStatus] = useState<string>("");
    const cameraInputRef = useRef<HTMLInputElement>(null);
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

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser / บราวเซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;

                // 1. Set Lat/Long immediately
                setFormData((prev) => ({
                    ...prev,
                    latitude,
                    longitude,
                }));

                // 2. Reverse Geocoding to identify Province (via server action to set User-Agent and avoid CORS)
                try {
                    setLocationStatus("กำลังระบุจังหวัด...");
                    const result = await reverseGeocode(latitude, longitude);

                    if (!result.success) {
                        console.error("Reverse geocoding failed:", result.error);
                        setLocationStatus(`ไม่สามารถระบุจังหวัดโดยอัตโนมัติ: ${result.error}`);
                        setIsLocating(false);
                        return;
                    }

                    const data = result.data;
                    // Nominatim returns 'state' for province, or 'city' for Bangkok
                    const stateName = data.address?.state || data.address?.province || data.address?.city;

                    if (stateName) {
                        // Improved normalization function with better Thai handling
                        const normalize = (str: string) => {
                            if (!str) return "";
                            // Remove common prefixes/suffixes in Thai and English
                            let normalized = str
                                .toLowerCase()
                                .replace(/จังหวัด|province|จ\.|city of|islands/gi, "")
                                .trim();
                            // Remove multiple spaces and normalize whitespace
                            normalized = normalized.replace(/\s+/g, "");
                            return normalized;
                        };

                        const target = normalize(stateName);
                        console.log(`Looking for province: "${stateName}" (normalized: "${target}")`);

                        // First, try exact match
                        let matchedProvince = provinces.find(p => {
                            const th = p.provinceNameTh ? normalize(p.provinceNameTh) : "";
                            const en = normalize(p.provinceNameEn);
                            if (th === target || en === target) {
                                console.log(`Exact match found: ${p.provinceNameTh || p.provinceNameEn}`);
                                return true;
                            }
                            return false;
                        });

                        // If no exact match, try partial match
                        if (!matchedProvince) {
                            matchedProvince = provinces.find(p => {
                                const th = p.provinceNameTh ? normalize(p.provinceNameTh) : "";
                                const en = normalize(p.provinceNameEn);
                                // Check if target is a substring or vice versa
                                if (th && (target.includes(th) || th.includes(target))) {
                                    console.log(`Partial match (Thai): ${p.provinceNameTh}`);
                                    return true;
                                }
                                if (en && (target.includes(en) || en.includes(target))) {
                                    console.log(`Partial match (English): ${p.provinceNameEn}`);
                                    return true;
                                }
                                return false;
                            });
                        }

                        if (matchedProvince) {
                            setFormData((prev) => ({ ...prev, provinceCode: matchedProvince.provinceCode }));
                            setLocationStatus(`พบตำแหน่งในจังหวัด: ${matchedProvince.provinceNameTh || matchedProvince.provinceNameEn}`);
                        } else {
                            console.warn("Could not auto-match province:", stateName, "normalized:", target);
                            // Show available provinces for debugging
                            console.log("Available provinces:", provinces.map(p => ({ th: p.provinceNameTh, en: p.provinceNameEn, normalized: normalize(p.provinceNameTh || p.provinceNameEn) })));
                            setLocationStatus(`ไม่สามารถระบุจังหวัดจาก: ${stateName}`);
                        }
                    } else {
                        setLocationStatus("ระบุตำแหน่งแล้ว (ไม่พบข้อมูลจังหวัด)");
                    }
                } catch (error) {
                    console.error("Error reverse geocoding:", error);
                    setLocationStatus("เกิดข้อผิดพลาดในการระบุจังหวัด");
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location / ไม่สามารถระบุตำแหน่งได้");
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const goToNextStep = () => {
        // Validation before moving to next step
        if (currentStep === "location" && !formData.provinceCode) {
            alert("Please select a province / กรุณาเลือกจังหวัด");
            return;
        }
        if (currentStep === "plant" && !formData.plantId) {
            alert("Please select a plant / กรุณาเลือกชนิดพืช");
            return;
        }
        if (currentStep === "growth" && !formData.plantGrowthStage) {
            alert("Please select a plant growth stage / กรุณาเลือกระยะการเจริญของพืช");
            return;
        }
        if (currentStep === "pest" && !formData.pestId) {
            alert("Please select a pest or disease / กรุณาเลือกชนิดศัตรูพืชหรือโรค");
            return;
        }
        if (currentStep === "issue" && selectedFiles.length === 0) {
            alert("Please upload at least 1 photo / กรุณาแนบรูปภาพอย่างน้อย 1 รูป");
            return;
        }

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

        if (!formData.provinceCode || !formData.plantId || !formData.plantGrowthStage || !formData.pestId || selectedFiles.length === 0) {
            if (selectedFiles.length === 0) {
                alert("Please upload at least 1 photo / กรุณาแนบรูปภาพอย่างน้อย 1 รูป");
                setCurrentStep("issue");
            } else {
                alert("Please complete all required fields (Province, Plant, Growth Stage, and Pest).");
            }
            return;
        }

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
                alert(`Failed to submit report: ${result.error || "Please try again."}`);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Submission error:", error);
            const message = error instanceof Error ? error.message : "Unknown error";
            alert(`An error occurred during submission: ${message}`);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-background text-foreground min-h-screen flex flex-col font-sans transition-colors duration-300">
            {/* Main Content */}
            <main className="flex flex-1 flex-col items-center px-4 py-0 md:px-12 lg:py-12">
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
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">แบบฟอร์มรายงานศัตรูข้าว</span>
                        </div>
                        {/* ===== STEP 1: Location ===== */}
                        {currentStep === "location" && (
                            <>
                                <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
                                    <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary">
                                        <span className="material-icons-outlined text-2xl">location_on</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-display text-primary">ข้อมูลตำแหน่งที่พบ</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">คุณพบศัตรูพืชที่ใด?</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                        {/* Province Selection */}
                                        <div className="col-span-1 space-y-3">
                                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">จังหวัด</Label>
                                            <div className="relative">
                                                <select
                                                    title="เลือกจังหวัด"
                                                    className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                                                    value={formData.provinceCode}
                                                    onChange={(e) =>
                                                        handleInputChange("provinceCode", e.target.value)
                                                    }
                                                >
                                                    <option value="">เลือกจังหวัด</option>
                                                    {provinces.map((p) => (
                                                        <option
                                                            key={p.provinceId}
                                                            value={p.provinceCode}
                                                        >
                                                            {p.provinceNameTh ?? p.provinceNameEn}
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
                                                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">ละติจูด</Label>
                                                <div className="h-12 px-4 rounded-xl border border-border bg-muted/30 flex items-center text-primary font-mono text-sm">
                                                    {formData.latitude.toFixed(6)}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">ลองจิจูด</Label>
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
                                                onClick={handleGetCurrentLocation}
                                                disabled={isLocating}
                                            >
                                                {isLocating ? (
                                                    <>
                                                        <span className="material-icons-outlined mr-2 animate-spin">refresh</span>
                                                        กำลังระบุตำแหน่ง...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-icons-outlined mr-2">my_location</span>
                                                        ใช้ตำแหน่งปัจจุบัน
                                                    </>
                                                )}
                                            </Button>

                                            {locationStatus && (
                                                <p className={`text-xs text-center animate-in fade-in duration-300 ${locationStatus.includes('ผิดพลาด') ? 'text-destructive' : 'text-primary font-medium'}`}>
                                                    {locationStatus}
                                                </p>
                                            )}

                                            {/* Map Integration */}
                                            {(formData.latitude !== 0 || formData.longitude !== 0) && (
                                                <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                                                    <Label className="text-sm text-muted-foreground font-normal">ตำแหน่งที่พบศัตรูข้าว</Label>
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
                                        <CardTitle className="text-xl font-display text-primary">พืชที่พบศัตรูข้าว</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">เลือกพืชที่พบศัตรูข้าว</p>
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
                                                <div className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 transform peer-checked:scale-105 ${formData.plantId === plant.plantId
                                                    ? "text-primary"
                                                    : "text-muted-foreground hover:text-primary"
                                                    }`}>
                                                    <div className={`size-32 md:size-44 rounded-full overflow-hidden flex items-center justify-center mb-3 transition-all border-4 ${formData.plantId === plant.plantId ? "border-primary shadow-xl shadow-primary/20" : "border-border group-hover:border-primary/50"}`}>
                                                        {plant.imageUrl ? (
                                                            <img
                                                                src={plant.imageUrl}
                                                                alt={plant.plantNameEn}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.onerror = null;
                                                                    target.src = `https://placehold.co/300x300.png?text=${encodeURIComponent(plant.plantNameEn)}`;
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="material-icons-outlined text-4xl">grass</span>
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-bold text-center">{plant.plantNameTh ?? plant.plantNameEn}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </CardContent>
                            </>
                        )}
                        {/* ===== STEP 3: Plant Growth Stage ===== */}
                        {currentStep === "growth" && (
                            <>
                                <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
                                    <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary">
                                        <span className="material-icons-outlined text-2xl">nature</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-display text-primary">ระยะการเจริญเติบโตของพืช</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">พืชอยู่ในระยะใด?</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-8">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {PLANT_GROWTH_STAGES.map((stage) => (
                                            <label key={stage.id} className="cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="growth"
                                                    value={stage.id}
                                                    checked={formData.plantGrowthStage === stage.id}
                                                    onChange={() => handleInputChange("plantGrowthStage", stage.id)}
                                                    className="peer sr-only"
                                                />
                                                <div className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 transform peer-checked:scale-105 ${formData.plantGrowthStage === stage.id
                                                    ? "text-primary"
                                                    : "text-muted-foreground hover:text-primary"
                                                    }`}>
                                                    <div className={`size-32 md:size-40 rounded-lg overflow-hidden flex items-center justify-center mb-3 transition-all border-4 ${formData.plantGrowthStage === stage.id ? "border-primary shadow-xl shadow-primary/20" : "border-border group-hover:border-primary/50"}`}>
                                                        <img
                                                            src={stage.image}
                                                            alt={stage.label}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.onerror = null;
                                                                target.src = `https://placehold.co/300x300.png?text=${encodeURIComponent(stage.label)}`;
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold text-center line-clamp-2">{stage.label}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </CardContent>
                            </>
                        )}
                        {/* ===== STEP 4: Pest ===== */}
                        {currentStep === "pest" && (
                            <>
                                <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
                                    <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary">
                                        <span className="material-icons-outlined text-2xl">bug_report</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-display text-primary">ศัตรูข้าวและโรคข้าว</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">คุณพบศัตรูข้าวชนิดใด?</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-8">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                                                <div className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 transform peer-checked:scale-105 ${formData.pestId === pest.pestId
                                                    ? "text-primary"
                                                    : "text-muted-foreground hover:text-primary"
                                                    }`}>
                                                    <div className={`size-24 md:size-32 rounded-full overflow-hidden flex items-center justify-center mb-3 transition-all border-4 ${formData.pestId === pest.pestId ? "border-primary shadow-xl shadow-primary/20" : "border-border group-hover:border-primary/50"}`}>
                                                        {pest.imageUrl ? (
                                                            <img
                                                                src={pest.imageUrl}
                                                                alt={pest.pestNameEn}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.onerror = null;
                                                                    target.src = `https://placehold.co/300x300.png?text=${encodeURIComponent(pest.pestNameEn)}`;
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="material-icons-outlined text-2xl">bug_report</span>
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-bold text-center">{pest.pestNameTh ?? pest.pestNameEn}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </CardContent>
                            </>
                        )}
                        {/* ===== STEP 5: Issue ===== */}
                        {currentStep === "issue" && (
                            <>
                                <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
                                    <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary">
                                        <span className="material-icons-outlined text-2xl">pest_control</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-display text-primary">รายละเอียดการระบาด</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">กรุณาระบุข้อมูลการตรวจสอบเบื้องต้น</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        {/* Symptom Onset Date */}
                                        <div className="col-span-1 space-y-3">
                                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">วันที่คาดว่าเริ่มการระบาด</Label>
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
                                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">พื้นที่ที่ได้รับผลกระทบ (ไร่)</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
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
                                                    ไร่
                                                </div>
                                            </div>
                                        </div>

                                        {/* Incidence Percent */}
                                        <div className="col-span-1 space-y-3">
                                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">เปอร์เซ็นต์การพบ (Incidence)</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
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
                                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">เปอร์เซ็นต์ความรุนแรง (Severity)</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
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
                                                    รูปภาพหลักฐาน
                                                </Label>
                                                <span className="text-xs text-muted-foreground">
                                                    เลือกแล้ว {selectedFiles.length}/2 รูป
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Upload Button Area */}
                                                {selectedFiles.length < 2 && (
                                                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                                                        {/* Regular File Upload */}
                                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 hover:border-primary/50 transition-all group">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <div className="bg-primary/5 p-3 rounded-full mb-3 group-hover:bg-primary/10 transition-colors">
                                                                    <span className="material-icons-outlined text-primary text-2xl">upload_file</span>
                                                                </div>
                                                                <p className="mb-1 text-sm text-muted-foreground font-medium text-center">
                                                                    <span className="font-bold text-primary">อัปโหลด</span> ไฟล์
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
                                                                        e.target.value = '';
                                                                    }
                                                                }}
                                                            />
                                                        </label>

                                                        {/* Camera Capture */}
                                                        <div
                                                            onClick={() => cameraInputRef.current?.click()}
                                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 hover:border-primary/50 transition-all group"
                                                        >
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <div className="bg-primary/5 p-3 rounded-full mb-3 group-hover:bg-primary/10 transition-colors">
                                                                    <span className="material-icons-outlined text-primary text-2xl">photo_camera</span>
                                                                </div>
                                                                <p className="mb-1 text-sm text-muted-foreground font-medium text-center">
                                                                    <span className="font-bold text-primary">ถ่าย</span> รูป
                                                                </p>
                                                            </div>
                                                            <input
                                                                ref={cameraInputRef}
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                capture="environment"
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
                                                                        e.target.value = '';
                                                                    }
                                                                }}
                                                            />
                                                        </div>
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
                                                                <Label className="text-xs font-bold text-muted-foreground">คำอธิบายภาพ</Label>
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
                                                                placeholder="อธิบายภาพนี้..."
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

                                        {/* Notes Section */}
                                        <div className="col-span-1 md:col-span-2 space-y-3">
                                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">หมายเหตุเพิ่มเติม(ถ้ามี)</Label>
                                            <textarea
                                                placeholder="พันธุ์ข้าว วิธีการปลูก สถานการณ์ วิธีการป้องกัน ข้อสังเกตอื่นๆ ที่เป็นประโยชน์"
                                                className="w-full h-24 p-4 rounded-xl border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all resize-none"
                                                value={formData.notes}
                                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                            />
                                            <p className="text-xs text-muted-foreground">ไม่บังคับ - เพิ่มรายละเอียดใดๆ ที่จำเป็น</p>
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
                                                            คำแนะนำ: รูปภาพที่ชัดเจนจะช่วยให้ผู้เชี่ยวชาญระบุชนิดศัตรูข้าวได้แม่นยำขึ้น
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </CardContent>
                            </>
                        )}
                        {/* ===== STEP 6: Reporter ===== */}
                        {currentStep === "reporter" && (
                            <>
                                <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
                                    <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary">
                                        <span className="material-icons-outlined text-2xl">person</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-display text-primary">ข้อมูลผู้รายงาน</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">ระบุข้อมูลเพื่อความน่าเชื่อถือของรายงาน</p>
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
                                                    <p className="text-sm font-bold text-primary">เข้าสู่ระบบในชื่อ {user.email}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        ข้อมูลของคุณถูกกรอกอัตโนมัติแล้ว คุณสามารถแก้ไขหรือเลือกรายงานแบบไม่เปิดเผยตัวตนได้
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
                                                    <p className="text-sm font-bold text-primary">มีบัญชีผู้ใช้งานอยู่แล้ว?</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        เข้าสู่ระบบเพื่อกรอกข้อมูลอัตโนมัติและติดตามรายงานของคุณ
                                                    </p>
                                                </div>
                                                <Link
                                                    href={`/login?redirectTo=${pathname}`}
                                                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all"
                                                >
                                                    <span className="material-icons-outlined text-lg">login</span>
                                                    เข้าสู่ระบบ
                                                </Link>
                                            </div>
                                        )}

                                        {/* Anonymous Toggle */}
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                                            <div className="space-y-0.5">
                                                <Label className="text-base font-bold text-primary">รายงานแบบไม่เปิดเผยตัวตน</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    ซ่อนตัวตนของคุณจากรายงานสาธารณะ
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
                                        {(!user || formData.isAnonymous) && (
                                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 transition-all duration-300 ${formData.isAnonymous ? "opacity-50 pointer-events-none grayscale" : ""}`}>
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">ชื่อ</Label>
                                                    <Input
                                                        disabled={formData.isAnonymous}
                                                        value={formData.reporterFirstName}
                                                        onChange={(e) => handleInputChange("reporterFirstName", e.target.value)}
                                                        className="h-12 rounded-xl border-border bg-background"
                                                        placeholder={user ? "กรอกอัตโนมัติจากบัญชีของคุณ" : "กรอกชื่อของคุณ"}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">นามสกุล</Label>
                                                    <Input
                                                        disabled={formData.isAnonymous}
                                                        value={formData.reporterLastName}
                                                        onChange={(e) => handleInputChange("reporterLastName", e.target.value)}
                                                        className="h-12 rounded-xl border-border bg-background"
                                                        placeholder={user ? "กรอกอัตโนมัติจากบัญชีของคุณ" : "กรอกนามสกุลของคุณ"}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">เบอร์โทรศัพท์ติดต่อ</Label>
                                                    <Input
                                                        disabled={formData.isAnonymous}
                                                        value={formData.reporterPhone}
                                                        onChange={(e) => handleInputChange("reporterPhone", e.target.value)}
                                                        className="h-12 rounded-xl border-border bg-background"
                                                        placeholder="กรอกเบอร์โทรศัพท์"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">บทบาท/ตำแหน่ง</Label>
                                                    <div className="relative">
                                                        <select
                                                            title="เลือกบทบาท"
                                                            disabled={formData.isAnonymous}
                                                            value={formData.reporterRole}
                                                            onChange={(e) => handleInputChange("reporterRole", e.target.value)}
                                                            className="w-full h-12 px-4 rounded-xl border border-border bg-background appearance-none outline-none disabled:cursor-not-allowed"
                                                        >
                                                            <option value="">เลือกบทบาทของคุณ</option>
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
                                        )}
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
                                        กลับ
                                    </Button>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        asChild
                                        className="w-full sm:w-auto px-8 h-12 rounded-full text-muted-foreground hover:text-primary transition-all font-medium"
                                    >
                                        <Link href="/">
                                            <span className="material-icons-outlined mr-2">close</span>
                                            ยกเลิก
                                        </Link>
                                    </Button>
                                )}

                                <div className="flex w-full sm:w-auto gap-4">
                                    {currentStepIndex < STEPS.length - 1 ? (
                                        <Button
                                            className="grow sm:grow-0 px-10 h-12 rounded-full bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all font-bold"
                                            onClick={goToNextStep}
                                        >
                                            ขั้นต่อ
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
                                                    กำลังส่งข้อมูล...
                                                </span>
                                            ) : (
                                                <>
                                                    ส่งรายงาน
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
                            เครือข่ายเฝ้าระวังภัยศัตรูข้าว
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