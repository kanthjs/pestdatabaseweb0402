import Image from "next/image";

const roles = [
  {
    icon: "share",
    title: "การแลกเปลี่ยนความรู้",
    description: "แพลตฟอร์มสำหรับการแบ่งปันข้อมูลและประสบการณ์ระหว่างสมาชิก",
  },
  {
    icon: "groups",
    title: "การร่วมมือกับผู้เชี่ยวชาญ",
    description: "เชื่อมโยงเกษตรกรกับนักวิชาการและผู้เชี่ยวชาญด้านการเกษตร",
  },
  {
    icon: "sync_alt",
    title: "การประสานงานการเฝ้าระวัง",
    description: "ระบบการรายงานและติดตามที่เป็นมาตรฐานเดียวกันทั่วประเทศ",
  },
];

export function NetworkRole() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Image */}
          <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-xl order-2 lg:order-1">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsFTNo1gJGqSi6iL3lMZUfIdag7qxOmev-BjWfiH9LwzM3UKa4uV4eIl2FUr3wuiYRCwj_RuROSiDIaMGDIU4nv6s14883dDchR1J6ubGZi8fliP69GGtgOkEVbTcKhxYp0kYcnTJy6Lf4sCiOLr_iXiYK1b7Wu8mUw0vKj7W8usXBSOxzr8gFqiz0wijRnilqrNkbUXzAb5J6ckRAQXeMuUm4BE4rGGm55Oqbf7Lag27D8m4f5jidpWbPfG0z9cttY982wKpTIhyd"
              alt="การทำงานร่วมกันในเครือข่าย"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
          </div>

          {/* Right Column - Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              บทบาทของเครือข่าย
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              เครือข่ายเฝ้าระวังภัยศัตรูข้าวแห่งประเทศไทยเป็นแพลตฟอร์มที่เชื่อมโยงเกษตรกร
              นักวิชาการ และหน่วยงานที่เกี่ยวข้อง
              เพื่อสร้างระบบการเฝ้าระวังที่มีประสิทธิภาพและครอบคลุมทั่วประเทศ
            </p>

            <div className="space-y-6">
              {roles.map((role, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                    <span className="material-icons-outlined text-xl">
                      {role.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-1">
                      {role.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {role.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
