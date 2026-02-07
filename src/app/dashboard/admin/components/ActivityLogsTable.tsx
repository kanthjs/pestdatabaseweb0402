"use client";

import React, { useState, useEffect } from "react";
import { getAdminActivityLogs, AdminActivityLogItem } from "../actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ActivityLogsTable() {
    const [logs, setLogs] = useState<AdminActivityLogItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await getAdminActivityLogs(50); // Limit to 50 for now
            setLogs(data);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getActionBadge = (action: string) => {
        if (action.includes("DELETE")) return <Badge variant="destructive">{action}</Badge>;
        if (action.includes("APPROVE")) return <Badge className="bg-green-100 text-green-800">{action}</Badge>;
        if (action.includes("REJECT")) return <Badge className="bg-red-100 text-red-800">{action}</Badge>;
        if (action.includes("UPDATE")) return <Badge className="bg-blue-100 text-blue-800">{action}</Badge>;
        if (action.includes("CHANGE")) return <Badge className="bg-purple-100 text-purple-800">{action}</Badge>;
        return <Badge variant="outline">{action}</Badge>;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Activity Logs</CardTitle>
                <CardDescription>Recent administrative actions (Audit Trail).</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-4">Loading logs...</div>
                ) : (
                    <ScrollArea className="h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[180px]">Date/Time</TableHead>
                                    <TableHead>Admin</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No activity logs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="text-sm">
                                                {format(new Date(log.createdAt), "d MMM yyyy HH:mm", { locale: th })}
                                            </TableCell>
                                            <TableCell className="font-medium">{log.adminName}</TableCell>
                                            <TableCell>{getActionBadge(log.action)}</TableCell>
                                            <TableCell className="text-sm">
                                                <div className="flex flex-col">
                                                    <span>{log.entityType}</span>
                                                    <span className="text-xs text-muted-foreground">{log.targetId?.substring(0, 8)}...</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs font-mono text-muted-foreground max-w-[200px] truncate">
                                                {JSON.stringify(log.details)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
