import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ข้อมูลปัญหาหลัก 3 ประการที่เกษตรกรต้องเผชิญ - ใช้เพื่อสร้างความเข้าใจและความเร่งด่วนในการแก้ปัญหา
const problems = [
  {
    icon: "warning",
    title: "ผลผลิตหายไป 30%",
    stat: "30%",
    description:
      "ศัตรูพืชทำลายผลผลิตข้าวเฉลี่ย 30% ต่อปี หากตรวจพบช้า ความเสียหายจะลุกลามจนควบคุมไม่ได้",
  },
  {
    icon: "trending_down",
    title: "ขาดข้อมูลเตือนภัย",
    stat: "80%",
    description:
      "เกษตรกรส่วนใหญ่ไม่มีช่องทางรับข้อมูลการระบาดในพื้นที่ใกล้เคียง ต้องเผชิญปัญหาคนเดียว",
  },
  {
    icon: "access_time",
    title: "ตอบสนองช้าเกินไป",
    stat: "48 ชม.",
    description:
      "กว่าจะรู้ว่ามีการระบาด ศัตรูพืชก็แพร่กระจายไปแล้ว การควบคุมต้องใช้สารเคมีมากขึ้น",
  },
];

// Component นี้ใช้กลยุทธ์ "Problem-Agitate-Solve" เพื่อ:
// 1. แสดงปัญหาที่เกษตรกรเผชิญ (Problem)
// 2. เน้นย้ำความรุนแรงและผลกระทบ (Agitate)
// 3. นำไปสู่การแนะนำโซลูชัน (เตรียมพร้อมสำหรับ Solution section)
export function ProblemAgitate() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ส่วนหัวข้อหลัก - แนะนำหัวข้อของ section นี้ */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            ปัญหาที่เกษตรกรต้องเผชิญ
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ทุกปี เกษตรกรต้องเผชิญกับความเสียหายจากศัตรูข้าว
            ที่สร้างความสูญเสียมูลค่าหลายพันล้านบาท
          </p>
        </div>

        {/* การ์ดแสดงปัญหา 3 ประการ - แต่ละการ์ดแสดงปัญหาพร้อมสถิติและคำอธิบาย */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {problems.map((problem, idx) => (
            <Card
              key={idx}
              className="group hover:-translate-y-2 transition-all duration-300 border-destructive/20 hover:border-destructive/40 hover:shadow-xl bg-card"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  {/* ไอคอนและตัวเลขสถิติ - เน้นความรุนแรงของปัญหาด้วยสีแดง */}
                  <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground transition-all duration-300">
                    <span className="material-icons-outlined text-2xl">
                      {problem.icon}
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-destructive/70">
                    {problem.stat}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-primary">
                  {problem.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ส่วน Agitation - เน้นย้ำสาเหตุแท้จริงของปัญหาและสร้างแรงจูงใจให้ดำเนินการ */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            ปัญหาไม่ได้อยู่ที่ศัตรูพืช แต่อยู่ที่{" "}
            <span className="font-semibold text-primary">
              การขาดระบบเตือนภัยและการสื่อสารที่มีประสิทธิภาพ
            </span>{" "}
            ระหว่างเกษตรกร ผู้เชี่ยวชาญ และหน่วยงานที่เกี่ยวข้อง
          </p>

          {/* ข้อความเชื่อมต่อ - เปลี่ยนจากปัญหาไปสู่โซลูชัน และสร้างความรู้สึกมีส่วนร่วม */}
          <div className="pt-6 border-t border-border">
            <p className="text-lg text-primary font-medium">
              เราเชื่อว่าทุกคนสามารถมีส่วนร่วมในการปกป้องพืชผลของชาติได้
            </p>
            <p className="text-muted-foreground mt-2">
              และนั่นคือเหตุผลที่เราสร้างเครือข่ายนี้ขึ้นมา
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
