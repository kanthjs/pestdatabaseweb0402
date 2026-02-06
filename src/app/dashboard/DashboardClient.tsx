"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";

import { DashboardFilter } from "./components/DashboardFilter";
import { MetricsCards } from "./components/MetricsCards";
import { getDashboardMetrics } from "./actions";

// Dynamic import for Map to avoid SSR issues
const AdvancedMap = dynamic(() => import("./components/AdvancedMap"), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-muted animate-pulse rounded-xl">Loading Map...</div>
});

export default function DashboardClient() {
    const [date, setDate] = useState<DateRange | undefined>();

    // Use useEffect to set the default date on client-side mount
    // This avoids hydration mismatch due to server/client timezone differences
    useEffect(() => {
        setDate({
            from: subDays(new Date(), 30),
            to: new Date(),
        });
    }, []);

    const { data: metrics, isLoading, isError } = useQuery({
        queryKey: ["dashboardMetrics", date?.from, date?.to],
        queryFn: async () => {
            if (!date?.from || !date?.to) return null;
            return await getDashboardMetrics(date.from, date.to);
        },
        refetchInterval: 30000,
        enabled: !!(date?.from && date?.to),
    });

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Pest Outbreak Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Real-time monitoring of pest outbreaks and affected areas.
                        </p>
                    </div>
                    <DashboardFilter date={date} setDate={setDate} />
                </div>

                {/* Key Metrics */}
                <MetricsCards metrics={metrics || null} loading={isLoading} />

                {/* Geographic Map */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Geographic Distribution</h2>
                    <AdvancedMap reports={metrics?.mapData || []} />
                </div>

            </div>
        </div>
    );
}

