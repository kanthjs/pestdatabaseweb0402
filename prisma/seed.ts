import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const provinces = [
  { id: 1, provinceNameTh: 'กรุงเทพมหานคร', provinceNameEn: 'Bangkok', region: 'กลาง', code: 'TH-10' },
  { id: 2, provinceNameTh: 'สมุทรปราการ', provinceNameEn: 'Samut Prakan', region: 'กลาง', code: 'TH-11' },
  { id: 3, provinceNameTh: 'นนทบุรี', provinceNameEn: 'Nonthaburi', region: 'กลาง', code: 'TH-12' },
  { id: 4, provinceNameTh: 'ปทุมธานี', provinceNameEn: 'Pathum Thani', region: 'กลาง', code: 'TH-13' },
  { id: 5, provinceNameTh: 'พระนครศรีอยุธยา', provinceNameEn: 'Phra Nakhon Si Ayutthaya', region: 'กลาง', code: 'TH-14' },
  { id: 6, provinceNameTh: 'อ่างทอง', provinceNameEn: 'Ang Thong', region: 'กลาง', code: 'TH-15' },
  { id: 7, provinceNameTh: 'ลพบุรี', provinceNameEn: 'Lop Buri', region: 'กลาง', code: 'TH-16' },
  { id: 8, provinceNameTh: 'สิงห์บุรี', provinceNameEn: 'Sing Buri', region: 'กลาง', code: 'TH-17' },
  { id: 9, provinceNameTh: 'ชัยนาท', provinceNameEn: 'Chai Nat', region: 'กลาง', code: 'TH-18' },
  { id: 10, provinceNameTh: 'สระบุรี', provinceNameEn: 'Saraburi', region: 'กลาง', code: 'TH-19' },
  { id: 11, provinceNameTh: 'ชลบุรี', provinceNameEn: 'Chon Buri', region: 'ตะวันออก', code: 'TH-20' },
  { id: 12, provinceNameTh: 'ระยอง', provinceNameEn: 'Rayong', region: 'ตะวันออก', code: 'TH-21' },
  { id: 13, provinceNameTh: 'จันทบุรี', provinceNameEn: 'Chanthaburi', region: 'ตะวันออก', code: 'TH-22' },
  { id: 14, provinceNameTh: 'ตราด', provinceNameEn: 'Trat', region: 'ตะวันออก', code: 'TH-23' },
  { id: 15, provinceNameTh: 'ฉะเชิงเทรา', provinceNameEn: 'Chachoengsao', region: 'ตะวันออก', code: 'TH-24' },
  { id: 16, provinceNameTh: 'ปราจีนบุรี', provinceNameEn: 'Prachin Buri', region: 'ตะวันออก', code: 'TH-25' },
  { id: 17, provinceNameTh: 'นครนายก', provinceNameEn: 'Nakhon Nayok', region: 'กลาง', code: 'TH-26' },
  { id: 18, provinceNameTh: 'สระแก้ว', provinceNameEn: 'Sa Kaeo', region: 'ตะวันออก', code: 'TH-27' },

  // ภาคกลางตอนบน / เหนือตอนล่าง
  { id: 19, provinceNameTh: 'นครสวรรค์', provinceNameEn: 'Nakhon Sawan', region: 'กลาง', code: 'TH-60' },
  { id: 20, provinceNameTh: 'อุทัยธานี', provinceNameEn: 'Uthai Thani', region: 'กลาง', code: 'TH-61' },
  { id: 21, provinceNameTh: 'กำแพงเพชร', provinceNameEn: 'Kamphaeng Phet', region: 'กลาง', code: 'TH-62' },
  { id: 22, provinceNameTh: 'ตาก', provinceNameEn: 'Tak', region: 'ตะวันตก', code: 'TH-63' },
  { id: 23, provinceNameTh: 'สุโขทัย', provinceNameEn: 'Sukhothai', region: 'เหนือ', code: 'TH-64' },
  { id: 24, provinceNameTh: 'พิษณุโลก', provinceNameEn: 'Phitsanulok', region: 'เหนือ', code: 'TH-65' },
  { id: 25, provinceNameTh: 'พิจิตร', provinceNameEn: 'Phichit', region: 'เหนือ', code: 'TH-66' },
  { id: 26, provinceNameTh: 'เพชรบูรณ์', provinceNameEn: 'Phetchabun', region: 'เหนือ', code: 'TH-67' },

  // ภาคตะวันตก / ภาคกลางตอนล่าง
  { id: 27, provinceNameTh: 'ราชบุรี', provinceNameEn: 'Ratchaburi', region: 'ตะวันตก', code: 'TH-70' },
  { id: 28, provinceNameTh: 'กาญจนบุรี', provinceNameEn: 'Kanchanaburi', region: 'ตะวันตก', code: 'TH-71' },
  { id: 29, provinceNameTh: 'สุพรรณบุรี', provinceNameEn: 'Suphan Buri', region: 'กลาง', code: 'TH-72' },
  { id: 30, provinceNameTh: 'นครปฐม', provinceNameEn: 'Nakhon Pathom', region: 'กลาง', code: 'TH-73' },
  { id: 31, provinceNameTh: 'สมุทรสาคร', provinceNameEn: 'Samut Sakhon', region: 'กลาง', code: 'TH-74' },
  { id: 32, provinceNameTh: 'สมุทรสงคราม', provinceNameEn: 'Samut Songkhram', region: 'กลาง', code: 'TH-75' },
  { id: 33, provinceNameTh: 'เพชรบุรี', provinceNameEn: 'Phetchaburi', region: 'ตะวันตก', code: 'TH-76' },
  { id: 34, provinceNameTh: 'ประจวบคีรีขันธ์', provinceNameEn: 'Prachuap Khiri Khan', region: 'ตะวันตก', code: 'TH-77' },

  // ภาคใต้
  { id: 35, provinceNameTh: 'นครศรีธรรมราช', provinceNameEn: 'Nakhon Si Thammarat', region: 'ใต้', code: 'TH-80' },
  { id: 36, provinceNameTh: 'กระบี่', provinceNameEn: 'Krabi', region: 'ใต้', code: 'TH-81' },
  { id: 37, provinceNameTh: 'พังงา', provinceNameEn: 'Phang Nga', region: 'ใต้', code: 'TH-82' },
  { id: 38, provinceNameTh: 'ภูเก็ต', provinceNameEn: 'Phuket', region: 'ใต้', code: 'TH-83' },
  { id: 39, provinceNameTh: 'สุราษฎร์ธานี', provinceNameEn: 'Surat Thani', region: 'ใต้', code: 'TH-84' },
  { id: 40, provinceNameTh: 'ระนอง', provinceNameEn: 'Ranong', region: 'ใต้', code: 'TH-85' },
  { id: 41, provinceNameTh: 'ชุมพร', provinceNameEn: 'Chumphon', region: 'ใต้', code: 'TH-86' },
  { id: 42, provinceNameTh: 'สงขลา', provinceNameEn: 'Songkhla', region: 'ใต้', code: 'TH-90' },
  { id: 43, provinceNameTh: 'สตูล', provinceNameEn: 'Satun', region: 'ใต้', code: 'TH-91' },
  { id: 44, provinceNameTh: 'ตรัง', provinceNameEn: 'Trang', region: 'ใต้', code: 'TH-92' },
  { id: 45, provinceNameTh: 'พัทลุง', provinceNameEn: 'Phatthalung', region: 'ใต้', code: 'TH-93' },
  { id: 46, provinceNameTh: 'ปัตตานี', provinceNameEn: 'Pattani', region: 'ใต้', code: 'TH-94' },
  { id: 47, provinceNameTh: 'ยะลา', provinceNameEn: 'Yala', region: 'ใต้', code: 'TH-95' },
  { id: 48, provinceNameTh: 'นราธิวาส', provinceNameEn: 'Narathiwat', region: 'ใต้', code: 'TH-96' },

  // ภาคตะวันออกเหนือ (Northeastern)
  { id: 49, provinceNameTh: 'บึงกาฬ', provinceNameEn: 'Bueng Kan', region: 'ตะวันออกเหนือ', code: 'TH-38' },
  { id: 50, provinceNameTh: 'อุบลราชธานี', provinceNameEn: 'Ubon Ratchathani', region: 'ตะวันออกเหนือ', code: 'TH-34' },
  { id: 51, provinceNameTh: 'ศรีสะเกษ', provinceNameEn: 'Si Sa Ket', region: 'ตะวันออกเหนือ', code: 'TH-33' },
  { id: 52, provinceNameTh: 'ยโสธร', provinceNameEn: 'Yasothon', region: 'ตะวันออกเหนือ', code: 'TH-35' },
  { id: 53, provinceNameTh: 'ชัยภูมิ', provinceNameEn: 'Chaiyaphum', region: 'ตะวันออกเหนือ', code: 'TH-36' },
  { id: 54, provinceNameTh: 'อำนาจเจริญ', provinceNameEn: 'Amnat Charoen', region: 'ตะวันออกเหนือ', code: 'TH-37' },
  { id: 55, provinceNameTh: 'หนองบัวลำภู', provinceNameEn: 'Nong Bua Lam Phu', region: 'ตะวันออกเหนือ', code: 'TH-39' },
  { id: 56, provinceNameTh: 'ขอนแก่น', provinceNameEn: 'Khon Kaen', region: 'ตะวันออกเหนือ', code: 'TH-40' },
  { id: 57, provinceNameTh: 'อุดรธานี', provinceNameEn: 'Udon Thani', region: 'ตะวันออกเหนือ', code: 'TH-41' },
  { id: 58, provinceNameTh: 'เลย', provinceNameEn: 'Loei', region: 'ตะวันออกเหนือ', code: 'TH-42' },
  { id: 59, provinceNameTh: 'หนองคาย', provinceNameEn: 'Nong Khai', region: 'ตะวันออกเหนือ', code: 'TH-43' },
  { id: 60, provinceNameTh: 'มหาสารคาม', provinceNameEn: 'Maha Sarakham', region: 'ตะวันออกเหนือ', code: 'TH-44' },
  { id: 61, provinceNameTh: 'ร้อยเอ็ด', provinceNameEn: 'Roi Et', region: 'ตะวันออกเหนือ', code: 'TH-45' },
  { id: 62, provinceNameTh: 'กาฬสินธุ์', provinceNameEn: 'Kalasin', region: 'ตะวันออกเหนือ', code: 'TH-46' },
  { id: 63, provinceNameTh: 'สกลนคร', provinceNameEn: 'Sakon Nakhon', region: 'ตะวันออกเหนือ', code: 'TH-47' },
  { id: 64, provinceNameTh: 'นครพนม', provinceNameEn: 'Nakhon Phanom', region: 'ตะวันออกเหนือ', code: 'TH-48' },
  { id: 65, provinceNameTh: 'มุกดาหาร', provinceNameEn: 'Mukdahan', region: 'ตะวันออกเหนือ', code: 'TH-49' },

  // ภาคเหนือ (Northern)
  { id: 66, provinceNameTh: 'เชียงใหม่', provinceNameEn: 'Chiang Mai', region: 'เหนือ', code: 'TH-50' },
  { id: 67, provinceNameTh: 'ลำพูน', provinceNameEn: 'Lamphun', region: 'เหนือ', code: 'TH-51' },
  { id: 68, provinceNameTh: 'ลำปาง', provinceNameEn: 'Lampang', region: 'เหนือ', code: 'TH-52' },
  { id: 69, provinceNameTh: 'อุตรดิตถ์', provinceNameEn: 'Uttaradit', region: 'เหนือ', code: 'TH-53' },
  { id: 70, provinceNameTh: 'แพร่', provinceNameEn: 'Phrae', region: 'เหนือ', code: 'TH-54' },
  { id: 71, provinceNameTh: 'น่าน', provinceNameEn: 'Nan', region: 'เหนือ', code: 'TH-55' },
  { id: 72, provinceNameTh: 'พะเยา', provinceNameEn: 'Phayao', region: 'เหนือ', code: 'TH-56' },
  { id: 73, provinceNameTh: 'เชียงราย', provinceNameEn: 'Chiang Rai', region: 'เหนือ', code: 'TH-57' },
  { id: 74, provinceNameTh: 'แม่ฮ่องสอน', provinceNameEn: 'Mae Hong Son', region: 'เหนือ', code: 'TH-58' },

  // ภาคตะวันออกเหนือ (ต่อ)
  { id: 75, provinceNameTh: 'นครราชสีมา', provinceNameEn: 'Nakhon Ratchasima', region: 'ตะวันออกเหนือ', code: 'TH-30' },
  { id: 76, provinceNameTh: 'บุรีรัมย์', provinceNameEn: 'Buri Ram', region: 'ตะวันออกเหนือ', code: 'TH-31' },
  { id: 77, provinceNameTh: 'สุรินทร์', provinceNameEn: 'Surin', region: 'ตะวันออกเหนือ', code: 'TH-32' }
];

