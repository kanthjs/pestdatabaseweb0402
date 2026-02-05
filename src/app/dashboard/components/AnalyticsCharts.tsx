"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

// --- Configs ---
const trendChartConfig = {
    reported: {
        label: "Reports",
        color: "hsl(var(--chart-1))",
    },
    symptom: {
        label: "Symptoms Onset",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const rankingChartConfig = {
    frequency: {
        label: "Frequency",
        color: "hsl(var(--chart-1))",
    },
    area: {
        label: "Area (Rai)",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

interface AnalyticsChartsProps {
    trendData: Array<{ date: string; reported: number; symptom: number }>;
    pestRanking: Array<{ pestName: string; frequency: number; area: number }>;
    geoData: Array<{ province: string; area: number; count: number }>;
    loading?: boolean;
}

export function AnalyticsCharts({ trendData, pestRanking, geoData, loading }: AnalyticsChartsProps) {
    if (loading) return <div>Loading charts...</div>;

    // Prepare Pie Chart Data (Top 5 Pests by Area)
    const pieData = pestRanking.slice(0, 5).map((p, index) => ({
        pest: p.pestName,
        area: p.area,
        fill: `hsl(var(--chart-${(index % 5) + 1}))`,
    }));

    const pieConfig = Object.fromEntries(
        pieData.map((d, i) => [d.pest, { label: d.pest, color: d.fill }])
    ) satisfies ChartConfig;


    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

            {/* Trend Chart (Area) - Spans 4 cols */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Outbreak Trend</CardTitle>
                    <CardDescription>
                        Reported date vs Symptom onset date
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={trendChartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={trendData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(5)} // Show MM-DD
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Area
                                dataKey="symptom"
                                type="natural"
                                fill="var(--color-symptom)"
                                fillOpacity={0.4}
                                stroke="var(--color-symptom)"
                                stackId="a"
                            />
                            <Area
                                dataKey="reported"
                                type="natural"
                                fill="var(--color-reported)"
                                fillOpacity={0.4}
                                stroke="var(--color-reported)"
                                stackId="b"
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Pest Distribution (Donut) - Spans 3 cols */}
            <Card className="col-span-3 flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Top Pests by Area</CardTitle>
                    <CardDescription>Distribution of affected area</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer config={pieConfig} className="mx-auto aspect-square max-h-[250px]">
                        <PieChart>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie
                                data={pieData}
                                dataKey="area"
                                nameKey="pest"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {pieData.reduce((a, b) => a + b.area, 0).toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Rai
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Province Ranking (Horizontal Bar) - Spans 7 cols (Full width) */}
            <Card className="col-span-7">
                <CardHeader>
                    <CardTitle>Province Impact</CardTitle>
                    <CardDescription>Affected area by province</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{ area: { label: "Area", color: "hsl(var(--chart-3))" } }}>
                        <BarChart
                            accessibilityLayer
                            data={geoData.slice(0, 10)}
                            layout="vertical"
                            margin={{ left: 0 }} // adjust for long names if needed, usually recharts needs explicit width for yaxis ticks
                            height={300}
                        >
                            <CartesianGrid horizontal={false} />
                            <YAxis
                                dataKey="province"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                width={100}
                            />
                            <XAxis dataKey="area" type="number" hide />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Bar
                                dataKey="area"
                                layout="vertical"
                                fill="var(--color-area)"
                                radius={4}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

        </div>
    );
}
