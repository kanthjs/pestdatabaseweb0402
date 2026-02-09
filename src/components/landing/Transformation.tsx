const stages = [
  {
    timeframe: "ภายใน 24 ชั่วโมงแรก",
    title: "รับการแจ้งเตือนครั้งแรก",
    description:
      "หลังจากลงทะเบียน คุณจะเริ่มได้รับการแจ้งเตือนศัตรูพืชในพื้นที่ทันที",
    icon: "notification_add",
    highlight: "ทันที",
    color: "secondary",
  },
  {
    timeframe: "ภายใน 30 วัน",
    title: "มีส่วนร่วมในการเฝ้าระวัง",
    description:
      "ส่งรายงานครั้งแรก รับ feedback จากผู้เชี่ยวชาญ และเรียนรู้การจำแนกศัตรูพืช",
    icon: "trending_up",
    highlight: "5+ รายงาน",
    color: "primary",
  },
  {
    timeframe: "3-6 เดือน",
    title: "เป็นผู้เชี่ยวชาญในพื้นที่",
    description:
      "คุณจะกลายเป็นแหล่งข้อมูลสำคัญของชุมชน ช่วยเตือนภัยเกษตรกรข้างเคียง",
    icon: "star",
    highlight: "ได้รับการยอมรับ",
    color: "cta",
  },
  {
    timeframe: "1 ปีขึ้นไป",
    title: "ปกป้องพืชผลทั้งภูมิภาค",
    description:
      "ข้อมูลของคุณจะช่วยวางแผนการป้องกันศัตรูพืชในระดับจังหวัดและภูมิภาค",
    icon: "public",
    highlight: "ผลกระทบระดับชาติ",
    color: "primary",
  },
];

export function Transformation() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            เส้นทางสู่การเปลี่ยนแปลง
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ดูว่าการเข้าร่วมจะช่วยให้เครือข่ายเติบโตและสร้างผลกระทบได้อย่างไร
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-primary to-cta -translate-y-1/2 rounded-full" />

          {/* Stages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stages.map((stage, idx) => (
              <div key={idx} className="relative group">
                {/* Connection Line - Mobile */}
                {idx < stages.length - 1 && (
                  <div className="md:hidden absolute left-7 top-20 bottom-0 w-0.5 bg-gradient-to-b from-secondary to-primary" />
                )}

                {/* Card */}
                <div className="relative bg-card border border-border/50 rounded-2xl p-6 hover:border-secondary/40 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-2">
                  {/* Step Number Circle */}
                  <div
                    className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                      stage.color === "secondary"
                        ? "bg-secondary text-secondary-foreground"
                        : stage.color === "cta"
                          ? "bg-cta text-cta-foreground"
                          : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 mx-auto group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                    <span className="material-icons-outlined text-2xl">
                      {stage.icon}
                    </span>
                  </div>

                  {/* Timeframe Badge */}
                  <div className="text-center mb-3">
                    <span className="inline-block px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                      {stage.timeframe}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-primary text-center mb-2">
                    {stage.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground text-center leading-relaxed mb-4">
                    {stage.description}
                  </p>

                  {/* Highlight Badge */}
                  <div className="text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                        stage.color === "secondary"
                          ? "bg-secondary/10 text-secondary"
                          : stage.color === "cta"
                            ? "bg-cta/10 text-cta"
                            : "bg-primary/10 text-primary"
                      }`}
                    >
                      <span className="material-icons-outlined text-base">
                        check_circle
                      </span>
                      {stage.highlight}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
