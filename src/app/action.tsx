// src/app/actions.ts
"use server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function createPestReport(formData: any) {
  try {
    const report = await prisma.pestReport.create({
      data: {
        province: formData.province,
        plant: formData.plant,
        plantId: formData.plantId,
        pest: formData.pest,
        pestId: formData.pestId,
        symptomOnSet: new Date(formData.symptomOnSet), // แปลงวันที่
        filedAffectedArea: parseFloat(formData.filedAffectedArea),
        incidencePercent: parseFloat(formData.incidencePercent),
        severityPercent: parseFloat(formData.severityPercent),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        imageUrls: [], // พักไว้ก่อนค่อยทำระบบ Upload
        imageTitles: [],
      },
    })
    return { success: true, data: report }
  } catch (error) {
    console.error(error)
    return { success: false, error: "บันทึกข้อมูลไม่สำเร็จ" }
  }
}
