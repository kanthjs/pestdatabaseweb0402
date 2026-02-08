import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface LandingHeroProps {
  reportCount: number;
  memberCount: number;
  organizationCount?: number;
}

export function LandingHero({
  reportCount,
  memberCount,
  organizationCount = 25,
}: LandingHeroProps) {
  return (
    <section className="relative min-h-[90vh]">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Hero Image - Full Width at Top */}
      <div className="relative w-full h-[50vh] lg:h-[60vh]">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsFTNo1gJGqSi6iL3lMZUfIdag7qxOmev-BjWfiH9LwzM3UKa4uV4eIl2FUr3wuiYRCwj_RuROSiDIaMGDIU4nv6s14883dDchR1J6ubGZi8fliP69GGtgOkEVbTcKhxYp0kYcnTJy6Lf4sCiOLr_iXiYK1b7Wu8mUw0vKj7W8usXBSOxzr8gFqiz0wijRnilqrNkbUXzAb5J6ckRAQXeMuUm4BE4rGGm55Oqbf7Lag27D8m4f5jidpWbPfG0z9cttY982wKpTIhyd"
          alt="ทุ่งนาข้าวสีเขียวขจี"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-20 relative z-10">
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-border">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
            เครือข่ายเฝ้าระวัง
            <br />
            <span className="text-secondary">ศัตรูพืชข้าว</span>
            <br />
            แห่งประเทศไทย
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl">
            เข้าร่วมเครือข่ายผู้เชี่ยวชาญและเกษตรกรในการเฝ้าระวัง ติดตาม
            และรายงานการระบาดของศัตรูพืชข้าว เพื่อความมั่นคงทางอาหารของประเทศ
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-cta text-cta-foreground hover:bg-cta/90 rounded-full px-8 py-6 text-lg font-semibold shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1"
              >
                <span className="material-icons-outlined mr-2">person_add</span>
                เข้าร่วมเครือข่าย
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-medium border-2"
              >
                <span className="material-icons-outlined mr-2">visibility</span>
                ดูข้อมูลศัตรูพืช
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
            {[
              { value: memberCount.toLocaleString(), label: "สมาชิกที่ใช้งาน" },
              { value: organizationCount.toString(), label: "หน่วยงานพันธมิตร" },
              { value: reportCount.toLocaleString(), label: "รายงานที่ได้รับการยืนยัน" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
