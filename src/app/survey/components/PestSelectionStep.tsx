"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pest, PestReportFormData } from "./types";

interface PestSelectionStepProps {
    pests: Pest[];
    formData: PestReportFormData;
    setFormData: React.Dispatch<React.SetStateAction<PestReportFormData>>;
}

export function PestSelectionStep({ pests, formData, setFormData }: PestSelectionStepProps) {
    const handleInputChange = (field: keyof PestReportFormData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
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
    );
}
