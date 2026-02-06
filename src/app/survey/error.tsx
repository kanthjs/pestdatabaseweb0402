"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface SurveyErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function SurveyError({ error, reset }: SurveyErrorProps) {
    return (
        <div className="min-h-screen bg-muted/20 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <Card className="border-destructive/20">
                    <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
                        <div className="bg-destructive/10 p-2.5 rounded-xl text-destructive">
                            <AlertTriangle className="size-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-display text-destructive">
                                Something went wrong
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Failed to load survey form
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                        <div className="bg-muted/30 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground font-mono">
                                {error.message || "An unexpected error occurred"}
                            </p>
                            {error.digest && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Error ID: {error.digest}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={reset}
                                className="flex-1 h-12 rounded-xl"
                                variant="default"
                            >
                                <RefreshCcw className="size-4 mr-2" />
                                Try Again
                            </Button>
                            <Link href="/" className="flex-1">
                                <Button
                                    variant="outline"
                                    className="w-full h-12 rounded-xl"
                                >
                                    <Home className="size-4 mr-2" />
                                    Go Home
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
