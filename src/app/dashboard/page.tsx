import { getCurrentUserInfo, getDashboardMetrics, getUserPersonalData } from "./actions";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
    const userInfo = await getCurrentUserInfo();
    const metrics = await getDashboardMetrics();

    let userStats = undefined;
    let userReports = undefined;

    // If logged in, fetch their personal data too
    if (userInfo.role !== "guest" && userInfo.userId) {
        const personalData = await getUserPersonalData(userInfo.userId);
        userStats = personalData.stats;
        userReports = personalData.reports;
    }

    return (
        <DashboardClient
            role={userInfo.role}
            userEmail={userInfo.userEmail}
            userName={userInfo.userName}
            metrics={metrics}
            userStats={userStats}
            userReports={userReports}
        />
    );
}
