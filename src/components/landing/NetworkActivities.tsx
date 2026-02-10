import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CTABanner } from "./CTABanner";

const activities = [
  {
    icon: "monitoring",
    title: "การเฝ้าระวัง",
    description:
      "ติดตามและบันทึกข้อมูลการพบศัตรูพืชในพื้นที่ต่างๆ ทั่วประเทศแบบ real-time พร้อมระบบ GPS",
  },
  {
    icon: "assignment",
    title: "การรายงาน",
    description:
      "รายงานการพบศัตรูพืชผ่านแอปพลิเคชันที่ใช้งานง่าย พร้อมอัปโหลดรูปภาพและข้อมูลประกอบ",
  },
  {
    icon: "school",
    title: "การอบรมและร่วมมือ",
    description:
      "เข้าร่วมการอบรมและสัมมนาออนไลน์ เพื่อพัฒนาความรู้และทักษะในการจำแนกศัตรูพืช",
  },
];

export function NetworkActivities() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            กิจกรรมของเครือข่าย
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            เครือข่ายของเราดำเนินการหลากหลายกิจกรรมเพื่อสนับสนุนการเฝ้าระวังศัตรูพืชอย่างมีประสิทธิภาพ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {activities.map((activity, idx) => (
            <Card
              key={idx}
              className="group hover:-translate-y-2 transition-all duration-300 border-border/50 hover:border-secondary/30 hover:shadow-xl"
            >
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                  <span className="material-icons-outlined text-2xl">
                    {activity.icon}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-primary">
                  {activity.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <CTABanner
          title="พร้อมที่จะเข้าร่วมกับเราหรือยัง"
          description="มาเป็นส่วนหนึ่งของเครือข่ายเฝ้าระวังศัตรูข้าว"
          buttonText="เข้าร่วมเครือข่าย"
          href="/signup"
        />
      </div>
    </section>
  );
}
