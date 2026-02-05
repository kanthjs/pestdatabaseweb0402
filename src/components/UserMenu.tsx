"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/app/login/actions";

interface User {
    email?: string;
}

export default function UserMenu() {
    const [user, setUser] = useState<User | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const supabase = createClient();

        async function getUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        }

        getUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!user) {
        return (
            <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
            >
                <span className="material-icons-outlined text-lg">login</span>
                <span className="hidden sm:inline">Sign In</span>
            </Link>
        );
    }

    return (
        <div className="relative">
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
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <span className="material-icons-outlined text-lg">dashboard</span>
                        Dashboard
                    </Link>
                    <Link
                        href="/expert/review"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <span className="material-icons-outlined text-lg">
                            verified_user
                        </span>
                        Expert Review
                    </Link>
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
    );
}
