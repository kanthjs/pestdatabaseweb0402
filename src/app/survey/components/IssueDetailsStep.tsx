"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PestReportFormData } from "./types";

interface IssueDetailsStepProps {
    formData: PestReportFormData;
    setFormData: React.Dispatch<React.SetStateAction<PestReportFormData>>;
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function IssueDetailsStep({ formData, setFormData, selectedFiles, setSelectedFiles }: IssueDetailsStepProps) {
    const handleInputChange = (field: keyof PestReportFormData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
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
                            onChange={(e) => handleInputChange("symptomOnSet", e.target.value)}
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
                                onChange={(e) => handleInputChange("fieldAffectedArea", parseFloat(e.target.value) || 0)}
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
                                onChange={(e) => handleInputChange("incidencePercent", parseInt(e.target.value) || 0)}
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
                                onChange={(e) => handleInputChange("severityPercent", parseInt(e.target.value) || 0)}
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
                                {formData.imageUrls.length} images selected
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Upload Button Area */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 hover:border-primary/50 transition-all group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="bg-primary/5 p-3 rounded-full mb-3 group-hover:bg-primary/10 transition-colors">
                                            <span className="material-icons-outlined text-primary text-2xl">add_a_photo</span>
                                        </div>
                                        <p className="mb-1 text-sm text-muted-foreground font-medium">
                                            <span className="font-bold text-primary">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground/70">
                                            SVG, PNG, JPG or GIF (max. 5MB)
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
                                                const newUrls = newFiles.map(file => URL.createObjectURL(file));
                                                setSelectedFiles(prev => [...prev, ...newFiles]);
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
                                    <span className="material-icons-outlined">lightbulb</span>
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
    );
}
