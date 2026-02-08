import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const valueProps = [
  {
    icon: "trending_up",
    title: "ผลกระทบทางเศรษฐกิจ",
    description:
      "ศัตรูพืชข้าวสามารถทำลายพืชผลได้มากกว่า 30% ของผลผลิตทั้งหมด การเฝ้าระวังที่มีประสิทธิภาพช่วยปกป้องรายได้ของเกษตรกรและความมั่นคงทางอาหาร",
  },
  {
    icon: "forest",
    title: "การปกป้องสิ่งแวดล้อม",
    description:
      "การตรวจจับและควบคุมศัตรูพืชในระยะเริ่มต้นช่วยลดการใช้สารเคมีกำจัดศัตรูพืช ลดผลกระทบต่อระบบนิเวศและสุขภาพของเกษตรกร",
  },
  {
    icon: "speed",
    title: "การตรวจจับและตอบสนองที่รวดเร็ว",
    description:
      "การรายงานที่รวดเร็วช่วยให้หน่วยงานที่เกี่ยวข้องสามารถดำเนินการควบคุมการระบาดได้ทันท่วงที ป้องกันความเสียหายที่อาจขยายวงกว้าง",
  },
];

export function ValueProposition() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            ทำไมการเฝ้าระวังศัตรูพืชจึงสำคัญ
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            การเฝ้าระวังที่มีประสิทธิภาพเป็นปัจจัยสำคัญในการปกป้องพืชผลและความมั่นคงทางอาหาร
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueProps.map((prop, idx) => (
            <Card
              key={idx}
              className="group hover:-translate-y-2 transition-all duration-300 border-border/50 hover:border-secondary/30 hover:shadow-xl"
            >
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                  <span className="material-icons-outlined text-2xl">
                    {prop.icon}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-primary">
                  {prop.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {prop.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
