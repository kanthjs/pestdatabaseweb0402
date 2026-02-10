import { getReviewData } from "./actions";
import ReviewClient from "./ReviewClient";
import { ReportStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
    searchParams: { status?: string };
}

export default async function ReviewPage({ searchParams }: Props) {
    const statusFilter = (searchParams?.status as ReportStatus) || ReportStatus.PENDING;
    const data = await getReviewData(statusFilter);

    return (
        <ReviewClient
            stats={data.stats}
            reports={data.reports}
            expertName={data.expertName}
            currentFilter={statusFilter}
        />
    );
}
