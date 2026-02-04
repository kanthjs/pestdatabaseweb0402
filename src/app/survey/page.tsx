import { prisma } from "@/lib/prisma";
import SurveyFormClient from "./SurveyFormClient";

export default async function SurveyPage() {
    // ดึงข้อมูล Master Data ทั้งหมดจาก Database
    const [provinces, plants, pests] = await Promise.all([
        prisma.province.findMany({ orderBy: { provinceNameEn: "asc" } }),
        prisma.plant.findMany({ orderBy: { plantNameEn: "asc" } }),
        prisma.pest.findMany({ orderBy: { pestNameEn: "asc" } }),
    ]);

    // ส่งข้อมูลที่ดึงมาได้ไปยัง Client Component ผ่าน Props
    return (
        <SurveyFormClient
            provinces={provinces}
            plants={plants}
            pests={pests}
        />
    );
}
