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
      {/* ส่วนหลักของ Hero ที่สร้างความประทับใจแแรกพบเมื่อเข้าเว็บไซต์ */}
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* รูปภาพพื้นหลัง (Hero Image) เพื่อสร้างมู้ดและโทนของเว็บไซต์เกษตรกร */}
      <div className="relative w-full h-[50vh] lg:h-[60vh]">
        <Image
          src="/cover.jpg"
          alt="ทุ่งนาข้าวสีเขียวขจี"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* ส่วนเนื้อหาหลักที่ลอยอยู่บนรูปภาพ (Content Card) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-20 relative z-10">
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-border">
          {/* ข้อความกำกับด้านบน (Eyebrow) บอกชื่อกลุ่มหรือโครงการ */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-6">
            <span className="material-icons-outlined text-base">agriculture</span>
            เครือข่ายเฝ้าระวังศัตรูพืชข้าว
          </div>

          {/* หัวข้อหลัก (Headline) - เน้นปัญหาและความสำคัญเพื่อดึงดูดความสนใจ */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
            ร่วมกันรายงานเพื่อปกป้องผลผลิต
            <br />
            <span className="text-cta">ก่อนที่จะสายเกินไป</span>
          </h1>

          {/* คำอธิบายเพิ่มเติม (Description) ให้รายละเอียดเกี่ยวกับเครือข่ายและความสามารถของระบบ */}
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl">
            เข้าร่วมเครือข่ายเกษตรกรและผู้เชี่ยวชาญกว่า{" "}
            <span className="font-semibold text-primary">{memberCount.toLocaleString()}</span> คน
            ที่รายงานและติดตามการระบาดของศัตรูข้าวแบบ real-time
          </p>

          {/* ปุ่มเรียกร้องให้ดำเนินการ (Call to Action - CTA) - นำทางไปสู่ฟีเจอร์หลัก */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {/* ปุ่มรายงานศัตรูข้าว: ปุ่มหลักสำหรับเกษตรกรรายงานปัญหา (/survey) */}
            <Link href="/survey">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-cta text-cta-foreground hover:bg-cta/90 rounded-full px-10 py-7 text-lg font-semibold shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1"
              >
                <span className="material-icons-outlined mr-2">bug_report</span>
                รายงานศัตรูข้าว
              </Button>
            </Link>
            {/* ปุ่มสมัครสมาชิก: นำผู้ใช้ใหม่ไปยังหน้าลงทะเบียน (/signup) */}
            <Link href="/signup">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full px-8 py-7 text-lg font-medium border-2"
              >
                <span className="material-icons-outlined mr-2">person_add</span>
                เข้าร่วมเครือข่าย (ฟรี)
              </Button>
            </Link>
            {/* ปุ่มแดชบอร์ด: นำผู้ใช้ไปดูข้อมูลการระบาดและแผนที่ (/dashboard) */}
            <Link href="/dashboard" className="hidden sm:block">
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full px-8 py-7 text-lg font-medium"
              >
                <span className="material-icons-outlined mr-2">visibility</span>
                ดูข้อมูลศัตรูพืช
              </Button>
            </Link>
          </div>

          {/* ส่วนตัวเลขสถิติ (Stats) - เพื่อสร้างความน่าเชื่อถือด้วยข้อมูลจริง */}
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
