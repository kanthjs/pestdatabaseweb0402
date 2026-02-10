"use client";

import { useState, useTransition } from "react";
import { updateProfile, requestExpertStatus, UserProfileData } from "./actions";
import { createClient } from "@/lib/supabase/client";

const occupationRoles = [
    { reporterId: "OCC001", labelTH: "เกษตรกร", labelEN: "Farmer" },
    { reporterId: "OCC002", labelTH: "อาสาสมัครเกษตร", labelEN: "Agriculture Volunteer" },
    { reporterId: "OCC003", labelTH: "เจ้าหน้าที่ส่งเสริมการเกษตร", labelEN: "Agricultural Extension Officer" },
    { reporterId: "OCC004", labelTH: "เจ้าหน้าที่ศูนย์วิจัยข้าว", labelEN: "Rice Research Center Staff" },
    { reporterId: "OCC005", labelTH: "เจ้าหน้าที่ราชการ", labelEN: "Government Officials" },
    { reporterId: "OCC006", labelTH: "ผู้นำชุมชน", labelEN: "Community Leader" },
    { reporterId: "OCC007", labelTH: "อาจารย์มหาวิทยาลัย", labelEN: "University Researcher" },
    { reporterId: "OCC008", labelTH: "นักศึกษา", labelEN: "Student" },
    { reporterId: "OCC009", labelTH: "ไม่ระบุ", labelEN: "Not Specified" },
];

interface ProfileFormClientProps {
    initialData: UserProfileData;
}

const thaiProvinces = [
    "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร",
    "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท",
    "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง",
    "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม",
    "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส",
    "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์",
    "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พังงา", "พัทลุง",
    "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่",
    "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร",
    "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี",
    "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ",
    "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสงคราม",
    "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย",
    "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", "หนองบัวลำภู",
    "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี",
    "อุบลราชธานี"
];

