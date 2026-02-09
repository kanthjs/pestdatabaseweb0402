import { prisma } from "@/lib/prisma";
import { ReportStatus } from "@prisma/client";
import {
  LandingHero,
  ProblemAgitate,
  ValueStack,
  SocialProof,
  // Transformation, // ยังไม่พร้อมแสดง - รอโปรเจคโตขึ้นก่อน
  SecondaryCTA,
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
      {/* 1. HERO - Get the email or get the scroll */}
      <LandingHero
        reportCount={reportCount}
        memberCount={memberCount}
        organizationCount={25}
      />

      {/* 2. SUCCESS - Skip (conditional, for post-signup page) */}

      {/* 3. PROBLEM-AGITATE - Make the status quo painful */}
      <ProblemAgitate />

      {/* 4. VALUE STACK - Make saying no feel stupid */}
      <ValueStack />

      {/* 5. SOCIAL PROOF - Let others convince them */}
      <SocialProof memberCount={memberCount} organizationCount={25} />

      {/* 6. TRANSFORMATION - Make the outcome tangible */}
      {/* <Transformation /> */}
      {/* ยังไม่พร้อมแสดง - รอให้โปรเจคมีความชัดเจนมากขึ้นก่อน */}

      {/* 7. SECONDARY CTA - Catch the scrollers */}
      <SecondaryCTA memberCount={memberCount} />

      {/* 8. FOOTER - Professional legitimacy */}
      <LandingFooter />
    </div>
  );
}
