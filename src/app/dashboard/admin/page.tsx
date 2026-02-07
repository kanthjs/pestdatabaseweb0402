import { getAdminDashboardData } from "./actions";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
    const data = await getAdminDashboardData();

    return <AdminDashboardClient {...data} />;
}
