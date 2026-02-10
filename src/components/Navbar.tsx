"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import { NotificationBell } from "@/components/NotificationBell";
import { ExpertNotificationBadge } from "@/components/ExpertNotificationBadge";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

type UserRole = "USER" | "EXPERT" | "ADMIN";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        const fetchRole = async (userId: string) => {
            try {
                console.log("Navbar: Fetching role for userId:", userId);
                const res = await fetch("/api/user-role");
                console.log("Navbar: API response status:", res.status);
                if (res.ok) {
                    const data = await res.json();
                    console.log("Navbar: API response data:", data);
                    setUserRole(data.role);
                    console.log("Navbar: Set userRole to:", data.role);
                } else {
                    console.error("Navbar: API error:", res.statusText);
                }
            } catch (error) {
                console.error("Navbar: Failed to fetch user role:", error);
            }
        };

        const fetchUserAndRole = async () => {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                await fetchRole(user.id);
            }
            setIsLoading(false);
        };

        fetchUserAndRole();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Navbar: Auth state change:", event);
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                await fetchRole(currentUser.id);
            } else {
                setUserRole(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const isExpertOrAdmin = userRole === "EXPERT" || userRole === "ADMIN";

    const dashboardHref = userRole === "ADMIN"
        ? "/dashboard/admin"
        : "/dashboard";

    const menuItems = [
        { name: "หน้าหลัก", href: "/" },
        { name: "เกี่ยวกับเรา", href: "/about" },
        { name: "ข้อมูลศัตรูพืช", href: dashboardHref },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                        <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
                            <Image
                                src="/logo.png"
                                alt="RicePestNet Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
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
                        {user ? (
                            <>
                                {isExpertOrAdmin ? <ExpertNotificationBadge /> : <NotificationBell />}
                                <UserMenu user={user} isLoading={isLoading} role={userRole} />
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="outline" size="sm" className="rounded-full">
                                        เข้าสู่ระบบ
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button
                                        size="sm"
                                        className="bg-cta text-cta-foreground hover:bg-cta/90 rounded-full"
                                    >
                                        เข้าร่วมเครือข่าย
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggle />
                        {user && (
                            isExpertOrAdmin ? <ExpertNotificationBadge /> : <NotificationBell />
                        )}
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
                        {!user && (
                            <div className="pt-4 pb-2 space-y-2 border-t border-border mt-2">
                                <Link
                                    href="/login"
                                    className="block px-3 py-2 rounded-lg text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    เข้าสู่ระบบ
                                </Link>
                                <Link
                                    href="/signup"
                                    className="block px-3 py-2 rounded-lg text-base font-medium bg-cta text-cta-foreground hover:bg-cta/90 mx-3"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    เข้าร่วมเครือข่าย
                                </Link>
                            </div>
                        )}
                        {user && (
                            <div className="pt-2 border-t border-border mt-2">
                                <div className="px-3 py-2">
                                    <UserMenu user={user} isLoading={isLoading} role={userRole} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
