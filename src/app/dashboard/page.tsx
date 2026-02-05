import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    // For public view, only show VERIFIED reports
    // In future: check user role and show all reports for Admin/Expert
    const reports = await prisma.pestReport.findMany({
        where: {
            status: "VERIFIED",
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Get counts for overview
    const totalVerified = reports.length;

    // Get pest distribution for chart
    const pestDistribution = await prisma.pestReport.groupBy({
        by: ["pestId"],
        where: { status: "VERIFIED" },
        _count: true,
    });

    // Get province distribution
    const provinceDistribution = await prisma.pestReport.groupBy({
        by: ["province"],
        where: { status: "VERIFIED" },
        _count: true,
        orderBy: { _count: { province: "desc" } },
        take: 5,
    });

    return (
        <DashboardClient
            reports={reports}
            totalVerified={totalVerified}
            pestDistribution={pestDistribution}
            provinceDistribution={provinceDistribution}
        />
    );
}
