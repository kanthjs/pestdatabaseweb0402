"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface MetricCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    trend?: number; // percentage
    trendLabel?: string;
    icon?: React.ReactNode;
    color?: "default" | "primary" | "secondary" | "destructive" | "warning";
}

function MetricCard({
    title,
    value,
    subtext,
    trend,
    trendLabel,
    icon,
    color = "default",
}: MetricCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon && <div className={cn("text-muted-foreground", getColorClass(color))}>{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(trend !== undefined || subtext) && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                        {trend !== undefined && (
                            <span
                                className={cn(
                                    "flex items-center font-medium mr-2",
                                    trend > 0
                                        ? "text-emerald-500"
                                        : trend < 0
                                            ? "text-rose-500"
                                            : "text-muted-foreground"
                                )}
                            >
                                {trend > 0 ? (
                                    <ArrowUpIcon className="mr-1 h-3 w-3" />
                                ) : trend < 0 ? (
                                    <ArrowDownIcon className="mr-1 h-3 w-3" />
                                ) : (
                                    <MinusIcon className="mr-1 h-3 w-3" />
                                )}
                                {Math.abs(trend)}%
                            </span>
                        )}
                        {subtext && <span>{subtext}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function getColorClass(color: MetricCardProps["color"]) {
    switch (color) {
        case "primary": return "text-primary";
        case "secondary": return "text-secondary";
        case "destructive": return "text-destructive";
        case "warning": return "text-yellow-500";
        default: return "";
    }
}

interface MetricsCardsProps {
    metrics: {
        totalVerified: { count: number; trend: number };
        totalArea: { value: number; trend: number };
        topPest: { name: string; count: number } | null;
        hotZone: { province: string; count: number; severity: number } | null;
    } | null;
    loading?: boolean;
}

export function MetricsCards({ metrics, loading }: MetricsCardsProps) {
    if (loading || !metrics) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="space-y-0 pb-2">
                            <div className="h-4 w-1/2 bg-muted rounded" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-1/3 bg-muted rounded mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                title="Verified Reports"
                value={metrics.totalVerified.count}
                trend={metrics.totalVerified.trend}
                subtext="from previous period"
                icon={
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4"
                    >
                        <path d="M12 2v20M2 12h20" />
                    </svg>
                }
                color="secondary"
            />
            <MetricCard
                title="Affected Area (Rai)"
                value={metrics.totalArea.value.toLocaleString()}
                trend={metrics.totalArea.trend}
                subtext="from previous period"
                icon={
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4"
                    >
                        <path d="M3 3v18h18" />
                        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                    </svg>
                }
                color="destructive"
            />
            <MetricCard
                title="Top Pest"
                value={metrics.topPest?.name || "None"}
                subtext={metrics.topPest ? `${metrics.topPest.count} incidents` : "No reports"}
                icon={
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4"
                    >
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                        <path d="M3 12h6" />
                        <path d="M15 12h6" />
                    </svg>
                }
                color="warning"
            />
            <MetricCard
                title="Hot Zone"
                value={metrics.hotZone?.province || "None"}
                subtext={metrics.hotZone ? `Severity: ${metrics.hotZone.severity}%` : "Safe"}
                icon={
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4"
                    >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                }
                color="destructive"
            />
        </div>
    );
}
