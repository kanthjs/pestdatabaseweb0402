"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PestRanking } from "../actions";
import { Map } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PestRankingChartProps {
    data: PestRanking[];
    loading?: boolean;
}

export function PestRankingChart({ data, loading }: PestRankingChartProps) {
    if (loading) {
        return (
            <Card className="col-span-1 border-none shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Top 5 ศัตรูพืชเฝ้าระวัง</CardTitle>
                    <CardDescription>วิเคราะห์จากจำนวนรายงานในรอบ 30 วัน</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-1 overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    Top 5 ศัตรูพืชเฝ้าระวัง
                </CardTitle>
                <CardDescription>
                    Pest Ranking (30-day monitoring data)
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Desktop Header Row */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 mb-2">
                    <div className="col-span-4">Pest Name</div>
                    <div className="col-span-2 text-right">Reports</div>
                    <div className="col-span-3 text-right">Affected Area</div>
                    <div className="col-span-3 pl-4">Severity/Incidence</div>
                </div>

                <div className="space-y-3">
                    {data.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">ไม่มีข้อมูลรายงานในช่วงนี้</div>
                    ) : (
                        data.map((item, index) => (
                            <div
                                key={item.id}
                                className="group relative p-4 md:py-3 md:px-4 rounded-xl bg-background/40 border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all duration-300 shadow-sm hover:shadow-md grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                            >
                                {/* Rank & Name (Col 4) */}
                                <div className="col-span-4 flex items-center gap-3">
                                    <span className={cn(
                                        "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shadow-sm",
                                        index === 0 ? "bg-amber-500 text-white" :
                                            index === 1 ? "bg-slate-300 text-slate-700" :
                                                index === 2 ? "bg-amber-700 text-amber-100" :
                                                    "bg-secondary text-muted-foreground"
                                    )}>
                                        {index + 1}
                                    </span>
                                    <h3 className="font-bold text-base md:text-sm group-hover:text-primary transition-colors line-clamp-1" title={item.name}>
                                        {item.name}
                                    </h3>
                                </div>

                                {/* Report Count (Col 2) */}
                                <div className="col-span-2 flex items-center justify-between md:justify-end md:gap-4">
                                    <span className="md:hidden text-xs text-muted-foreground font-bold uppercase">Reports</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-bold text-lg md:text-base text-primary">{item.count}</span>
                                        <span className="hidden md:inline text-[10px] text-muted-foreground">reps</span>
                                    </div>
                                </div>

                                {/* Affected Area (Col 3) */}
                                <div className="col-span-3 flex items-center justify-between md:justify-end md:gap-4 md:border-l md:border-r border-border/50 md:px-4">
                                    <span className="md:hidden text-xs text-muted-foreground font-bold uppercase">Area</span>
                                    <div className="text-right">
                                        <div className="font-bold text-base md:text-sm flex items-center justify-end gap-1.5">
                                            <Map className="w-3.5 h-3.5 text-muted-foreground hidden md:inline" />
                                            {item.totalArea.toLocaleString()}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">ไร่</div>
                                    </div>
                                </div>

                                {/* Incidence & Severity (Col 3) */}
                                <div className="col-span-3 space-y-2 md:pl-2">
                                    {/* Incidence */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-muted-foreground">Incidence</span>
                                            <span className="font-bold text-orange-600">{item.avgIncidence}%</span>
                                        </div>
                                        <Progress
                                            value={item.avgIncidence}
                                            className="h-1 bg-orange-500/10"
                                            indicatorClassName="bg-orange-500"
                                        />
                                    </div>
                                    {/* Severity */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-muted-foreground">Severity</span>
                                            <span className="font-bold text-rose-600">{item.avgSeverity}%</span>
                                        </div>
                                        <Progress
                                            value={item.avgSeverity}
                                            className="h-1 bg-rose-500/10"
                                            indicatorClassName="bg-rose-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

