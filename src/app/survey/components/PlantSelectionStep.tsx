"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plant, PestReportFormData } from "./types";

interface PlantSelectionStepProps {
    plants: Plant[];
    formData: PestReportFormData;
    setFormData: React.Dispatch<React.SetStateAction<PestReportFormData>>;
}

export function PlantSelectionStep({ plants, formData, setFormData }: PlantSelectionStepProps) {
    const handleInputChange = (field: keyof PestReportFormData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
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
    );
}
