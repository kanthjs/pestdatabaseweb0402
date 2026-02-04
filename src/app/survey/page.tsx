"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Form data type matching Prisma schema
interface PestReportFormData {
    // Location
    province: string;
    latitude: number;
    longitude: number;
    // Plant
    plantId: string;
    plant: string;
    // Pest Issue
    pestId: string;
    pest: string;
    symptomOnSet: string;
    filedAffectedArea: number;
    incidencePercent: number;
    severityPercent: number;
}

// Step configuration
const STEPS = [
    { id: "location", label: "Location", icon: "location_on" },
    { id: "plant", label: "Plant", icon: "grass" },
    { id: "issue", label: "Issue", icon: "pest_control" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export default function SurveyPage() {
    const [currentStep, setCurrentStep] = useState<StepId>("location");
    const [formData, setFormData] = useState<PestReportFormData>({
        province: "",
        latitude: 0,
        longitude: 0,
        plantId: "",
        plant: "",
        pestId: "",
        pest: "",
        symptomOnSet: new Date().toISOString().split("T")[0],
        filedAffectedArea: 0,
        incidencePercent: 0,
        severityPercent: 0,
    });

    const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
    const progressPercent = ((currentStepIndex + 1) / STEPS.length) * 100;

    const handleInputChange = (field: keyof PestReportFormData, value: string | number) => {
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

    // Province options
    const provinces = [
        "กรุงเทพมหานคร",
        "กาญจนบุรี",
        "ขอนแก่น",
        "เชียงใหม่",
        "นครราชสีมา",
        "นครปฐม",
        "ปทุมธานี",
        "สงขลา",
    ];

    // Plant options
    const plants = [
        { id: "rice-001", name: "ข้าว (Rice)" },
        { id: "corn-001", name: "ข้าวโพด (Corn)" },
        { id: "cassava-001", name: "มันสำปะหลัง (Cassava)" },
        { id: "sugarcane-001", name: "อ้อย (Sugarcane)" },
    ];

    // Pest options
    const pests = [
        { id: "bph-001", name: "เพลี้ยกระโดดสีน้ำตาล (Brown Planthopper)" },
        { id: "blast-001", name: "โรคไหม้ (Rice Blast)" },
        { id: "stemborer-001", name: "หนอนกอข้าว (Stem Borer)" },
        { id: "armyworm-001", name: "หนอนกระทู้ข้าว (Army Worm)" },
    ];

    return (
        <div className="bg-background text-foreground min-h-screen flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-6 py-4 lg:px-10">
                <Link href="/" className="flex items-center gap-4">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <span className="material-icons-outlined text-2xl">agriculture</span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                        Rice Pest Survey Network
                    </h2>
                </Link>
                <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                    <nav className="flex items-center gap-6">
                        <Link
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            href="/survey"
                        >
                            Report
                        </Link>
                        <Link
                            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                            href="#"
                        >
                            Manage
                        </Link>
                    </nav>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white shadow-sm cursor-pointer hover:ring-2 ring-primary ring-offset-2 transition-all bg-gray-300" />
                </div>
                <button className="md:hidden p-2 text-gray-600 dark:text-gray-300">
                    <span className="material-icons-outlined">menu</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8 lg:py-12">
                <div className="w-full max-w-[800px] flex flex-col gap-8">
                    {/* Page Heading & Progress */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    New Pest Report
                                </h1>
                                <p className="mt-1 text-gray-500 dark:text-gray-400">
                                    Please complete all sections to submit accurate data.
                                </p>
                            </div>
                            <Badge variant="secondary" className="text-primary bg-primary/10">
                                Step {currentStepIndex + 1} of {STEPS.length}:{" "}
                                {STEPS[currentStepIndex].label}
                            </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full">
                            <div className="flex justify-between mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-1">
                                {STEPS.map((step, idx) => (
                                    <span
                                        key={step.id}
                                        className={idx <= currentStepIndex ? "text-primary" : ""}
                                    >
                                        {step.label}
                                    </span>
                                ))}
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Card */}
                    <Card className="relative overflow-hidden shadow-lg">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

                        {/* ===== STEP 1: Location ===== */}
                        {currentStep === "location" && (
                            <>
                                <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b">
                                    <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                        <span className="material-icons-outlined">location_on</span>
                                    </div>
                                    <CardTitle className="text-xl">Location Information</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        {/* Province */}
                                        <div className="col-span-1 md:col-span-2 space-y-2">
                                            <Label>Province / จังหวัด</Label>
                                            <div className="relative">
                                                <select
                                                    className="w-full h-12 rounded-lg border border-input bg-background focus:border-primary focus:ring-primary px-4 appearance-none transition-colors cursor-pointer"
                                                    value={formData.province}
                                                    onChange={(e) =>
                                                        handleInputChange("province", e.target.value)
                                                    }
                                                >
                                                    <option value="">Select Province...</option>
                                                    {provinces.map((p) => (
                                                        <option key={p} value={p}>
                                                            {p}
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

                                        {/* Latitude */}
                                        <div className="col-span-1 space-y-2">
                                            <Label>Latitude / ละติจูด</Label>
                                            <Input
                                                type="number"
                                                step="0.0001"
                                                placeholder="13.7563"
                                                className="h-12"
                                                value={formData.latitude || ""}
                                                onChange={(e) =>
                                                    handleInputChange("latitude", parseFloat(e.target.value) || 0)
                                                }
                                            />
                                        </div>

                                        {/* Longitude */}
                                        <div className="col-span-1 space-y-2">
                                            <Label>Longitude / ลองจิจูด</Label>
                                            <Input
                                                type="number"
                                                step="0.0001"
                                                placeholder="100.5018"
                                                className="h-12"
                                                value={formData.longitude || ""}
                                                onChange={(e) =>
                                                    handleInputChange("longitude", parseFloat(e.target.value) || 0)
                                                }
                                            />
                                        </div>

                                        {/* GPS Button */}
                                        <div className="col-span-1 md:col-span-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full h-12"
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
                                        </div>
                                    </div>
                                </CardContent>
                            </>
                        )}

                        {/* ===== STEP 2: Plant ===== */}
                        {currentStep === "plant" && (
                            <>
                                <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b">
                                    <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                        <span className="material-icons-outlined">grass</span>
                                    </div>
                                    <CardTitle className="text-xl">Plant Information</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 gap-y-6">
                                        {/* Plant Selection */}
                                        <div className="space-y-3">
                                            <Label className="text-base font-medium">
                                                Select Plant / เลือกพืช
                                            </Label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {plants.map((plant) => (
                                                    <label key={plant.id} className="cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="plant"
                                                            value={plant.id}
                                                            checked={formData.plantId === plant.id}
                                                            onChange={() => {
                                                                handleInputChange("plantId", plant.id);
                                                                handleInputChange("plant", plant.name);
                                                            }}
                                                            className="peer sr-only"
                                                        />
                                                        <div
                                                            className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all hover:bg-gray-100 dark:hover:bg-gray-700
                                ${formData.plantId === plant.id
                                                                    ? "border-primary bg-primary/10 text-primary"
                                                                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                                                }`}
                                                        >
                                                            <span className="material-icons-outlined text-2xl mb-2">
                                                                grass
                                                            </span>
                                                            <span className="text-sm font-medium text-center">
                                                                {plant.name}
                                                            </span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pest Selection */}
                                        <div className="space-y-3 pt-4 border-t">
                                            <Label className="text-base font-medium">
                                                Select Pest/Disease / เลือกศัตรูพืช
                                            </Label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {pests.map((pest) => (
                                                    <label key={pest.id} className="cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="pest"
                                                            value={pest.id}
                                                            checked={formData.pestId === pest.id}
                                                            onChange={() => {
                                                                handleInputChange("pestId", pest.id);
                                                                handleInputChange("pest", pest.name);
                                                            }}
                                                            className="peer sr-only"
                                                        />
                                                        <div
                                                            className={`flex items-center gap-3 p-4 rounded-lg border transition-all hover:bg-gray-100 dark:hover:bg-gray-700
                                ${formData.pestId === pest.id
                                                                    ? "border-primary bg-primary/10 text-primary"
                                                                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                                                }`}
                                                        >
                                                            <span className="material-icons-outlined text-xl">
                                                                bug_report
                                                            </span>
                                                            <span className="text-sm font-medium">
                                                                {pest.name}
                                                            </span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </>
                        )}

                        {/* ===== STEP 3: Issue ===== */}
                        {currentStep === "issue" && (
                            <>
                                <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b">
                                    <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                        <span className="material-icons-outlined">pest_control</span>
                                    </div>
                                    <CardTitle className="text-xl">Issue Details</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        {/* Symptom Onset Date */}
                                        <div className="col-span-1 space-y-2">
                                            <Label>Symptom Onset Date / วันที่พบอาการ</Label>
                                            <Input
                                                type="date"
                                                className="h-12"
                                                value={formData.symptomOnSet}
                                                onChange={(e) =>
                                                    handleInputChange("symptomOnSet", e.target.value)
                                                }
                                            />
                                        </div>

                                        {/* Affected Area */}
                                        <div className="col-span-1 space-y-2">
                                            <Label>Affected Area / พื้นที่ระบาด (ไร่)</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="0.0"
                                                    className="h-12 pr-12"
                                                    value={formData.filedAffectedArea || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "filedAffectedArea",
                                                            parseFloat(e.target.value) || 0
                                                        )
                                                    }
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 text-sm">
                                                    ไร่
                                                </div>
                                            </div>
                                        </div>

                                        {/* Incidence Percent */}
                                        <div className="col-span-1 md:col-span-2 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-base font-medium">
                                                    Incidence Percent / เปอร์เซ็นต์การระบาด
                                                </Label>
                                                <span className="text-lg font-bold text-primary">
                                                    {formData.incidencePercent}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={formData.incidencePercent}
                                                onChange={(e) =>
                                                    handleInputChange("incidencePercent", Number(e.target.value))
                                                }
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
                                            />
                                            <div className="flex justify-between text-xs text-gray-400">
                                                <span>0%</span>
                                                <span>50%</span>
                                                <span>100%</span>
                                            </div>
                                        </div>

                                        {/* Severity Percent */}
                                        <div className="col-span-1 md:col-span-2 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-base font-medium">
                                                    Severity Percent / เปอร์เซ็นต์ความรุนแรง
                                                </Label>
                                                <span className="text-lg font-bold text-primary">
                                                    {formData.severityPercent}%
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3 mb-2">
                                                {[
                                                    { value: 15, label: "Low", icon: "check_circle" },
                                                    { value: 50, label: "Medium", icon: "warning" },
                                                    { value: 85, label: "High", icon: "error" },
                                                ].map((option) => {
                                                    const isSelected =
                                                        (option.value === 15 && formData.severityPercent <= 33) ||
                                                        (option.value === 50 &&
                                                            formData.severityPercent > 33 &&
                                                            formData.severityPercent <= 66) ||
                                                        (option.value === 85 && formData.severityPercent > 66);
                                                    const isHigh = option.value === 85;

                                                    return (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() =>
                                                                handleInputChange("severityPercent", option.value)
                                                            }
                                                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all hover:bg-gray-100 dark:hover:bg-gray-700
                                ${isSelected
                                                                    ? isHigh
                                                                        ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                                                                        : "border-primary bg-primary/10 text-primary"
                                                                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                                                }`}
                                                        >
                                                            <span
                                                                className={`material-icons-outlined mb-1 ${isSelected
                                                                    ? isHigh
                                                                        ? "text-red-600 dark:text-red-400"
                                                                        : "text-primary"
                                                                    : "text-gray-400"
                                                                    }`}
                                                            >
                                                                {option.icon}
                                                            </span>
                                                            <span className="text-sm font-medium">
                                                                {option.label}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={formData.severityPercent}
                                                onChange={(e) =>
                                                    handleInputChange("severityPercent", Number(e.target.value))
                                                }
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
                                            />
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
                    </Card>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-2">
                        {currentStepIndex > 0 ? (
                            <Button variant="ghost" onClick={goToPrevStep}>
                                <span className="material-icons-outlined text-lg mr-2">
                                    arrow_back
                                </span>
                                Back
                            </Button>
                        ) : (
                            <Button variant="ghost" asChild>
                                <Link href="/">
                                    <span className="material-icons-outlined text-lg mr-2">
                                        arrow_back
                                    </span>
                                    Cancel
                                </Link>
                            </Button>
                        )}

                        {currentStepIndex < STEPS.length - 1 ? (
                            <Button
                                className="group shadow-lg shadow-primary/30 hover:shadow-primary/50"
                                onClick={goToNextStep}
                            >
                                Next Step
                                <span className="material-icons-outlined text-lg ml-2 group-hover:translate-x-1 transition-transform">
                                    arrow_forward
                                </span>
                            </Button>
                        ) : (
                            <Button
                                className="group shadow-lg shadow-primary/30 hover:shadow-primary/50"
                                onClick={handleSubmit}
                            >
                                Submit Report
                                <span className="material-icons-outlined text-lg ml-2 group-hover:translate-x-1 transition-transform">
                                    send
                                </span>
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
