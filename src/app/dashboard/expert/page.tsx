import { getExpertDashboardData } from "./actions";
import ExpertDashboardClient from "./ExpertDashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
    searchParams: { view?: string };
}

export default async function ExpertDashboardPage({ searchParams }: Props) {
    const filter = (searchParams?.view === "personal") ? "personal" : "global";
    const data = await getExpertDashboardData(filter);

    return <ExpertDashboardClient {...data} />;
}