const plants = [
  { plantId: "PLT001", plantNameTh: "ข้าว", plantNameEn: "Rice", imageUrl: "/images/pests/rice.jpeg" },
]

const pests = [
  // --- กลุ่มสัตว์ศัตรูข้าว (Animals) ---
  { pestId: "PST001", pestNameTh: "หอยเชอรี่", pestNameEn: "Golden Apple Snail", imageUrl: "/images/pests/golden-apple-snail-2.jpg" },
  { pestId: "PST002", pestNameTh: "หนู", pestNameEn: "Rat", imageUrl: "/images/pests/pests-rat.jpg" },
  // --- กลุ่มแมลงศัตรูข้าว (Insects) ---
  { pestId: "PST003", pestNameTh: "เพลี้ยกระโดดสีน้ำตาล", pestNameEn: "Brown Planthopper", imageUrl: "/images/pests/factsheet-planthopper-1.jpg" },
  { pestId: "PST004", pestNameTh: "เพลี้ยกระโดดหลังขาว", pestNameEn: "White-backed Planthopper", imageUrl: "/images/pests/white-backed-planthopper.jpg" },
  { pestId: "PST005", pestNameTh: "เพลี้ยจักจั่นสีเขียว", pestNameEn: "Green Leafhopper", imageUrl: "/images/pests/factsheet-green-leafhopper-1.jpg" },
  { pestId: "PST006", pestNameTh: "เพลี้ยจั้กจั่นปีกลายหยัก", pestNameEn: "Zigzag Leafhopper", imageUrl: "/images/pests/zigzag-leafhopper.jpg" },
  { pestId: "PST007", pestNameTh: "เพลี้ยไฟข้าว", pestNameEn: "Rice Thrips", imageUrl: "/rice_thrips.png" },
  { pestId: "PST008", pestNameTh: "หนอนกอข้าว", pestNameEn: "Rice Stem Borer", imageUrl: "/images/pests/stem-borer-whitehead.jpg" },
  { pestId: "PST009", pestNameTh: "หนอนห่อใบข้าว", pestNameEn: "Rice Leaf Folder", imageUrl: "/images/pests/leaf-folder.jpg" },
  { pestId: "PST010", pestNameTh: "บั่ว", pestNameEn: "Rice Gall Midge", imageUrl: "/images/pests/rice-gall-midge.jpg" },
  { pestId: "PST011", pestNameTh: "แมลงสิง", pestNameEn: "Rice Bug", imageUrl: "/images/pests/factsheet-ricebug-2.jpg" },
  { pestId: "PST012", pestNameTh: "แมลงดำหนาม", pestNameEn: "Rice Hispa", imageUrl: "/images/pests/rice-hispa-elongated-feeding.jpg" },
  { pestId: "PST013", pestNameTh: "หนอนปลอกข้าว", pestNameEn: "Rice Caseworm", imageUrl: "/images/pests/rice-caseworm.jpg" },
  { pestId: "PST014", pestNameTh: "หนอนกระทู้กล้า", pestNameEn: "Rice Swarming Caterpillar", imageUrl: "/images/pests/rice-swarming-caterpillar.png" },
  { pestId: "PST015", pestNameTh: "แมลงหล่า", pestNameEn: "Black Rice Bug", imageUrl: "/images/pests/factsheet-black-bug.jpg" },
  // --- กลุ่มโรคข้าว (Diseases) ---
  { pestId: "PST016", pestNameTh: "โรคไหม้ข้าว", pestNameEn: "Rice Blast Disease", imageUrl: "/images/pests/blast-leaf-1.jpg" },
  { pestId: "PST017", pestNameTh: "โรคไหม้คอรวง", pestNameEn: "Neck Blast Disease", imageUrl: "/images/pests/neck-blast-disease.jpg" },
  { pestId: "PST018", pestNameTh: "โรคขอบใบแห้ง", pestNameEn: "Bacterial Leaf Blight", imageUrl: "/images/pests/bacterial-leaf-blight-2.JPG" },
  { pestId: "PST019", pestNameTh: "โรคใบขีดโปร่งแสง", pestNameEn: "Bacterial Leaf Streak", imageUrl: "/images/pests/bacterial-leaf-streak-1.jpg" },
  { pestId: "PST020", pestNameTh: "โรคใบจุดสีน้ำตาล", pestNameEn: "Brown Spot", imageUrl: "/images/pests/brown-spot-4.jpg" },
  { pestId: "PST021", pestNameTh: "โรคใบขีดสีน้ำตาล", pestNameEn: "Narrow Brown Spot", imageUrl: "/images/pests/narrow-brown-spot-2.jpg" },
  { pestId: "PST022", pestNameTh: "โรคใบสีส้ม (ทรุโก)", pestNameEn: "Rice Tungro Disease", imageUrl: "/images/pests/tungro-1.jpg" },
  { pestId: "PST023", pestNameTh: "โรคถอดฝักดาบ (หลาว)", pestNameEn: "Bakanae Disease", imageUrl: "/images/pests/bakanae-1.jpg" },
  { pestId: "PST024", pestNameTh: "โรคกาบใบไหม้", pestNameEn: "Sheath Blight", imageUrl: "/images/pests/sheath-blight-2.jpg" },
  { pestId: "PST025", pestNameTh: "โรคกาบใบเน่า", pestNameEn: "Sheath Rot", imageUrl: "/images/pests/sheath-rot-4.jpg" },
  { pestId: "PST026", pestNameTh: "โรคเมล็ดด่าง", pestNameEn: "Dirty Panicle Disease", imageUrl: "/images/pests/dirty-panicle-disease.jpg" },
  { pestId: "PST027", pestNameTh: "โรคดอกกระถิน", pestNameEn: "False Smut", imageUrl: "/images/pests/Factsheet_false-smut-002.jpg" },
  { pestId: "PST028", pestNameTh: "โรคใบแถบแดง", pestNameEn: "Red Stripe", imageUrl: "/images/pests/red-stripe.jpg" },
];

