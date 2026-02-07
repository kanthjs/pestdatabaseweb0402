import { getUserDashboardData } from "./actions";
import UserDashboardClient from "./UserDashboardClient";

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
    const data = await getUserDashboardData();

    return <UserDashboardClient {...data} />;
}
