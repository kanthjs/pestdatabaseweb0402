"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { addDays, subDays } from "date-fns";
import { DateRange } from "react-day-picker";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardFilter } from "./components/DashboardFilter";
import { MetricsCards } from "./components/MetricsCards";
import { AnalyticsCharts } from "./components/AnalyticsCharts";
import { getDashboardMetrics, DashboardViewMode } from "./actions";
import { Button } from "@/components/ui/button";
import { Globe, User } from "lucide-react";

// Dynamic import for Map to avoid SSR issues
const AdvancedMap = dynamic(() => import("./components/AdvancedMap"), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-muted animate-pulse rounded-xl">Loading Map...</div>
});

export default function DashboardClient() {
    const [date, setDate] = useState<DateRange | undefined>();
    const [viewMode, setViewMode] = useState<DashboardViewMode>("public");

    // Use useEffect to set the default date on critical client-side mount
    // This avoids hydration mismatch due to server/client timezone differences
    useEffect(() => {
        setDate({
            from: subDays(new Date(), 30),
            to: new Date(),
        });
    }, []);

    const { data: metrics, isLoading, isError } = useQuery({
        queryKey: ["dashboardMetrics", date?.from, date?.to, viewMode],
        queryFn: async () => {
            if (!date?.from || !date?.to) return null;
            return await getDashboardMetrics(date.from, date.to, viewMode);
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
                            {viewMode === "public" ? "Dashboard Overview" : "My Dashboard"}
                        </h1>
                        <p className="text-muted-foreground">
                            {viewMode === "public" 
                                ? "Real-time monitoring and pest outbreak analytics." 
                                : "Your personal pest reports and analytics."}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* View Mode Toggle */}
                        <div className="flex items-center bg-muted rounded-lg p-1 mr-2">
                            <Button
                                variant={viewMode === "public" ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("public")}
                                className="gap-2"
                            >
                                <Globe className="h-4 w-4" />
                                Public
                            </Button>
                            <Button
                                variant={viewMode === "personal" ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("personal")}
                                className="gap-2"
                            >
                                <User className="h-4 w-4" />
                                My Data
                            </Button>
                        </div>
                        <DashboardFilter date={date} setDate={setDate} />
                    </div>
                </div>

                {/* Key Metrics */}
                <MetricsCards metrics={metrics || null} loading={isLoading} viewMode={viewMode} />

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="map">Geographic Map</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <AnalyticsCharts
                            trendData={metrics?.trendData || []}
                            pestRanking={metrics?.pestRanking || []}
                            geoData={metrics?.geoData || []}
                            loading={isLoading}
                        />
                    </TabsContent>

                    <TabsContent value="analytics">
                        {/* Reuse charts for now, but could have more detailed tables here */}
                        <AnalyticsCharts
                            trendData={metrics?.trendData || []}
                            pestRanking={metrics?.pestRanking || []}
                            geoData={metrics?.geoData || []}
                            loading={isLoading}
                        />
                    </TabsContent>

                    <TabsContent value="map">
                        <AdvancedMap reports={metrics?.mapData || []} />
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    );
}