export const plantStages = [
  { stageId: "STG001", labelTH: "ต้นกล้า", labelEN: "Seedling" },
  { stageId: "STG002", labelTH: "ข้าวแตกกอ", labelEN: "Tillering" },
  { stageId: "STG003", labelTH: "ข้าวกำเนิดช่องดอก", labelEN: "Heading" },
  { stageId: "STG004", labelTH: "ข้าวตั้งท้องออกรวง", labelEN: "Flowering" },
  { stageId: "STG005", labelTH: "ข้าวสุกแก่ทางเมล็ด", labelEN: "Ripening" },
];

export const occupationRoles = [
  { reporterId: "OCC001", labelTH: "เกษตรกร", labelEN: "Farmer" },
  { reporterId: "OCC002", labelTH: "อาสาสมัครเกษตร", labelEN: "Agriculture Volunteer" },
  { reporterId: "OCC003", labelTH: "เจ้าหน้าที่ส่งเสริมการเกษตร", labelEN: "Agricultural Extension Officer" },
  { reporterId: "OCC004", labelTH: "เจ้าหน้าที่ศูนย์วิจัยข้าว", labelEN: "Rice Research Center Staff" },
  { reporterId: "OCC005", labelTH: "เจ้าหน้าที่ราชการ", labelEN: "Government Officials" },
  { reporterId: "OCC006", labelTH: "ผู้นำชุมชน", labelEN: "Community Leader" },
  { reporterId: "OCC007", labelTH: "อาจารย์มหาวิทยาลัย", labelEN: "University Researcher" },
  { reporterId: "OCC008", labelTH: "นักศึกษ", labelEN: "Student" },
  { reporterId: "OCC009", labelTH: "ไม่ระบุ", labelEN: "Not Specified" },
];