export default function ProfileFormClient({ initialData }: ProfileFormClientProps) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [expertProofFile, setExpertProofFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        phone: initialData.phone || "",
        occupationRoles: initialData.occupationRoles || "",
        address: initialData.address || "",
        province: initialData.province || "",
        district: initialData.district || "",
        subDistrict: initialData.subDistrict || "",
        zipCode: initialData.zipCode || "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formDataObj = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await updateProfile(formDataObj);
            setMessage({
                type: result.success ? "success" : "error",
                text: result.message,
            });
            setTimeout(() => setMessage(null), 3000);
        });
    };

    const handleExpertRequest = async () => {
        if (!expertProofFile) {
            setMessage({ type: "error", text: "กรุณาแนบรูปถ่ายบัตรเจ้าหน้าที่หรือหลักฐาน / Please upload proof of identity" });
            return;
        }

        startTransition(async () => {
            try {
                // Upload to Supabase
                const supabase = createClient();
                const fileExt = expertProofFile.name.split('.').pop();
                const fileName = `expert-proofs/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('pestPics')
                    .upload(fileName, expertProofFile);

                if (uploadError) {
                    console.error("Upload error:", uploadError);
                    setMessage({ type: "error", text: "การอัปโหลดรูปภาพล้มเหลว / Upload failed" });
                    return;
                }

                const { data } = supabase.storage
                    .from('pestPics')
                    .getPublicUrl(fileName);

                const result = await requestExpertStatus(data.publicUrl);
                setMessage({
                    type: result.success ? "success" : "error",
                    text: result.message,
                });

                if (result.success) {
                    setExpertProofFile(null); // Clear file on success
                }
            } catch (error) {
                console.error("Error:", error);
                setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการส่งคำขอ / Submission failed" });
            }
            setTimeout(() => setMessage(null), 3000);
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Message Toast */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg ${message.type === "success" ? "bg-green-500" : "bg-destructive"
                    } text-white font-medium animate-in slide-in-from-top-2`}>
                    {message.text}
                </div>
            )}

            {/* Personal Information */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-display font-bold text-primary mb-6 flex items-center gap-2">
                    <span className="material-icons-outlined">person</span>
                    ข้อมูลส่วนตัว
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                            ชื่อ <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            placeholder="กรอกชื่อ"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                            นามสกุล <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            placeholder="กรอกนามสกุล"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                            เบอร์โทรศัพท์
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            placeholder="08X-XXX-XXXX"
                        />
                    </div>
                    <div>
                        <label htmlFor="occupationRoles" className="block text-sm font-medium text-foreground mb-2">
                            อาชีพ / บทบาท
                        </label>
                        <select
                            id="occupationRoles"
                            name="occupationRoles"
                            value={formData.occupationRoles}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        >
                            <option value="">เลือกอาชีพ</option>
                            {occupationRoles.map((role) => (
                                <option key={role.reporterId} value={role.reporterId}>
                                    {role.labelTH} ({role.labelEN})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Address Information */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-display font-bold text-primary mb-6 flex items-center gap-2">
                    <span className="material-icons-outlined">location_on</span>
                    ที่อยู่
                </h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                            ที่อยู่ (บ้านเลขที่ / ถนน / ซอย)
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                            placeholder="กรอกที่อยู่"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="province" className="block text-sm font-medium text-foreground mb-2">
                                จังหวัด
                            </label>
                            <select
                                id="province"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            >
                                <option value="">เลือกจังหวัด</option>
                                {thaiProvinces.map((prov) => (
                                    <option key={prov} value={prov}>
                                        {prov}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="district" className="block text-sm font-medium text-foreground mb-2">
                                อำเภอ / เขต
                            </label>
                            <input
                                type="text"
                                id="district"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                placeholder="กรอกอำเภอ / เขต"
                            />
                        </div>
                        <div>
                            <label htmlFor="subDistrict" className="block text-sm font-medium text-foreground mb-2">
                                ตำบล / แขวง
                            </label>
                            <input
                                type="text"
                                id="subDistrict"
                                name="subDistrict"
                                value={formData.subDistrict}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                placeholder="กรอกตำบล / แขวง"
                            />
                        </div>
                        <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-foreground mb-2">
                                รหัสไปรษณีย์
                            </label>
                            <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                maxLength={5}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                placeholder="XXXXX"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Status */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-display font-bold text-primary mb-6 flex items-center gap-2">
                    <span className="material-icons-outlined">verified_user</span>
                    สถานะบัญชี
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div>
                            <p className="font-medium text-foreground">อีเมล</p>
                            <p className="text-sm text-muted-foreground">{initialData.email}</p>
                        </div>
                        <span className="material-icons-outlined text-green-500">check_circle</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div>
                            <p className="font-medium text-foreground">บทบาทในระบบ</p>
                            <p className="text-sm text-muted-foreground">
                                {initialData.role === "ADMIN" ? "ผู้ดูแลระบบ" :
                                    initialData.role === "EXPERT" ? "ผู้เชี่ยวชาญ" : "ผู้ใช้ทั่วไป"}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${initialData.role === "ADMIN" ? "bg-purple-500/20 text-purple-500" :
                            initialData.role === "EXPERT" ? "bg-blue-500/20 text-blue-500" :
                                "bg-muted text-muted-foreground"
                            }`}>
                            {initialData.role}
                        </span>
                    </div>

                    {/* Expert Request Section */}
                    {initialData.role === "USER" && (
                        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-500/20 p-2 rounded-lg">
                                    <span className="material-icons-outlined text-blue-500">school</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-foreground">ขอสถานะผู้เชี่ยวชาญ</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        ยื่นขอสถานะผู้เชี่ยวชาญเพื่อเข้าถึงระบบตรวจสอบรายงาน
                                    </p>
                                    {initialData.expertRequest === "PENDING" ? (
                                        <p className="mt-3 text-sm text-amber-500 flex items-center gap-1">
                                            <span className="material-icons-outlined text-base">schedule</span>
                                            รอการอนุมัติ
                                        </p>
                                    ) : initialData.expertRequest === "APPROVED" ? (
                                        <p className="mt-3 text-sm text-green-500 flex items-center gap-1">
                                            <span className="material-icons-outlined text-base">check_circle</span>
                                            ได้รับการอนุมัติแล้ว
                                        </p>
                                    ) : initialData.expertRequest === "REJECTED" ? (
                                        <div>
                                            <p className="mt-3 text-sm text-destructive flex items-center gap-1">
                                                <span className="material-icons-outlined text-base">cancel</span>
                                                คำขอถูกปฏิเสธ
                                            </p>

                                            <div className="mt-4 space-y-3">
                                                <div>
                                                    <label htmlFor="expertProofFileRejected" className="block text-sm font-medium text-foreground mb-1">
                                                        อัปโหลดหลักฐานใหม่ (บัตรเจ้าหน้าที่ / ใบรับรอง)
                                                    </label>
                                                    <input
                                                        id="expertProofFileRejected"
                                                        title="Upload new proof"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setExpertProofFile(e.target.files?.[0] || null)}
                                                        className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleExpertRequest}
                                                    disabled={isPending || !expertProofFile}
                                                    className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {isPending ? "กำลังส่ง..." : "ยื่นคำขอใหม่"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-4 space-y-3">
                                            <div>
                                                <label htmlFor="expertProofFileNew" className="block text-sm font-medium text-foreground mb-1">
                                                    หลักฐานยืนยันตัวตน (บัตรเจ้าหน้าที่ / ใบรับรอง)
                                                </label>
                                                <input
                                                    id="expertProofFileNew"
                                                    title="Upload proof"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setExpertProofFile(e.target.files?.[0] || null)}
                                                    className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    * กรุณาแนบรูปถ่ายบัตรประจำตัวเจ้าหน้าที่ หรือใบรับรองหน่วยงานเพื่อยืนยัน
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleExpertRequest}
                                                disabled={isPending || !expertProofFile}
                                                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {isPending ? (
                                                    <>
                                                        <span className="material-icons-outlined animate-spin text-sm">refresh</span>
                                                        กำลังส่ง...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-icons-outlined text-sm">send</span>
                                                        ยื่นคำขอ
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isPending ? (
                        <>
                            <span className="material-icons-outlined animate-spin">refresh</span>
                            กำลังบันทึก...
                        </>
                    ) : (
                        <>
                            <span className="material-icons-outlined">save</span>
                            บันทึกข้อมูล
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
