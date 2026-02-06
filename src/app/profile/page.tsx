import { redirect } from "next/navigation";
import Link from "next/link";
import { getProfileData } from "./actions";
import ProfileFormClient from "./ProfileFormClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const profile = await getProfileData();

    if (!profile) {
        redirect("/login?redirectTo=/profile");
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                            >
                                <span className="material-icons-outlined text-muted-foreground">arrow_back</span>
                            </Link>
                            <div>
                                <h1 className="text-xl font-display font-bold text-primary">
                                    โปรไฟล์ของฉัน
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี
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

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ProfileFormClient initialData={profile} />
            </main>
        </div>
    );
}
