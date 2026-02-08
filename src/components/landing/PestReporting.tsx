import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: "search",
    title: "สังเกตและจำแนก",
    description: "สังเกตลักษณะของศัตรูพืชที่พบและพยายามจำแนกชนิด",
  },
  {
    number: "02",
    icon: "photo_camera",
    title: "ถ่ายภาพ",
    description: "ถ่ายภาพศัตรูพืชและความเสียหายที่เกิดขึ้นให้ชัดเจน",
  },
  {
    number: "03",
    icon: "send",
    title: "ส่งรายงาน",
    description: "กรอกข้อมูลและส่งรายงานผ่านแอปพลิเคชันหรือเว็บไซต์",
  },
  {
    number: "04",
    icon: "verified",
    title: "รอการตรวจสอบ",
    description: "ผู้เชี่ยวชาญจะตรวจสอบและยืนยันข้อมูลที่ส่งมา",
  },
];

export function PestReporting() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              วิธีการเฝ้าระวังและรายงานศัตรูพืช
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              การรายงานศัตรูพืชที่รวดเร็วและถูกต้องเป็นหัวใจสำคัญในการควบคุมการระบาด
              ทุกการรายงานของคุณมีคุณค่าในการปกป้องพืชผลของประเทศ
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5">
                  <span className="material-icons-outlined text-sm text-secondary">
                    check
                  </span>
                </div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-primary">รายงานง่าย:</span>{" "}
                  ใช้เวลาไม่เกิน 5 นาทีต่อรายงาน
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5">
                  <span className="material-icons-outlined text-sm text-secondary">
                    check
                  </span>
                </div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-primary">ตรวจสอบโดยผู้เชี่ยวชาญ:</span>{" "}
                  ทุกรายงานจะได้รับการตรวจสอบความถูกต้อง
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5">
                  <span className="material-icons-outlined text-sm text-secondary">
                    check
                  </span>
                </div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-primary">มีส่วนร่วมในการปกป้องพืชผล:</span>{" "}
                  ข้อมูลของคุณช่วยเตือนภัยเกษตรกรท่านอื่น
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/survey">
                <Button
                  size="lg"
                  className="bg-cta text-cta-foreground hover:bg-cta/90 rounded-full px-8"
                >
                  <span className="material-icons-outlined mr-2">add_a_photo</span>
                  รายงานศัตรูพืช
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 border-2"
                >
                  <span className="material-icons-outlined mr-2">person_add</span>
                  เข้าร่วมเครือข่าย
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-secondary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl font-bold text-muted/50 group-hover:text-secondary/30 transition-colors">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-secondary-foreground transition-all">
                    <span className="material-icons-outlined text-xl">
                      {step.icon}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
