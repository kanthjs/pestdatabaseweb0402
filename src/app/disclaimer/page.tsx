import { LandingFooter } from "@/components/landing/LandingFooter";
import Link from "next/link";

export const metadata = {
    title: "Disclaimer | RicePestNet",
    description: "Disclaimer for the Thai Rice Pest Monitoring Network",
};

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-primary py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                        คำชี้แจง
                    </h1>
                    <p className="text-xl text-primary-foreground/80 font-light">
                        Disclaimer
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
                        <div className="prose prose-green dark:prose-invert max-w-none space-y-8 text-foreground leading-relaxed">
                            <div className="space-y-6">
                                <p>
                                    เนื้อหาที่ปรากฏบนเว็บไซต์นี้จัดทำขึ้นเพื่อวัตถุประสงค์ในการให้ข้อมูลทั่วไปเท่านั้น โดยข้อมูลส่วนหนึ่งได้ถูกรวบรวมมาจากแหล่งข้อมูลภายนอกเครือข่ายติดตามและเฝ้าระวังศัตรูพืชข้าวไทย (TRPMN)
                                </p>
                                <p>
                                    แม้ว่าเครือข่าย TRPMN จะใช้ความระมัดระวังตามสมควรในการจัดเตรียมและเผยแพร่ข้อมูล แต่เครือข่ายไม่รับรองความถูกต้อง ความน่าเชื่อถือ ความครบถ้วน หรือความเป็นปัจจุบันของเนื้อหาใดๆ ที่ปรากฏบนเว็บไซต์ รวมถึงไม่รับประกันประโยชน์ในการนำไปใช้เพื่อวัตถุประสงค์เฉพาะเจาะจงใดๆ ภายใต้ขอบเขตสูงสุดที่กฎหมายอนุญาต เครือข่าย TRPMN จะไม่รับผิดชอบต่อความสูญเสีย ความเสียหาย ค่าใช้จ่าย หรือภาระใดๆ ที่เกิดขึ้นจากการที่บุคคลหนึ่งบุคคลใดนำข้อมูลบนเว็บไซต์นี้ไปใช้หรืออ้างอิง ผู้ใช้งานควรทำการประเมินและตรวจสอบความถูกต้องของข้อมูลด้วยตนเองก่อนนำไปตัดสินใจดำเนินการใดๆ
                                </p>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-border">
                                <p>
                                    การอ้างอิงถึงเว็บไซต์อื่นๆ จัดทำขึ้นเพื่อเป็นบริการข้อมูลเท่านั้น และไม่ถือเป็นการให้การรับรองเว็บไซต์เหล่านั้น ในทางกลับกัน การไม่ได้อ้างถึงเว็บไซต์ใดก็มิให้ตีความว่าเป็นการไม่รับรองเช่นกัน แม้เครือข่ายจะพยายามคัดเลือกกระบวนการเชื่อมโยงไปยังเว็บไซต์ที่เหมาะสม แต่เครือข่ายไม่รับประกันความเหมาะสม ความครบถ้วน หรือความถูกต้องของเนื้อหาที่พบผ่านลิงก์ภายนอกเหล่านั้น นอกจากนี้ เครือข่ายไม่รับประกันความพร้อมใช้งานของเว็บไซต์ต่างๆ ที่มีการระบุไว้
                                </p>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-border">
                                <p>
                                    แม้เครือข่ายจะพยายามอย่างเต็มที่แล้ว แต่เครือข่ายไม่รับประกันว่าข้อมูลภายในเว็บไซต์นี้จะปราศจากการติดไวรัสคอมพิวเตอร์หรือมัลแวร์อ่น ๆ 
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-border flex justify-center">
                            <Link
                                href="/"
                                className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                <span className="material-icons-outlined mr-2">arrow_back</span>
                                กลับสู่หน้าหลัก
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
