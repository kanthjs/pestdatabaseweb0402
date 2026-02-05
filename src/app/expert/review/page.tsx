import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import ReviewQueueClient from "./ReviewQueueClient";
import { getCurrentUser } from "@/app/login/actions";
import { ReportStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ExpertReviewPage() {
    // Check user role - require EXPERT or ADMIN
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login?redirectTo=/expert/review");
    }

    // Check if user has expert or admin role
    if (user.role !== "EXPERT" && user.role !== "ADMIN") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="bg-destructive/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <span className="material-icons-outlined text-destructive text-4xl">
                            block
                        </span>
                    </div>
                    <h1 className="text-2xl font-display font-bold text-primary mb-2">
                        Access Denied
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        You need Expert or Admin role to access this page.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-icons-outlined">dashboard</span>
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Fetch pending reports from database
    const pendingReports = await prisma.pestReport.findMany({
        where: {
            status: ReportStatus.PENDING,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Get counts for dashboard
    const counts = await prisma.pestReport.groupBy({
        by: ["status"],
        _count: true,
    });

    const pendingCount = counts.find((c) => c.status === "PENDING")?._count ?? 0;
    const verifiedCount = counts.find((c) => c.status === "VERIFIED")?._count ?? 0;
    const rejectedCount = counts.find((c) => c.status === "REJECTED")?._count ?? 0;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-xl">
                                <span className="material-icons-outlined text-primary text-2xl">
                                    verified_user
                                </span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-display font-bold text-primary">
                                    Expert Verification Queue
                                </h1>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    Review and verify pest reports submitted by users
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <span className="material-icons-outlined">home</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent/20 p-3 rounded-xl">
                                <span className="material-icons-outlined text-accent text-xl">
                                    pending
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Pending
                                </p>
                                <p className="text-3xl font-bold text-accent">
                                    {pendingCount}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-secondary/20 p-3 rounded-xl">
                                <span className="material-icons-outlined text-secondary text-xl">
                                    check_circle
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Verified
                                </p>
                                <p className="text-3xl font-bold text-secondary">
                                    {verifiedCount}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-destructive/20 p-3 rounded-xl">
                                <span className="material-icons-outlined text-destructive text-xl">
                                    cancel
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Rejected
                                </p>
                                <p className="text-3xl font-bold text-destructive">
                                    {rejectedCount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Queue Table */}
                <ReviewQueueClient reports={pendingReports} />
            </div>
        </div>
    );
}
