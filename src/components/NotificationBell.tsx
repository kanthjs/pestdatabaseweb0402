"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type Notification = {
    id: string;
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    reportId?: string;
};

export function NotificationBell() {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    // Fetch notifications
    const { data: notifications = [] } = useQuery<Notification[]>({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await fetch("/api/notifications");
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        },
        refetchInterval: 30000, // Poll every 30s
    });

    // Mark as read mutation
    const markReadMutation = useMutation({
        mutationFn: async (id?: string) => {
            await fetch("/api/notifications", {
                method: "POST",
                body: JSON.stringify({ id, markAll: !id }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="relative">
            <button
                className="relative p-2 rounded-full hover:bg-muted/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="material-icons-outlined text-2xl text-muted-foreground">
                    notifications
                </span>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card shadow-lg z-50">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markReadMutation.mutate(undefined)}
                                    className="text-xs text-primary hover:underline"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    No notifications
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className={`p-4 hover:bg-muted/50 transition-colors ${!n.isRead ? "bg-primary/5" : ""
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.type === "VERIFIED" ? "bg-green-500" :
                                                    n.type === "REJECTED" ? "bg-destructive" : "bg-blue-500"
                                                    }`} />
                                                <div className="space-y-1">
                                                    <p className="text-sm leading-snug">{n.message}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                    </p>
                                                    {n.reportId && (
                                                        <Link
                                                            href={n.type === "NEW_REPORT" ? "/expert/review" : "/my-reports"}
                                                            onClick={() => {
                                                                setIsOpen(false);
                                                                if (!n.isRead) markReadMutation.mutate(n.id);
                                                            }}
                                                            className="text-xs text-primary hover:underline block pt-1"
                                                        >
                                                            View Report
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
