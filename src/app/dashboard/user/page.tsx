import { redirect } from "next/navigation";

// This page has been merged into the unified /dashboard
// Redirecting to maintain backwards compatibility
export default function UserDashboardPage() {
    redirect("/dashboard");
}
