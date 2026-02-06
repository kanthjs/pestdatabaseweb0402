"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function ExpertNotificationBadge() {
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        // Fetch pending reports count
        const fetchPendingCount = async () => {
            try {
                const res = await fetch("/api/pending-count");
                if (res.ok) {
                    const data = await res.json();
                    setPendingCount(data.count);
                }
            } catch (error) {
                console.error("Failed to fetch pending count:", error);
            }
        };

        fetchPendingCount();
        // Poll every 30 seconds
        const interval = setInterval(fetchPendingCount, 30000);
        return () => clearInterval(interval);
    }, []);

    if (pendingCount === 0) {
        return (
            <Link
                href="/expert/review"
                className="relative p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
                <span className="material-icons-outlined text-2xl text-muted-foreground">
                    notifications
                </span>
            </Link>
        );
    }

    return (
        <Link
            href="/expert/review"
            className="relative p-2 rounded-full hover:bg-muted/50 transition-colors"
        >
            <span className="material-icons-outlined text-2xl text-muted-foreground">
                notifications
            </span>
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse">
                {pendingCount > 9 ? "9+" : pendingCount}
            </span>
        </Link>
    );
}
