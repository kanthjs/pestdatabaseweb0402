/**
 * Seed script using SQL to populate provinceNameTh
 * Run with: npx tsx scripts/seed-provinces-sql.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates = [
    { en: "Bangkok", th: "กรุงเทพมหานคร" },
    { en: "Amnat Charoen", th: "อำนาจเจริญ" },
    { en: "Ang Thong", th: "อ่างทอง" },
    { en: "Bueng Kan", th: "บึงกาฬ" },
    { en: "Buri Ram", th: "บุรีรัมย์" },
    { en: "Chachoengsao", th: "ฉะเชิงเทรา" },
    { en: "Chai Nat", th: "ชัยนาท" },
    { en: "Chaiyaphum", th: "ชัยภูมิ" },
    { en: "Chanthaburi", th: "จันทบุรี" },
    { en: "Chiang Mai", th: "เชียงใหม่" },
    { en: "Chiang Rai", th: "เชียงราย" },
    { en: "Chon Buri", th: "ชลบุรี" },
    { en: "Chumphon", th: "ชุมพร" },
    { en: "Kalasin", th: "กาฬสินธุ์" },
    { en: "Kamphaeng Phet", th: "กำแพงเพชร" },
    { en: "Kanchanaburi", th: "กาญจนบุรี" },
    { en: "Khon Kaen", th: "ขอนแก่น" },
    { en: "Krabi", th: "กระบี่" },
    { en: "Lampang", th: "ลำปาง" },
    { en: "Lamphun", th: "ลำพูน" },
    { en: "Loei", th: "เลย" },
    { en: "Lop Buri", th: "ลพบุรี" },
    { en: "Mae Hong Son", th: "แม่ฮ่องสอน" },
    { en: "Maha Sarakham", th: "มหาสารคาม" },
    { en: "Mukdahan", th: "มุกดาหาร" },
    { en: "Nakhon Nayok", th: "นครนายก" },
    { en: "Nakhon Pathom", th: "นครปฐม" },
    { en: "Nakhon Phanom", th: "นครพนม" },
    { en: "Nakhon Ratchasima", th: "นครราชสีมา" },
    { en: "Nakhon Sawan", th: "นครสวรรค์" },
    { en: "Nakhon Si Thammarat", th: "นครศรีธรรมราช" },
    { en: "Nan", th: "น่าน" },
    { en: "Narathiwat", th: "นราธิวาส" },
    { en: "Nong Bua Lam Phu", th: "หนองบัวลำภู" },
    { en: "Nong Khai", th: "หนองคาย" },
    { en: "Nonthaburi", th: "นนทบุรี" },
    { en: "Pathum Thani", th: "ปทุมธานี" },
    { en: "Pattani", th: "ปัตตานี" },
    { en: "Phangnga", th: "พังงา" },
    { en: "Phatthalung", th: "พัทลุง" },
    { en: "Phayao", th: "พะเยา" },
    { en: "Phetchabun", th: "เพชรบูรณ์" },
    { en: "Phetchaburi", th: "เพชรบุรี" },
    { en: "Phichit", th: "พิจิตร" },
    { en: "Phitsanulok", th: "พิษณุโลก" },
    { en: "Phra Nakhon Si Ayutthaya", th: "พระนครศรีอยุธยา" },
    { en: "Phrae", th: "แพร่" },
    { en: "Phuket", th: "ภูเก็ต" },
    { en: "Prachin Buri", th: "ปราจีนบุรี" },
    { en: "Prachuap Khiri Khan", th: "ประจวบคีรีขันธ์" },
    { en: "Ranong", th: "ระนอง" },
    { en: "Ratchaburi", th: "ราชบุรี" },
    { en: "Rayong", th: "ระยอง" },
    { en: "Roi Et", th: "ร้อยเอ็ด" },
    { en: "Sa Kaeo", th: "สระแก้ว" },
    { en: "Sakon Nakhon", th: "สกลนคร" },
    { en: "Samut Prakan", th: "สมุทรปราการ" },
    { en: "Samut Sakhon", th: "สมุทรสาคร" },
    { en: "Samut Songkhram", th: "สมุทรสงคราม" },
    { en: "Saraburi", th: "สระบุรี" },
    { en: "Satun", th: "สตูล" },
    { en: "Sing Buri", th: "สิงห์บุรี" },
    { en: "Sisaket", th: "ศรีสะเกษ" },
    { en: "Songkhla", th: "สงขลา" },
    { en: "Sukhothai", th: "สุโขทัย" },
    { en: "Suphan Buri", th: "สุพรรณบุรี" },
    { en: "Surat Thani", th: "สุราษฎร์ธานี" },
    { en: "Surin", th: "สุรินทร์" },
    { en: "Tak", th: "ตาก" },
    { en: "Trang", th: "ตรัง" },
    { en: "Trat", th: "ตราด" },
    { en: "Ubon Ratchathani", th: "อุบลราชธานี" },
    { en: "Udon Thani", th: "อุดรธานี" },
    { en: "Uthai Thani", th: "อุทัยธานี" },
    { en: "Uttaradit", th: "อุตรดิตถ์" },
    { en: "Yala", th: "ยะลา" },
    { en: "Yasothon", th: "ยโสธร" },
];

async function seedProvincesTh() {
    console.log("🌱 Seeding province names in Thai...\n");

    let updated = 0;
    let notFound: string[] = [];

    for (const { en, th } of updates) {
        try {
            const result = await prisma.province.updateMany({
                where: { provinceNameEn: en },
                data: { provinceNameTh: th },
            });
            
            if (result.count > 0) {
                console.log(`  ✓ ${en} → ${th}`);
                updated++;
            } else {
                console.log(`  ⚠️ Not found: ${en}`);
                notFound.push(en);
            }
        } catch (error) {
            console.log(`  ❌ Error updating ${en}:`, error);
            notFound.push(en);
        }
    }

    console.log(`\n✅ Updated ${updated} provinces`);
    
    if (notFound.length > 0) {
        console.log(`\n⚠️  ${notFound.length} provinces not found or error:`);
        notFound.forEach(name => console.log(`    - ${name}`));
    }
}

seedProvincesTh()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
