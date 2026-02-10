import { LandingFooter } from "@/components/landing/LandingFooter";
import Link from "next/link";

export const metadata = {
    title: "เกี่ยวกับเรา | TRPMN",
    description: "ทำความรู้จักกับเครือข่ายเฝ้าระวังภัยศัตรูข้าว (TRPMN)",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative bg-primary py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
                        เกี่ยวกับเรา
                    </h1>
                    <p className="text-xl md:text-2xl text-primary-foreground/90 font-light max-w-2xl mx-auto leading-relaxed mb-4">
                        เครือข่ายเฝ้าระวังภัยศัตรูข้าว
                    </p>
                    <p className="text-lg md:text-xl text-primary-foreground/80 font-medium">
                        (Thai Rice Pest Monitoring Network - TRPMN)
                    </p>
                    <div className="mt-8 inline-block px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <p className="text-white font-medium italic">
                            &quot;เพราะข้อมูลในมือคุณ คือพลังในการปกป้องนาข้าวไทย&quot;
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto space-y-24">

                    {/* Origin */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                                <span className="material-icons-outlined">history_edu</span>
                                จุดเริ่มต้นและความเป็นมา
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                เครือข่าย Thai Rice Pest Monitoring Network (TRPMN) มีจุดกำเนิดมาจากงานวิจัยเชิงลึกด้านการติดตามการเปลี่ยนแปลงการระบาดของศัตรูข้าวในแปลงนาเกษตร
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                จากการศึกษาเราพบความจริงที่สำคัญว่า การสร้างฐานข้อมูลการระบาดของศัตรูข้าวให้ครอบคลุมทั่วประเทศนั้น <span className="text-primary font-semibold">&quot;ลำพังเพียงหน่วยงานภาครัฐเพียงหน่วยงานเดียวอาจไม่เพียงพอ&quot;</span> ทั้งในแง่ของความต่อเนื่องของข้อมูล และความครอบคลุมของพื้นที่ที่มีอยู่อย่างมหาศาล
                            </p>
                        </div>
                        <div className="bg-muted rounded-3xl p-8 aspect-video flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                            <span className="material-icons-outlined text-9xl text-primary/20">analytics</span>
                        </div>
                    </div>

                    {/* Why Network */}
                    <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                        <div className="md:order-2 space-y-6">
                            <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                                <span className="material-icons-outlined">hub</span>
                                ทำไมเราถึงต้องมีเครือข่ายนี้?
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                ปัญหาการระบาดของศัตรูข้าวเกิดขึ้นตลอดเวลาและเปลี่ยนแปลงอย่างรวดเร็ว เราจึงได้คิดค้นและพัฒนาเทคโนโลยีที่เป็น <span className="font-bold">&quot;ศูนย์กลางการรวบรวมข้อมูล&quot;</span> และเป็น <span className="font-bold">&quot;กระบอกเสียงในการแจ้งเตือน&quot;</span>
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                โดยเน้นการมีส่วนร่วมของสมาชิกในเครือข่าย ไม่ว่าจะเป็นเกษตรกรในพื้นที่ หรือเจ้าหน้าที่จากภาคส่วนต่างๆ ที่ร่วมแรงร่วมใจกันแลกเปลี่ยนข้อมูลสถานการณ์จริงจากแปลงนา
                            </p>
                        </div>
                        <div className="md:order-1 bg-muted rounded-3xl p-8 aspect-video flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                            <span className="material-icons-outlined text-9xl text-primary/20">groups</span>
                        </div>
                    </div>

                    {/* Trust */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                                <span className="material-icons-outlined">verified_user</span>
                                ความเชื่อถือได้คือหัวใจหลัก
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                เพื่อให้ข้อมูลที่ได้รับจากท้องนามีความแม่นยำและนำไปใช้งานได้จริง TRPMN จึงสร้างความร่วมมือกับ <span className="font-bold">&quot;นักวิชาการและผู้เชี่ยวชาญ&quot;</span> ที่มีความรู้ความชำนาญเฉพาะด้านในการวิเคราะห์รายงานข้อมูลศัตรูข้าว
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                เพื่อตรวจสอบและยืนยันความถูกต้องให้ได้มากที่สุด ก่อนที่จะส่งต่อความรู้และการแจ้งเตือนกลับไปยังสมาชิกในเครือข่าย
                            </p>
                        </div>
                        <div className="bg-muted rounded-3xl p-8 aspect-video flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                            <span className="material-icons-outlined text-9xl text-primary/20">psychology</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Objectives */}
            <section className="py-24 bg-muted/30 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">วัตถุประสงค์หลักของเรา</h2>
                        <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: "link",
                                title: "เป็นศูนย์กลางการเชื่อมโยง",
                                desc: "สร้างเครือข่ายความร่วมมือระหว่างเกษตรกร เจ้าหน้าที่ และนักวิชาการ"
                            },
                            {
                                icon: "storage",
                                title: "สร้างฐานข้อมูลที่ยั่งยืน",
                                desc: "เก็บรวบรวมข้อมูลการระบาดอย่างต่อเนื่องและครอบคลุมทั่วประเทศด้วยเทคโนโลยีสมัยใหม่"
                            },
                            {
                                icon: "campaign",
                                title: "แจ้งเตือนภัยศัตรูข้าว",
                                desc: "เป็นช่องทางหลักในการกระจายข่าวสารการระบาด เพื่อให้สมาชิกเตรียมรับมือได้ทันท่วงที"
                            },
                            {
                                icon: "fact_check",
                                title: "ยกระดับความถูกต้อง",
                                desc: "กลั่นกรองข้อมูลโดยผู้เชี่ยวชาญ เพื่อให้ทุกรายงานเป็นข้อมูลที่เชื่อถือได้และนำไปสู่วิธีการแก้ปัญหาที่ตรงจุด"
                            }
                        ].map((obj, i) => (
                            <div key={i} className="bg-card p-8 rounded-2xl border border-border shadow-sm flex gap-6 hover:translate-y-[-4px] transition-all">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                        <span className="material-icons-outlined text-3xl">{obj.icon}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">{obj.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{obj.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 text-center">
                        <div className="inline-block p-8 bg-primary/5 rounded-3xl border border-primary/10 max-w-2xl">
                            <p className="text-xl font-medium text-primary leading-relaxed italic">
                                &quot;TRPMN จึงไม่ใช่แค่ระบบคอมพิวเตอร์ แต่คือเครือข่ายของ &apos;กลุ่มคน&apos; ที่ร่วมด้วยช่วยกันดูแลและปกป้องผลผลิตข้าวไทยให้ยั่งยืน&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto bg-primary rounded-[2.5rem] p-12 text-center text-primary-foreground relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold">ร่วมเป็นส่วนหนึ่งของเครือข่าย</h2>
                        <p className="text-lg opacity-90 max-w-xl mx-auto">
                            ช่วยพวกเราสร้างฐานข้อมูลศัตรูข้าวที่แข็งแกร่งที่สุด เพื่อปกป้องผลผลิตของพี่น้องเกษตรกรไทย
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/survey"
                                className="bg-white text-primary px-10 py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-xl hover:scale-105"
                            >
                                เริ่มรายงานศัตรูข้าว
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-primary-foreground/10 border border-primary-foreground/20 text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-foreground/20 transition-all backdrop-blur-sm hover:scale-105"
                            >
                                สมัครสมาชิกเครือข่าย
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
