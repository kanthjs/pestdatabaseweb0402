import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ExpertReviewLoading() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="bg-secondary/10 p-3 rounded-xl">
                    <div className="size-6 bg-muted rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                </div>
            </div>

            {/* Review Queue */}
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="size-12 bg-muted rounded-lg animate-pulse" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                    <div className="flex gap-2 mt-4">
                                        <div className="h-9 w-24 bg-muted rounded animate-pulse" />
                                        <div className="h-9 w-24 bg-muted rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
