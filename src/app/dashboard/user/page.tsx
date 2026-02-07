import { createClient } from "@/lib/supabase/server";
import DashboardClient from "../DashboardClient";

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <DashboardClient
            userEmail={user?.email}
            title="รายงานส่วนตัวของฉัน"
            description="แสดงสถิติและข้อมูลศัตรูพืชที่คุณเป็นผู้บันทึกในระบบ"
        />
    );
}
