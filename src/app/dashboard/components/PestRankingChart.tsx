"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PestRanking } from "../actions";

interface PestRankingChartProps {
    data: PestRanking[];
    loading?: boolean;
}

export function PestRankingChart({ data, loading }: PestRankingChartProps) {
    if (loading) {
        return (
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Top 5 ศัตรูพืชเฝ้าระวัง</CardTitle>
                    <CardDescription>วิเคราะห์จากจำนวนรายงานในรอบ 30 วัน</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg" />
                </CardContent>
            </Card>
        );
    }

    const chartData = data.map((item) => ({
        name: item.name,
        count: item.count,
    }));

    // Premium color palette for the bars
    const colors = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16"];

    return (
        <Card className="col-span-1 overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    Top 5 ศัตรูพืชเฝ้าระวัง
                </CardTitle>
                <CardDescription>
                    Pest Ranking (30-day report count)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
                            <XAxis
                                type="number"
                                hide
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={120}
                                tick={{ fontSize: 12, fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                                contentStyle={{
                                    backgroundColor: 'var(--background)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Bar
                                dataKey="count"
                                radius={[0, 4, 4, 0]}
                                barSize={32}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
