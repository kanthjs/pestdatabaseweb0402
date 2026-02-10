import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { name: "หน้าหลัก", href: "/" },
  { name: "เกี่ยวกับเรา", href: "/about" },
  { name: "ข้อมูลศัตรูพืช", href: "/dashboard" },
  { name: "รายงานศัตรูพืช", href: "/survey" },
  { name: "เข้าร่วมเครือข่าย", href: "/signup" },
];

const legalLinks = [
  { name: "นโยบายความเป็นส่วนตัว", href: "/privacy" },
  { name: "ข้อกำหนดการใช้งาน", href: "/terms" },
  { name: "คำชี้แจง", href: "/disclaimer" },
];

const contactInfo = [
  { icon: "email", text: "contact@ricepestnet.go.th" },
  { icon: "phone", text: "0-XXXX-XXXX" },
  { icon: "location_on", text: "กรุงเทพมหานคร, ประเทศไทย" },
];

export function LandingFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="RicePestNet Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl">
                RicePest<span className="text-cta">Net</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              เครือข่ายเฝ้าระวังภัยศัตรูข้าว
              ร่วมมือกันเพื่อความมั่นคงทางอาหารของชาติ
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">ลิงก์ด่วน</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-cta transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-6">กฎหมาย</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-cta transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6">ติดต่อเรา</h3>
            <ul className="space-y-3">
              {contactInfo.map((info, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm">
                  <span className="material-icons-outlined text-cta text-base">
                    {info.icon}
                  </span>
                  <span className="text-primary-foreground/70">{info.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © {new Date().getFullYear()} Rice Pest Survey Network. สงวนลิขสิทธิ์.
            </p>
            <p className="text-primary-foreground/50 text-sm">
              สร้างด้วยความมุ่งมั่นเพื่อความมั่นคงทางอาหารของประเทศไทย
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
