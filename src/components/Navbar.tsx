"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import { NotificationBell } from "@/components/NotificationBell";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const menuItems = [
        { name: "About", href: "/" },
        { name: "Data Map", href: "/dashboard" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                        <span className="material-icons-outlined text-primary text-3xl group-hover:scale-110 transition-transform">
                            agriculture
                        </span>
                        <span className="font-display font-bold text-xl tracking-tight text-primary">
                            RicePest<span className="text-secondary">Net</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                className="text-muted-foreground hover:text-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                href={item.href}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        {user && <NotificationBell />}
                        <UserMenu user={user} isLoading={isLoading} />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggle />
                        {user && <NotificationBell />}
                        <button
                            className="text-muted-foreground hover:text-foreground focus:outline-none"
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="material-icons-outlined text-2xl">
                                {mobileMenuOpen ? "close" : "menu"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-background border-t border-border">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-2 rounded-lg text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-2 border-t border-border mt-2">
                            <div className="px-3 py-2">
                                <UserMenu user={user} isLoading={isLoading} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}