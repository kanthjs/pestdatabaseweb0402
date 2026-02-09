const benefitTiers = [
  {
    tier: "01",
    icon: "notifications_active",
    title: "ข้อมูลเตือนภัยแบบ Real-time",
    description:
      "รับการแจ้งเตือนเมื่อมีการรายงานศัตรูพืชในพื้นที่ใกล้เคียง ก่อนที่จะลุกลามมาถึงแปลงของคุณ",
    value: "ป้องกันความเสียหายก่อนเกิด",
  },
  {
    tier: "02",
    icon: "add_a_photo",
    title: "เครื่องมือรายงานที่ใช้งานง่าย",
    description:
      "รายงานการพบศัตรูพืชได้ใน 5 นาที พร้อม GPS และรูปภาพ ไม่ต้องมีความรู้เฉพาะทาง",
    value: "ช่วยเหลือเกษตรกรท่านอื่น",
  },
  {
    tier: "03",
    icon: "verified",
    title: "การตรวจสอบโดยผู้เชี่ยวชาญ",
    description:
      "ทุกรายงานจะได้รับการยืนยันจากผู้เชี่ยวชาญภายใน 24 ชั่วโมง พร้อมคำแนะนำในการจัดการ",
    value: "ข้อมูลที่เชื่อถือได้",
  },
  {
    tier: "04",
    icon: "school",
    title: "การเข้าถึงชุมชนและการอบรม",
    description:
      "ได้รับข้อมูลข่าวสารและแลกเปลี่ยนความรู้กับผู้เชี่ยวชาญและเกษตรกรท่านอื่น",
    value: "พัฒนาความรู้",
  },
];

export function ValueStack() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            สิ่งที่คุณจะได้รับ
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            เมื่อเข้าร่วมเครือข่ายเฝ้าระวังศัตรูพืชข้าวแห่งประเทศไทย
          </p>
        </div>

        {/* Benefit Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {benefitTiers.map((benefit, idx) => (
            <div
              key={idx}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-secondary/40 hover:shadow-lg transition-all duration-300"
            >
              {/* Tier Number */}
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                {benefit.tier}
              </div>

              <div className="flex gap-5">
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                  <span className="material-icons-outlined text-2xl">
                    {benefit.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {benefit.description}
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                    <span className="material-icons-outlined text-base">
                      check_circle
                    </span>
                    {benefit.value}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer - Free Message */}
        <div className="text-center py-8 px-6 rounded-2xl bg-gradient-to-r from-secondary/10 via-primary/5 to-secondary/10 border border-secondary/20">
          <p className="text-2xl md:text-3xl font-bold text-primary mb-2">
            ทั้งหมดนี้...{" "}
            <span className="text-cta">ไม่มีค่าใช้จ่าย</span>
          </p>
          <p className="text-muted-foreground">
            เพราะความมั่นคงทางอาหารเป็นเรื่องของทุกคน
          </p>
        </div>
      </div>
    </section>
  );
}
