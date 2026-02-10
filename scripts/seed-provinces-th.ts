/**
 * Seed script to populate provinceNameTh for all Thai provinces
 * Run with: npx tsx scripts/seed-provinces-th.ts
 */

import { prisma } from "../src/lib/prisma";

const provinceNamesTh: Record<string, string> = {
    "Bangkok": "กรุงเทพมหานคร",
    "Amnat Charoen": "อำนาจเจริญ",
    "Ang Thong": "อ่างทอง",
    "Bueng Kan": "บึงกาฬ",
    "Buri Ram": "บุรีรัมย์",
    "Chachoengsao": "ฉะเชิงเทรา",
    "Chai Nat": "ชัยนาท",
    "Chaiyaphum": "ชัยภูมิ",
    "Chanthaburi": "จันทบุรี",
    "Chiang Mai": "เชียงใหม่",
    "Chiang Rai": "เชียงราย",
    "Chon Buri": "ชลบุรี",
    "Chumphon": "ชุมพร",
    "Kalasin": "กาฬสินธุ์",
    "Kamphaeng Phet": "กำแพงเพชร",
    "Kanchanaburi": "กาญจนบุรี",
    "Khon Kaen": "ขอนแก่น",
    "Krabi": "กระบี่",
    "Lampang": "ลำปาง",
    "Lamphun": "ลำพูน",
    "Loei": "เลย",
    "Lop Buri": "ลพบุรี",
    "Mae Hong Son": "แม่ฮ่องสอน",
    "Maha Sarakham": "มหาสารคาม",
    "Mukdahan": "มุกดาหาร",
    "Nakhon Nayok": "นครนายก",
    "Nakhon Pathom": "นครปฐม",
    "Nakhon Phanom": "นครพนม",
    "Nakhon Ratchasima": "นครราชสีมา",
    "Nakhon Sawan": "นครสวรรค์",
    "Nakhon Si Thammarat": "นครศรีธรรมราช",
    "Nan": "น่าน",
    "Narathiwat": "นราธิวาส",
    "Nong Bua Lam Phu": "หนองบัวลำภู",
    "Nong Khai": "หนองคาย",
    "Nonthaburi": "นนทบุรี",
    "Pathum Thani": "ปทุมธานี",
    "Pattani": "ปัตตานี",
    "Phangnga": "พังงา",
    "Phatthalung": "พัทลุง",
    "Phayao": "พะเยา",
    "Phetchabun": "เพชรบูรณ์",
    "Phetchaburi": "เพชรบุรี",
    "Phichit": "พิจิตร",
    "Phitsanulok": "พิษณุโลก",
    "Phra Nakhon Si Ayutthaya": "พระนครศรีอยุธยา",
    "Phrae": "แพร่",
    "Phuket": "ภูเก็ต",
    "Prachin Buri": "ปราจีนบุรี",
    "Prachuap Khiri Khan": "ประจวบคีรีขันธ์",
    "Ranong": "ระนอง",
    "Ratchaburi": "ราชบุรี",
    "Rayong": "ระยอง",
    "Roi Et": "ร้อยเอ็ด",
    "Sa Kaeo": "สระแก้ว",
    "Sakon Nakhon": "สกลนคร",
    "Samut Prakan": "สมุทรปราการ",
    "Samut Sakhon": "สมุทรสาคร",
    "Samut Songkhram": "สมุทรสงคราม",
    "Saraburi": "สระบุรี",
    "Satun": "สตูล",
    "Sing Buri": "สิงห์บุรี",
    "Sisaket": "ศรีสะเกษ",
    "Songkhla": "สงขลา",
    "Sukhothai": "สุโขทัย",
    "Suphan Buri": "สุพรรณบุรี",
    "Surat Thani": "สุราษฎร์ธานี",
    "Surin": "สุรินทร์",
    "Tak": "ตาก",
    "Trang": "ตรัง",
    "Trat": "ตราด",
    "Ubon Ratchathani": "อุบลราชธานี",
    "Udon Thani": "อุดรธานี",
    "Uthai Thani": "อุทัยธานี",
    "Uttaradit": "อุตรดิตถ์",
    "Yala": "ยะลา",
    "Yasothon": "ยโสธร",
};

async function seedProvincesTh() {
    console.log("🌱 Seeding province names in Thai...\n");

    const provinces = await prisma.province.findMany();
    let updated = 0;
    let notFound: string[] = [];

    for (const province of provinces) {
        const thaiName = provinceNamesTh[province.provinceNameEn];
        
        if (thaiName) {
            await prisma.province.update({
                where: { provinceId: province.provinceId },
                data: { provinceNameTh: thaiName },
            });
            console.log(`  ✓ ${province.provinceNameEn} → ${thaiName}`);
            updated++;
        } else {
            notFound.push(province.provinceNameEn);
        }
    }

    console.log(`\n✅ Updated ${updated} provinces`);
    
    if (notFound.length > 0) {
        console.log(`\n⚠️  ${notFound.length} provinces not found in mapping:`);
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
