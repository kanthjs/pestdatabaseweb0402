import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface SocialProofProps {
  memberCount: number;
  organizationCount?: number;
}

const testimonials = [
  {
    quote:
      "ได้รับการแจ้งเตือนล่วงหน้า 48 ชั่วโมง ก่อนที่ศัตรูพืชจะมาถึงแปลงของผม ช่วยลดความเสียหายได้เกือบทั้งหมด",
    name: "นายสมชาย",
    role: "เกษตรกร จ.พ",
    result: "ลดความเสียหาย 90%",
    initials: "?",
  },
  {
    quote:
      "ระบบรายงานใช้งานง่าย เกษตรกรในพื้นที่ส่งรายงานได้เอง ทำให้เราตอบสนองได้เร็วขึ้นมาก",
    name: "ดร.ก",
    role: "นักวิจัย กรมการข้าว",
    result: "ตอบสนองเร็วขึ้น 3 เท่า",
    initials: "?",
  },
  {
    quote:
      "ข้อมูลจากเครือข่ายช่วยให้เราวางแผนการควบคุมศัตรูพืชได้อย่างมีประสิทธิภาพทั้งจังหวัด",
    name: "นางสาวพิมพ์ใจ",
    role: "เจ้าหน้าที่",
    result: "ครอบคลุม 100% ของพื้นที่",
    initials: "?",
  },
];

const organizations = [
  {
    name: "กรมการข้าว",
    logo: "https://files.ricethailand.go.th/files/4/images/page_free_content/files-rice-1732779945401.png"
  },
];

export function SocialProof({
  memberCount,
  organizationCount = 25,
}: SocialProofProps) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
            ผลลัพธ์ที่พิสูจน์แล้ว
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            เกษตรกรและหน่วยงานที่เชื่อมั่นในเครือข่าย
          </h2>
          <p className="text-muted-foreground text-lg">
            กว่า{" "}
            <span className="font-semibold text-primary">
              {memberCount.toLocaleString()} สมาชิก
            </span>{" "}
            จาก{" "}
            <span className="font-semibold text-primary">
              {organizationCount} หน่วยงาน
            </span>
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, idx) => (
            <Card
              key={idx}
              className="group hover:-translate-y-2 transition-all duration-300 border-border/50 hover:border-secondary/30 hover:shadow-xl"
            >
              <CardContent className="pt-6">
                {/* Quote Icon */}
                <div className="text-secondary/30 mb-4">
                  <span className="material-icons-outlined text-4xl">
                    format_quote
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-muted-foreground leading-relaxed mb-6 min-h-[100px]">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Result Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cta/10 text-cta rounded-full text-sm font-semibold mb-6">
                  <span className="material-icons-outlined text-base">
                    trending_up
                  </span>
                  {testimonial.result}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-primary">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partner Organizations */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wider">
            หน่วยงานพันธมิตร
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {organizations.map((org, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center justify-center p-4 rounded-xl bg-card border border-border/50 hover:border-secondary/30 transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-lg bg-white flex items-center justify-center mb-2 p-2 group-hover:shadow-md transition-all">
                  <Image
                    src={org.logo}
                    alt={org.name}
                    width={80}
                    height={80}
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {org.name}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            และหน่วยงานพันธมิตรอื่นๆ อีกมากมาย
          </p>
        </div>
      </div>
    </section>
  );
}
