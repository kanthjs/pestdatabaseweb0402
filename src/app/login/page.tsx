import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message?: string; redirectTo?: string };
}) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <span className="material-icons-outlined text-primary text-4xl">
                            agriculture
                        </span>
                        <span className="font-display font-bold text-2xl text-primary">
                            RicePest<span className="text-secondary">Net</span>
                        </span>
                    </Link>
                    <p className="text-muted-foreground mt-2">
                        Log in to access expert features
                    </p>
                </div>

                {/* Message */}
                {searchParams.message && (
                    <div className="mb-6 p-4 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-sm text-center">
                        {searchParams.message}
                    </div>
                )}

                {/* Login Card */}
                <div className="bg-card rounded-2xl border border-border shadow-lg p-8">
                    <h1 className="text-xl font-display font-bold text-primary mb-6">
                        Welcome Back
                    </h1>

                    <LoginForm redirectTo={searchParams.redirectTo} />

                    <div className="mt-6 pt-6 border-t border-border text-center">
                        <p className="text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-primary font-medium hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to home */}
                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
