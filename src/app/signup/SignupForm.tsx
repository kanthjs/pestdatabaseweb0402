"use client";

import { useState } from "react";
import { signup } from "../login/actions";

export default function SignupForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        const result = await signup(formData);

        if (result && !result.success) {
            setError(result.message ?? "Signup failed");
            setIsLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-5">
            {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                </div>
            )}

            <div>
                <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-foreground mb-2"
                >
                    Full Name
                </label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="John Doe"
                />
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                >
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground mb-2"
                >
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="••••••••"
                />
                <p className="text-xs text-muted-foreground mt-1">
                    At least 6 characters
                </p>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <span className="material-icons-outlined animate-spin text-lg">
                            autorenew
                        </span>
                        Creating account...
                    </>
                ) : (
                    <>
                        <span className="material-icons-outlined text-lg">
                            person_add
                        </span>
                        Create Account
                    </>
                )}
            </button>
        </form>
    );
}
