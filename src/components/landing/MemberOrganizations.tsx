import Link from "next/link";

// Placeholder organizations - can be replaced later
const organizations = [
  { name: "กรมการข้าว", initials: "RD" },
  { name: "กระทรวงเกษตรและสหกรณ์", initials: "MOAC" },
  { name: "สวทช.", initials: "NSTDA" },
  { name: "มหาวิทยาลัยเกษตรศาสตร์", initials: "KU" },
  { name: "มหาวิทยาลัยเชียงใหม่", initials: "CMU" },
  { name: "มหาวิทยาลัยขอนแก่น", initials: "KKU" },
];

export function MemberOrganizations() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            หน่วยงานสมาชิก
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            เครือข่ายของเราได้รับการสนับสนุนจากหน่วยงานชั้นนำทั้งภาครัฐและภาคการศึกษา
          </p>
        </div>

        <Link href="/signup" className="block">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {organizations.map((org, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center justify-center p-6 rounded-xl bg-muted/50 border border-border/50 hover:border-secondary/30 hover:bg-muted transition-all duration-300 cursor-pointer"
              >
                {/* Placeholder Logo */}
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/10 transition-colors">
                  <span className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors">
                    {org.initials}
                  </span>
                </div>
                <p className="text-sm text-center text-muted-foreground font-medium">
                  {org.name}
                </p>
              </div>
            ))}
          </div>
        </Link>

        <p className="text-center text-sm text-muted-foreground mt-8">
          และหน่วยงานพันธมิตรอื่นๆ อีกมากมาย
        </p>
      </div>
    </section>
  );
}
