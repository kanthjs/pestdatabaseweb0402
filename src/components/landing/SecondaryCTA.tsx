import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SecondaryCTAProps {
  memberCount: number;
}

const avatarInitials = ["ส", "ว", "พ", "อ"];

export function SecondaryCTA({ memberCount }: SecondaryCTAProps) {
  const remainingCount = memberCount - avatarInitials.length;

  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        {/* Avatar Stack */}
        <div className="flex justify-center mb-8">
          <div className="flex -space-x-3">
            {avatarInitials.map((initial, idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-full bg-secondary/20 border-2 border-primary flex items-center justify-center text-primary-foreground font-semibold shadow-lg"
                style={{ zIndex: avatarInitials.length - idx }}
              >
                {initial}
              </div>
            ))}
            {remainingCount > 0 && (
              <div
                className="w-12 h-12 rounded-full bg-cta border-2 border-primary flex items-center justify-center text-cta-foreground font-semibold text-sm shadow-lg"
                style={{ zIndex: 0 }}
              >
                +{remainingCount > 999 ? "999+" : remainingCount}
              </div>
            )}
          </div>
        </div>

        {/* Eyebrow */}
        <p className="text-primary-foreground/70 mb-4">
          เข้าร่วมกับสมาชิกกว่า{" "}
          <span className="font-semibold text-cta">
            {memberCount.toLocaleString()}
          </span>{" "}
          คน
        </p>

        {/* Question Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          พร้อมที่จะเป็นส่วนหนึ่งในการเฝ้าระวังศัตรูข้าว
          <br />
          <span className="text-cta">หรือยัง?</span>
        </h2>

        {/* Subtext */}
        <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
          ลงทะเบียนฟรี ไม่มีค่าใช้จ่ายใดๆ
          <br />
          เริ่มรับการแจ้งเตือนศัตรูพืชได้ทันที
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-cta text-cta-foreground hover:bg-cta/90 rounded-full px-10 py-7 text-lg font-semibold shadow-xl shadow-orange-500/30 transition-all hover:-translate-y-1"
            >
              <span className="material-icons-outlined mr-2">person_add</span>
              เข้าร่วมเครือข่ายเลย
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-10 py-7 text-lg font-medium border-2 border-white/70 bg-white/10 text-white hover:bg-white/20 hover:border-white"
            >
              <span className="material-icons-outlined mr-2">visibility</span>
              ดูข้อมูลเพิ่มเติม
            </Button>
          </Link>
        </div>

        {/* Trust Text */}
        <p className="mt-8 text-sm text-primary-foreground/50">
          <span className="material-icons-outlined text-sm align-middle mr-1">
            verified
          </span>
          ข้อมูลของคุณปลอดภัย เราไม่แชร์ข้อมูลส่วนตัวกับบุคคลที่สาม
        </p>
      </div>
    </section>
  );
}
