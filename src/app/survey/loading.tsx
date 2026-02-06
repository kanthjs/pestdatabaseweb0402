import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SurveyLoading() {
    return (
        <div className="min-h-screen bg-muted/20 py-8 px-4">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header Skeleton */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-secondary/10 p-3 rounded-xl">
                        <Loader2 className="size-8 animate-spin text-secondary" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                    </div>
                </div>

                {/* Form Card Skeleton */}
                <Card className="border-border/50 shadow-sm">
                    <CardContent className="p-8 space-y-8">
                        {/* Progress Skeleton */}
                        <div className="flex justify-between mb-8">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="size-10 rounded-full bg-muted animate-pulse" />
                                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                                </div>
                            ))}
                        </div>

                        {/* Content Skeleton */}
                        <div className="space-y-6">
                            <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
                                ))}
                            </div>
                        </div>

                        {/* Navigation Skeleton */}
                        <div className="flex justify-between pt-6 border-t">
                            <div className="h-10 w-24 bg-muted rounded-lg animate-pulse" />
                            <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
