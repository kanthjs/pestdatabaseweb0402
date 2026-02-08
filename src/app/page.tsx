import { prisma } from "@/lib/prisma";
import { ReportStatus } from "@prisma/client";
import {
  LandingHero,
  ValueProposition,
  NetworkRole,
  NetworkActivities,
  NetworkStats,
  MemberOrganizations,
  PestReporting,
  LandingFooter,
} from "@/components/landing";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch statistics from database
  const [reportCount, memberCount] = await Promise.all([
    prisma.pestReport.count({ where: { status: ReportStatus.APPROVED } }),
    prisma.userProfile.count(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <LandingHero
        reportCount={reportCount}
        memberCount={memberCount}
        organizationCount={25}
      />

      {/* Value Proposition - Why surveillance matters */}
      <ValueProposition />

      {/* Network Role */}
      <NetworkRole />

      {/* Network Activities */}
      <NetworkActivities />

      {/* Network Statistics */}
      <NetworkStats
        reports={reportCount}
        members={memberCount}
        organizations={25}
      />

      {/* Member Organizations */}
      <MemberOrganizations />

      {/* Pest Reporting Guide */}
      <PestReporting />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
