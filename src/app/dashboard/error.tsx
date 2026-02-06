"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface DashboardErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
    return (
        <div className="container mx-auto p-6">
            <Card className="border-destructive/20">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <div className="bg-destructive/10 p-2.5 rounded-xl text-destructive">
                        <AlertTriangle className="size-6" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-display text-destructive">
                            Dashboard Error
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Failed to load dashboard data
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground font-mono">
                            {error.message || "An unexpected error occurred"}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-muted-foreground/70 mt-2">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                    <Button onClick={reset} className="h-12 rounded-xl">
                        <RefreshCcw className="size-4 mr-2" />
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
