import Link from "next/link";
import Image from "next/image";
import SignupForm from "./SignupForm";

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex flex-col items-center gap-2">
                        <div className="relative w-16 h-16">
                            <Image
                                src="/logo.png"
                                alt="RicePestNet Logo"
                                fill
                                className="object-contain"
                                priority
                                sizes="64px"
                            />
                        </div>
                        <span className="font-display font-bold text-2xl text-primary">
                            RicePest<span className="text-secondary">Net</span>
                        </span>
                    </Link>
                    <p className="text-muted-foreground mt-2">
                        Create an account to submit reports
                    </p>
                </div>

                {/* Signup Card */}
                <div className="bg-card rounded-2xl border border-border shadow-lg p-8">
                    <h1 className="text-xl font-display font-bold text-primary mb-6">
                        Create Account
                    </h1>

                    <SignupForm />

                    <div className="mt-6 pt-6 border-t border-border text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-primary font-medium hover:underline"
                            >
                                Sign in
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