async function main() {
  console.log('กำลังเริ่มทำการ Seed ข้อมูล...')

  // Seed Province
  console.log('Seeding provinces...')
  
  // Fetch existing provinces to preserve codes and avoid conflicts
  const existingProvinces = await prisma.province.findMany();
  const existingMap = new Map(existingProvinces.map(p => [p.provinceNameEn, p]));
  const usedCodes = new Set(existingProvinces.map(p => p.provinceCode));

  console.log(`Found ${existingProvinces.length} existing provinces.`);

  for (const p of provinces) {
    let codeToUse: string;
    let isNew = false;

    if (existingMap.has(p.provinceNameEn)) {
      // Province exists, preserve its code
      codeToUse = existingMap.get(p.provinceNameEn)!.provinceCode;
    } else {
      // Province does not exist, find a unique code
      // Try preferred code: TH-{id}
      let candidate = `TH-${p.id.toString().padStart(2, '0')}`;
      
      // If candidate is taken (unlikely but possible if old data used it for another province), append suffix
      // Or just try next available number?
      // Simple collision resolution:
      if (usedCodes.has(candidate)) {
         // This implies TH-XX is taken by ANOTHER province (since current province is new).
         // Try finding a gap or just use a safe suffix
         console.warn(`Preferred code ${candidate} for ${p.provinceNameEn} is taken. Generating safe code.`);
         let safeId = 100;
         while (usedCodes.has(`TH-${safeId}`)) {
           safeId++;
         }
         candidate = `TH-${safeId}`;
      }
      codeToUse = candidate;
      isNew = true;
    }

    // Mark code as used (for subsequent iterations of new provinces)
    usedCodes.add(codeToUse);

    // Upsert
    await prisma.province.upsert({
      where: { provinceNameEn: p.provinceNameEn },
      update: {
        provinceNameTh: p.provinceNameTh,
        provinceId: p.id,
        // Do NOT update provinceCode if it exists, to preserve relations
        // We already set codeToUse = existing code if exists.
        // But if we found it via Name, we can just ensure it's consistent?
        // Actually upsert update logic:
        // If we found it by Name, we don't need to change code.
        // But if we want to ensure uniqueness in case of race/logic error...
        // We just don't include provinceCode in update?
        // Wait, schema says provinceCode is unique string.
        // If we don't update it, it stays same. 
      },
      create: {
        provinceId: p.id,
        provinceCode: codeToUse,
        provinceNameEn: p.provinceNameEn,
        provinceNameTh: p.provinceNameTh,
      }
    })
    
    if (isNew) {
      console.log(`Added missing province: ${p.provinceNameEn} (${codeToUse})`);
    }
  }
  console.log(`Verified/Seeded ${provinces.length} provinces.`)

  // Seed Plant
  console.log('Seeding plants...')
  for (const plant of plants) {
    await prisma.plant.upsert({
      where: { plantId: plant.plantId },
      update: {
        plantNameEn: plant.plantNameEn,
        plantNameTh: plant.plantNameTh,
        imageUrl: plant.imageUrl,
      },
      create: {
        plantId: plant.plantId,
        plantNameEn: plant.plantNameEn,
        plantNameTh: plant.plantNameTh,
        imageUrl: plant.imageUrl,
      }
    })
  }
  console.log(`Seeded ${plants.length} plants`)

  // Seed Pest
  console.log('Seeding pests...')
  for (const pest of pests) {
    await prisma.pest.upsert({
      where: { pestId: pest.pestId },
      update: {
        pestNameEn: pest.pestNameEn,
        pestNameTh: pest.pestNameTh,
        imageUrl: pest.imageUrl,
      },
      create: {
        pestId: pest.pestId,
        pestNameEn: pest.pestNameEn,
        pestNameTh: pest.pestNameTh,
        imageUrl: pest.imageUrl,
      }
    })
  }
  console.log(`Seeded ${pests.length} pests`)

  // Seed PlantGrowthStage
  console.log('Seeding plant stages...')
  for (const stage of plantStages) {
    await prisma.plantGrowthStage.upsert({
      where: { stageId: stage.stageId },
      update: {
        stageNameTh: stage.labelTH,
        stageNameEn: stage.labelEN,
      },
      create: {
        stageId: stage.stageId,
        stageNameTh: stage.labelTH,
        stageNameEn: stage.labelEN,
      }
    })
  }
  console.log(`Seeded ${plantStages.length} plant stages`)


  console.log('Seed ข้อมูล Master Data สำเร็จแล้ว!')
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
