import { LandingFooter } from "@/components/landing/LandingFooter";
import Link from "next/link";

export const metadata = {
    title: "Terms of Use | RicePestNet",
    description: "Terms of Use for the Thai Rice Pest Monitoring Network",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-primary py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                        ข้อกำหนดการใช้งาน
                    </h1>
                    <p className="text-xl text-primary-foreground/80 font-light">
                        Terms of Use
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
                        <p className="text-muted-foreground mb-8 italic">
                            ปรับปรุงล่าสุด: 10 กุมภาพันธ์ 2569
                        </p>

                        <div className="prose prose-green dark:prose-invert max-w-none space-y-8 text-foreground leading-relaxed">

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">1. การยอมรับเงื่อนไข</h2>
                                <p>
                                    การเข้าถึงและใช้งานเว็บไซต์และพอร์ทัลของเครือข่ายติดตามและเฝ้าระวังศัตรูพืชข้าวไทย (รวมเรียกว่า &quot;การบริการ&quot;) ถือว่าท่านยอมรับและตกลงที่จะผูกพันตามข้อกำหนดและเงื่อนไขของข้อตกลงฉบับนี้ หากท่านไม่ตกลงตามเงื่อนไขดังกล่าว โปรดงดเว้นการใช้งานการบริการนี้ เงื่อนไขการใช้งานเหล่านี้ (&quot;เงื่อนไข&quot;) ใช้บังคับกับการเข้าถึงและการใช้งานการบริการของท่าน รวมถึงเนื้อหา ฟังก์ชันการทำงาน และบริการต่างๆ ที่นำเสนอผ่านระบบ
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">2. การใช้งานการบริการ</h2>
                                <h3 className="text-xl font-semibold">2.1 การใช้งานที่อนุญาต</h3>
                                <p>
                                    ท่านสามารถใช้งานการบริการเพื่อวัตถุประสงค์ที่ชอบด้วยกฎหมายและเป็นไปตามเงื่อนไขเหล่านี้เท่านั้น โดยการบริการนี้มีวัตถุประสงค์เพื่ออำนวยความสะดวกในการติดตาม รายงาน และจัดการข้อมูลศัตรูพืชและโรคข้าวทั่วประเทศไทย
                                </p>

                                <h3 className="text-xl font-semibold">2.2 กิจกรรมที่ต้องห้าม</h3>
                                <p>ท่านตกลงที่จะไม่:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>ใช้งานการบริการในลักษณะใดก็ตามที่ละเมิดกฎหมายหรือกฎระเบียบระดับชาติหรือระหว่างประเทศ</li>
                                    <li>ส่งข้อมูลหรือรายงานที่เป็นเท็จ ทำให้เข้าใจผิด หรือไม่ถูกต้อง</li>
                                    <li>ปลอมตัวหรือพยายามปลอมตัวเป็นผู้ใช้งานบุคคล หรือหน่วยงานอื่น</li>
                                    <li>ดำเนินการใดๆ ที่ขัดขวางหรือจำกัดการใช้งานการบริการของผู้อื่น</li>
                                    <li>ใช้โรบอท สไปเดอร์ หรืออุปกรณ์อัตโนมัติ กระบวนการ หรือวิธีการใดๆ เพื่อเข้าถึงการบริการไม่ว่าเพื่อวัตถุประสงค์ใดก็ตาม</li>
                                    <li>นำไวรัส ม้าโทรจัน เวิร์ม ลอจิกบอมบ์ หรือเนื้อหาอื่นๆ ที่ประสงค์ร้ายหรือเป็นอันตรายทางเทคโนโลยีเข้าสู่ระบบ</li>
                                    <li>พยายามเข้าถึงโดยไม่ได้รับอนุญาต รบกวน สร้างความเสียหาย หรือขัดขวางส่วนใดส่วนหนึ่งของการบริการ</li>
                                </ul>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">3. บัญชีผู้ใช้งานและการลงทะเบียน</h2>
                                <h3 className="text-xl font-semibold">3.1 การสร้างบัญชี</h3>
                                <p>
                                    ในการเข้าถึงฟีเจอร์บางประการ ท่านอาจต้องลงทะเบียนบัญชี โดยท่านตกลงที่จะให้ข้อมูลที่ถูกต้อง เป็นปัจจุบัน และครบถ้วน และจะปรับปรุงข้อมูลดังกล่าวให้ถูกต้องอยู่เสมอ
                                </p>

                                <h3 className="text-xl font-semibold">3.2 ความปลอดภัยของบัญชี</h3>
                                <p>
                                    ท่านมีหน้าที่รับผิดชอบในการรักษาความลับของรหัสผ่านและกิจกรรมใดๆ ที่เกิดขึ้นภายใต้รหัสผ่านของท่าน เราแนะนำให้ท่านใช้รหัสผ่านที่ &quot;คาดเดายาก&quot; (ผสมตัวอักษรพิมพ์เล็ก-ใหญ่ ตัวเลข และสัญลักษณ์) และท่านต้องแจ้งให้เราทราบทันทีหากพบการละเมิดความปลอดภัยหรือการใช้งานบัญชีโดยไม่ได้รับอนุญาต
                                </p>

                                <h3 className="text-xl font-semibold">3.3 การยกเลิกบัญชี</h3>
                                <p>
                                    เราขอสงวนสิทธิ์ในการยกเลิกหรือระงับบัญชีและการเข้าถึงการบริการของท่านตามดุลยพินิจของเรา โดยไม่ต้องแจ้งให้ทราบล่วงหน้า หากพบพฤติกรรมที่ละเมิดเงื่อนไขเหล่านี้ หรือก่อให้เกิดอันตรายต่อผู้ใช้อื่น ต่อเรา หรือต่อบุคคลที่สาม
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">4. เนื้อหาของผู้ใช้งานและการส่งข้อมูล</h2>
                                <h3 className="text-xl font-semibold">4.1 ความรับผิดชอบต่อเนื้อหา</h3>
                                <p>
                                    ท่านเป็นผู้รับผิดชอบแต่เพียงผู้เดียวต่อข้อมูล รายงาน รูปภาพ หรือเนื้อหาอื่นๆ ที่ท่านส่งหรือแสดงผ่านการบริการ (&quot;เนื้อหาผู้ใช้งาน&quot;) โดยท่านรับรองว่า:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>ท่านเป็นเจ้าของหรือได้รับสิทธิ์และอนุญาตที่จำเป็นในการส่งเนื้อหาดังกล่าว</li>
                                    <li>เนื้อหาผู้ใช้งานมีความถูกต้องและเป็นจริงตามความรู้ความเข้าใจของท่าน</li>
                                    <li>เนื้อหาไม่ละเมิดสิทธิ์ของบุคคลที่สาม รวมถึงสิทธิ์ในทรัพย์สินทางปัญญา</li>
                                </ul>

                                <h3 className="text-xl font-semibold">4.2 การอนุญาตให้ใช้สิทธิ์ในเนื้อหา</h3>
                                <p>
                                    การส่งเนื้อหาผู้ใช้งานเข้าสู่ระบบ ถือว่าท่านอนุญาตให้เราใช้ ทำซ้ำ แก้ไข ปรับปรุง เผยแพร่ แปล และแสดงเนื้อหาดังกล่าวไปทั่วโลกโดยไม่มีค่าลิขสิทธิ์ เพื่อวัตถุประสงค์ในการดำเนินงาน ส่งเสริม และพัฒนาการบริการ รวมถึงเพื่อการวิจัยและประโยชน์ด้านสาธารณสุขที่เกี่ยวข้องกับการจัดการศัตรูพืชทางการเกษตร
                                </p>

                                <h3 className="text-xl font-semibold">4.3 ความถูกต้องของข้อมูล</h3>
                                <p>
                                    แม้เราจะพยายามตรวจสอบรายงานและข้อมูลที่ส่งเข้ามา แต่เราไม่รับประกันความถูกต้อง ครบถ้วน หรือความน่าเชื่อถือของเนื้อหาผู้ใช้งานใดๆ ผู้ใช้งานควรตรวจสอบข้อมูลอย่างเป็นอิสระก่อนตัดสินใจใดๆ โดยอ้างอิงจากข้อมูลในการบริการ
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">5. สิทธิ์ในทรัพย์สินทางปัญญา</h2>
                                <h3 className="text-xl font-semibold">5.1 เนื้อหาของการบริการ</h3>
                                <p>
                                    การบริการและเนื้อหาต้นฉบับ (ไม่รวมเนื้อหาผู้ใช้งาน) ฟีเจอร์ และฟังก์ชันการทำงาน เป็นทรัพย์สินของเครือข่าย TRPMN และผู้ให้สิทธิ์แต่เพียงผู้เดียว โดยได้รับความคุ้มครองตามกฎหมายลิขสิทธิ์ เครื่องหมายการค้า และกฎหมายอื่นๆ ห้ามใช้เครื่องหมายการค้าของเราโดยไม่ได้รับความยินยอมเป็นลายลักษณ์อักษร
                                </p>

                                <h3 className="text-xl font-semibold">5.2 การอนุญาตอย่างจำกัด</h3>
                                <p>
                                    เรามอบสิทธิ์อย่างจำกัดในการเข้าถึงและใช้งานการบริการเพื่อการใช้งานส่วนตัวหรือภายในองค์กรที่เกี่ยวข้องกับการติดตามศัตรูพืชและการจัดการทางการเกษตรเท่านั้น
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">6. ความเป็นส่วนตัวและการคุ้มครองข้อมูล</h2>
                                <p>
                                    การจัดเก็บและการใช้ข้อมูลส่วนบุคคลของท่านเป็นไปตามที่ระบุไว้ใน <Link href="/privacy" className="text-primary hover:text-primary/80 underline">นโยบายความเป็นส่วนตัว (Privacy Policy)</Link> ของเรา
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">7. การปฏิเสธการรับประกัน</h2>
                                <p>
                                    การบริการนี้จัดทำขึ้นตามสภาพที่เป็นอยู่ (&quot;AS IS&quot;) และตามที่มีอยู่ (&quot;AS AVAILABLE&quot;) โดยไม่มีการรับประกันใดๆ เครือข่าย TRPMN ไม่รับรองว่า:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>การบริการจะพร้อมใช้งานตลอดเวลาในทุกสถานที่ โดยไม่ขัดข้องหรือปลอดภัย</li>
                                    <li>ข้อบกพร่องหรือข้อผิดพลาดจะได้รับการแก้ไข</li>
                                    <li>การบริการปราศจากไวรัสหรือส่วนประกอบที่เป็นอันตราย (โปรดดูรายละเอียดเพิ่มเติมในหน้า <Link href="/disclaimer" className="text-primary hover:text-primary/80 underline">ข้อสงวนสิทธิ์ (Disclaimer)</Link>)</li>
                                </ul>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">8. การจำกัดความรับผิด</h2>
                                <p>
                                    ภายใต้ขอบเขตสูงสุดที่กฎหมายอนุญาต เครือข่าย TRPMN และผู้เกี่ยวข้องจะไม่รับผิดชอบต่อความเสียหายทางอ้อม ความเสียหายที่เกิดขึ้นโดยบังเอิญ หรือการสูญเสียผลกำไร ข้อมูล และผลประโยชน์ที่จับต้องไม่ได้อื่นๆ ที่เกิดจากการเข้าถึงหรือใช้งาน หรือการไม่สามารถเข้าถึงการบริการของท่าน
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">9. การชดใช้ค่าเสียหาย</h2>
                                <p>
                                    ท่านตกลงที่จะปกป้อง ชดใช้ค่าเสียหาย และทำให้เครือข่าย TRPMN พ้นจากการเรียกร้อง ความรับผิด ความเสียหาย หรือค่าใช้จ่ายใดๆ (รวมถึงค่าทนายความตามสมควร) ที่เกิดจากการที่ท่านละเมิดเงื่อนไขเหล่านี้หรือการใช้งานการบริการของท่าน
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">10. ลิงก์ไปยังเว็บไซต์อื่น</h2>
                                <p>
                                    การบริการอาจมีลิงก์ไปยังเว็บไซต์บุคคลที่สามซึ่งเราไม่ได้เป็นเจ้าของหรือควบคุม เราจะไม่รับผิดชอบต่อเนื้อหา นโยบายความเป็นส่วนตัว หรือแนวปฏิบัติของเว็บไซต์เหล่านั้น
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">11. การเปลี่ยนแปลงเงื่อนไข</h2>
                                <p>
                                    เราขอสงวนสิทธิ์ในการปรับปรุงหรือเปลี่ยนเงื่อนไขเหล่านี้ได้ตลอดเวลา หากมีการเปลี่ยนแปลงที่เป็นสาระสำคัญ เราจะพยายามแจ้งให้ทราบล่วงหน้าอย่างน้อย 30 วันก่อนเงื่อนไขใหม่จะมีผลบังคับใช้
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">12. กฎหมายที่ใช้บังคับและเขตอำนาจศาล</h2>
                                <p>
                                    เงื่อนไขเหล่านี้ให้ใช้บังคับและตีความตามกฎหมายของ ราชอาณาจักรไทย ข้อพิพาทใดๆ ที่เกิดขึ้นจะอยู่ภายใต้เขตอำนาจศาลของศาลไทยแต่เพียงผู้เดียว
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">13. การแยกส่วนของข้อตกลง</h2>
                                <p>
                                    หากข้อกำหนดใดในเงื่อนไขเหล่านี้ถือเป็นโมฆะหรือไม่สามารถบังคับใช้ได้ ให้ถือว่าข้อกำหนดที่เหลือยังคงมีผลสมบูรณ์และบังคับใช้ได้ต่อไป
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">14. ข้อมูลการติดต่อ (Contact Information)</h2>
                                <p>
                                    หากท่านมีคำถามเกี่ยวกับเงื่อนไขเหล่านี้ โปรดติดต่อเราที่:
                                </p>
                                <div className="bg-muted/30 p-6 rounded-lg border border-border">
                                    <p className="mb-2">
                                        <strong>ระบบเครือข่ายเฝ้าระวังภัยศัตรูข้าว (TRPMN)</strong>
                                    </p>
                                    <p className="mb-2">
                                        อีเมล: contact@ricepestnet.go.th
                                    </p>
                                    <p>
                                        โทรศัพท์: 0-XXXX-XXXX
                                    </p>
                                </div>
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
