"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";

import { MetricsCards } from "./components/MetricsCards";
import { PestRankingChart } from "./components/PestRankingChart";
import { getDashboardMetrics } from "./actions";

// Dynamic import for Map to avoid SSR issues
const AdvancedMap = dynamic(() => import("./components/AdvancedMap"), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-muted animate-pulse rounded-xl">Loading Map...</div>
});

export default function DashboardClient() {
    const { data: metrics, isLoading, isError } = useQuery({
        queryKey: ["dashboardMetrics"],
        queryFn: async () => {
            const to = new Date();
            const from = subDays(to, 30);
            return await getDashboardMetrics(from, to);
        },
        refetchInterval: 30000,
    });

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-destructive">Error loading dashboard data</h2>
                    <p className="text-muted-foreground">Please try refreshing the page.</p>
                </div>
            </div>
        );
    }

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
                            รายงานสถานการณ์ศัตรูพืชในช่วง 30 วันที่ผ่านมา
                        </p>
                    </div>
                </div>

                {/* Key Metrics */}
                <MetricsCards metrics={metrics || null} loading={isLoading} />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Geographic Map */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-semibold">Geographic Distribution</h2>
                        <AdvancedMap reports={metrics?.mapData || []} />
                    </div>

                    {/* Pest Ranking */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Top 5 Pest Ranking</h2>
                        <PestRankingChart data={metrics?.pestRanking || []} loading={isLoading} />
                    </div>
                </div>

            </div>
        </div>
    );
}

