import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MyReportsClient from "./MyReportsClient";

export default async function MyReportsPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/my-reports");
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <main className="container max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-display text-primary">Personal Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Manage and track your pest reports</p>
                </div>
                <MyReportsClient />
            </main>
        </div>
    );
}
