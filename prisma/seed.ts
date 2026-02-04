import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('กำลังเริ่มทำการ Seed ข้อมูล 5 รายการ...')

  // ล้างข้อมูลเก่าออกก่อนเพื่อให้ข้อมูลไม่ซ้ำซ้อนเวลาสั่ง seed ใหม่
  await prisma.pestReport.deleteMany()

  const seedData = [
    {
      province: "ปทุมธานี",
      plantId: "P001",
      plant: "ข้าว",
      pestId: "INS001",
      pest: "เพลี้ยกระโดดสีน้ำตาล",
      symptomOnSet: new Date('2026-01-10'),
      filedAffectedArea: 15.0,
      incidencePercent: 30,
      severityPercent: 20,
      latitude: 14.0208,
      longitude: 100.7250,
      imageUrls: ["https://picsum.photos/seed/pest1/400/300"],
      imageTitles: ["พบกลุ่มเพลี้ยบริเวณโคนต้น"],
    },
    {
      province: "เชียงใหม่",
      plantId: "P002",
      plant: "ข้าวโพด",
      pestId: "INS002",
      pest: "หนอนกระทู้ข้าวโพดลายจุด",
      symptomOnSet: new Date('2026-01-15'),
      filedAffectedArea: 8.5,
      incidencePercent: 45,
      severityPercent: 35,
      latitude: 18.7883,
      longitude: 98.9853,
      imageUrls: ["https://picsum.photos/seed/pest2/400/300"],
      imageTitles: ["ใบข้าวโพดถูกทำลายเป็นรู"],
    },
    {
      province: "นครราชสีมา",
      plantId: "P003",
      plant: "มันสำปะหลัง",
      pestId: "INS003",
      pest: "เพลี้ยแป้งมันสำปะหลังสีชมพู",
      symptomOnSet: new Date('2026-01-20'),
      filedAffectedArea: 25.0,
      incidencePercent: 15,
      severityPercent: 10,
      latitude: 14.9738,
      longitude: 102.0836,
      imageUrls: [],
      imageTitles: [],
    },
    {
      province: "ขอนแก่น",
      plantId: "P001",
      plant: "ข้าว",
      pestId: "DIS001",
      pest: "โรคไหม้ข้าว",
      symptomOnSet: new Date('2026-01-25'),
      filedAffectedArea: 12.0,
      incidencePercent: 50,
      severityPercent: 40,
      latitude: 16.4322,
      longitude: 102.8236,
      imageUrls: ["https://picsum.photos/seed/pest4/400/300"],
      imageTitles: ["แผลรูปตาบนใบข้าว"],
    },
    {
      province: "ชลบุรี",
      plantId: "P004",
      plant: "อ้อย",
      pestId: "INS004",
      pest: "หนอนเจาะลำต้นอ้อย",
      symptomOnSet: new Date('2026-02-01'),
      filedAffectedArea: 20.0,
      incidencePercent: 10,
      severityPercent: 5,
      latitude: 13.3611,
      longitude: 100.9847,
      imageUrls: [],
      imageTitles: [],
    }
  ]

  for (const data of seedData) {
    await prisma.pestReport.create({ data })
  }

  console.log('Seed ข้อมูล 5 รายการสำเร็จแล้ว!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
