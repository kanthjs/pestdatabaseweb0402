import { getExpertDashboardData } from "./actions";
import ExpertDashboardClient from "./ExpertDashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExpertDashboardPage() {
    const data = await getExpertDashboardData();

    return <ExpertDashboardClient {...data} />;
}
