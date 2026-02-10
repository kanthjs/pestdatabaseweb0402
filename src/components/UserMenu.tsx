"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { signout } from "@/app/login/actions";
import { User } from "@supabase/supabase-js";

interface UserMenuProps {
    user: User | null;
    isLoading?: boolean;
    role?: "USER" | "EXPERT" | "ADMIN" | null;
}

export default function UserMenu({ user, isLoading = false, role }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Debug: log role value
    useEffect(() => {
        console.log("UserMenu: Received role:", role);
    }, [role]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="flex items-center gap-2 animate-pulse">
                <div className="w-24 h-9 rounded-xl bg-muted" />
                <div className="w-8 h-8 rounded-full bg-muted" />
            </div>
        );
    }

    // Report Pest button — always visible regardless of auth state
    const ReportPestButton = (
        <Link
            href="/survey"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cta text-cta-foreground font-medium hover:opacity-90 transition-all shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 text-sm"
        >
            <span className="material-icons-outlined text-lg">add_a_photo</span>
            <span className="hidden sm:inline">Report Pest</span>
        </Link>
    );

    // Not logged in
    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Link
                    href="/login"
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2"
                >
                    Log In
                </Link>
                {ReportPestButton}
            </div>
        );
    }

    // Logged in — Report Pest button + User dropdown
    return (
        <div className="flex items-center gap-3">
            {ReportPestButton}

            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-icons-outlined text-primary text-lg">
                            person
                        </span>
                    </div>
                    <span className="text-sm font-medium text-foreground hidden sm:inline max-w-[120px] truncate">
                        {user.email?.split("@")[0]}
                    </span>
                    <span className="material-icons-outlined text-muted-foreground text-lg">
                        {isOpen ? "expand_less" : "expand_more"}
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-lg py-2 z-50">
                        <div className="px-4 py-2 border-b border-border">
                            <p className="text-xs text-muted-foreground">Signed in as</p>
                            <p className="text-sm font-medium text-foreground truncate">
                                {user.email}
                            </p>
                        </div>
                        <Link
                            href="/survey"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors md:hidden"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="material-icons-outlined text-lg">add_a_photo</span>
                            Report Pest
                        </Link>
                        <Link
                            href={
                                role === "ADMIN"
                                    ? "/dashboard/admin"
                                    : "/dashboard"
                            }
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            <span className="material-icons-outlined text-lg">dashboard</span>
                            Dashboard
                        </Link>
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="material-icons-outlined text-lg">account_circle</span>
                            Profile
                        </Link>
                        {(role === "EXPERT" || role === "ADMIN") && (
                            <Link
                                href="/review"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="material-icons-outlined text-lg">
                                    verified_user
                                </span>
                                Expert Review
                            </Link>
                        )}
                        <div className="border-t border-border mt-1 pt-1">
                            <form action={signout}>
                                <button
                                    type="submit"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
                                >
                                    <span className="material-icons-outlined text-lg">logout</span>
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}