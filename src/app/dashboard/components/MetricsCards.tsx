"use client";

import { memo } from "react";
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

const MetricCard = memo(function MetricCard({
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
});

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
        totalReportsEver: number;
        totalArea: { value: number; trend: number };
        topPest: { name: string; count: number } | null;
        hotZone: { province: string; count: number; severity: number } | null;
    } | null;
    loading?: boolean;
}

export const MetricsCards = memo(function MetricsCards({ metrics, loading }: MetricsCardsProps) {
    if (loading || !metrics) {
        return (
            <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
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
        <div className="grid gap-4 md:grid-cols-2">
            <MetricCard
                title="จำนวนรายงานทั้งหมด"
                value={metrics.totalReportsEver.toLocaleString()}
                subtext="ตั้งแต่เริ่มระบบ"
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
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M12 18v-6" />
                        <path d="M9 15h6" />
                    </svg>
                }
                color="secondary"
            />
            <MetricCard
                title="รายงานใหม่ (30 วัน)"
                value={metrics.totalVerified.count.toLocaleString()}
                trend={metrics.totalVerified.trend}
                subtext="เทียบกับช่วงก่อนหน้า"
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
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                        <path d="M8 14h.01" />
                        <path d="M12 14h.01" />
                        <path d="M16 14h.01" />
                        <path d="M8 18h.01" />
                        <path d="M12 18h.01" />
                        <path d="M16 18h.01" />
                    </svg>
                }
                color="primary"
            />
        </div>
    );
});
