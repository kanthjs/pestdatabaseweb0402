import { PrismaClient, ReportStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const provinces = [
  // ภาคกลาง (Central)
  { id: 1, code: '10', provinceNameTh: 'กรุงเทพมหานคร', provinceNameEn: 'Bangkok', region: 'กลาง', iso: 'TH-10' },
  { id: 2, code: '11', provinceNameTh: 'สมุทรปราการ', provinceNameEn: 'Samut Prakan', region: 'กลาง', iso: 'TH-11' },
  { id: 3, code: '12', provinceNameTh: 'นนทบุรี', provinceNameEn: 'Nonthaburi', region: 'กลาง', iso: 'TH-12' },
  { id: 4, code: '13', provinceNameTh: 'ปทุมธานี', provinceNameEn: 'Pathum Thani', region: 'กลาง', iso: 'TH-13' },
  { id: 5, code: '14', provinceNameTh: 'พระนครศรีอยุธยา', provinceNameEn: 'Phra Nakhon Si Ayutthaya', region: 'กลาง', iso: 'TH-14' },
  { id: 6, code: '15', provinceNameTh: 'อ่างทอง', provinceNameEn: 'Ang Thong', region: 'กลาง', iso: 'TH-15' },
  { id: 7, code: '16', provinceNameTh: 'ลพบุรี', provinceNameEn: 'Lop Buri', region: 'กลาง', iso: 'TH-16' },
  { id: 8, code: '17', provinceNameTh: 'สิงห์บุรี', provinceNameEn: 'Sing Buri', region: 'กลาง', iso: 'TH-17' },
  { id: 9, code: '18', provinceNameTh: 'ชัยนาท', provinceNameEn: 'Chai Nat', region: 'กลาง', iso: 'TH-18' },
  { id: 10, code: '19', provinceNameTh: 'สระบุรี', provinceNameEn: 'Saraburi', region: 'กลาง', iso: 'TH-19' },
  { id: 11, code: '20', provinceNameTh: 'ชลบุรี', provinceNameEn: 'Chon Buri', region: 'ตะวันออก', iso: 'TH-20' },
  { id: 12, code: '21', provinceNameTh: 'ระยอง', provinceNameEn: 'Rayong', region: 'ตะวันออก', iso: 'TH-21' },
  { id: 13, code: '22', provinceNameTh: 'จันทบุรี', provinceNameEn: 'Chanthaburi', region: 'ตะวันออก', iso: 'TH-22' },
  { id: 14, code: '23', provinceNameTh: 'ตราด', provinceNameEn: 'Trat', region: 'ตะวันออก', iso: 'TH-23' },
  { id: 15, code: '24', provinceNameTh: 'ฉะเชิงเทรา', provinceNameEn: 'Chachoengsao', region: 'ตะวันออก', iso: 'TH-24' },
  { id: 16, code: '25', provinceNameTh: 'ปราจีนบุรี', provinceNameEn: 'Prachin Buri', region: 'ตะวันออก', iso: 'TH-25' },
  { id: 17, code: '26', provinceNameTh: 'นครนายก', provinceNameEn: 'Nakhon Nayok', region: 'กลาง', iso: 'TH-26' },
  { id: 18, code: '27', provinceNameTh: 'สระแก้ว', provinceNameEn: 'Sa Kaeo', region: 'ตะวันออก', iso: 'TH-27' },

  // ภาคเหนือ (Northern)
  { id: 19, code: '30', provinceNameTh: 'นครสวรรค์', provinceNameEn: 'Nakhon Sawan', region: 'กลาง', iso: 'TH-30' },
  { id: 20, code: '31', provinceNameTh: 'อุทัยธานี', provinceNameEn: 'Uthai Thani', region: 'กลาง', iso: 'TH-31' },
  { id: 21, code: '32', provinceNameTh: 'กำแพงเพชร', provinceNameEn: 'Kamphaeng Phet', region: 'กลาง', iso: 'TH-32' },
  { id: 22, code: '33', provinceNameTh: 'ตาก', provinceNameEn: 'Tak', region: 'ตะวันตก', iso: 'TH-33' },
  { id: 23, code: '34', provinceNameTh: 'สุโขทัย', provinceNameEn: 'Sukhothai', region: 'เหนือ', iso: 'TH-34' },
  { id: 24, code: '35', provinceNameTh: 'พิษณุโลก', provinceNameEn: 'Phitsanulok', region: 'เหนือ', iso: 'TH-35' },
  { id: 25, code: '36', provinceNameTh: 'พิจิตร', provinceNameEn: 'Phichit', region: 'เหนือ', iso: 'TH-36' },
  { id: 26, code: '37', provinceNameTh: 'เพชรบูรณ์', provinceNameEn: 'Phetchabun', region: 'เหนือ', iso: 'TH-37' },
  { id: 27, code: '38', provinceNameTh: 'ราชบุรี', provinceNameEn: 'Ratchaburi', region: 'ตะวันตก', iso: 'TH-38' },
  { id: 28, code: '39', provinceNameTh: 'กาญจนบุรี', provinceNameEn: 'Kanchanaburi', region: 'ตะวันตก', iso: 'TH-39' },
  { id: 29, code: '40', provinceNameTh: 'สุพรรณบุรี', provinceNameEn: 'Suphan Buri', region: 'กลาง', iso: 'TH-40' },
  { id: 30, code: '41', provinceNameTh: 'นครปฐม', provinceNameEn: 'Nakhon Pathom', region: 'กลาง', iso: 'TH-41' },
  { id: 31, code: '42', provinceNameTh: 'สมุทรสาคร', provinceNameEn: 'Samut Sakhon', region: 'กลาง', iso: 'TH-42' },
  { id: 32, code: '43', provinceNameTh: 'สมุทรสงคราม', provinceNameEn: 'Samut Songkhram', region: 'กลาง', iso: 'TH-43' },
  { id: 33, code: '44', provinceNameTh: 'เพชรบุรี', provinceNameEn: 'Phetchaburi', region: 'ตะวันตก', iso: 'TH-44' },
  { id: 34, code: '45', provinceNameTh: 'ประจวบคีรีขันธ์', provinceNameEn: 'Prachuap Khiri Khan', region: 'ตะวันตก', iso: 'TH-45' },
  { id: 35, code: '46', provinceNameTh: 'นครศรีธรรมราช', provinceNameEn: 'Nakhon Si Thammarat', region: 'ใต้', iso: 'TH-46' },
  { id: 36, code: '47', provinceNameTh: 'กระบี่', provinceNameEn: 'Krabi', region: 'ใต้', iso: 'TH-47' },
  { id: 37, code: '48', provinceNameTh: 'พังงา', provinceNameEn: 'Phang Nga', region: 'ใต้', iso: 'TH-48' },
  { id: 38, code: '49', provinceNameTh: 'ภูเก็ต', provinceNameEn: 'Phuket', region: 'ใต้', iso: 'TH-49' },
  { id: 39, code: '50', provinceNameTh: 'สุราษฎร์ธานี', provinceNameEn: 'Surat Thani', region: 'ใต้', iso: 'TH-50' },
  { id: 40, code: '51', provinceNameTh: 'ระนอง', provinceNameEn: 'Ranong', region: 'ใต้', iso: 'TH-51' },
  { id: 41, code: '52', provinceNameTh: 'ชุมพร', provinceNameEn: 'Chumphon', region: 'ใต้', iso: 'TH-52' },
  { id: 42, code: '53', provinceNameTh: 'สงขลา', provinceNameEn: 'Songkhla', region: 'ใต้', iso: 'TH-53' },
  { id: 43, code: '54', provinceNameTh: 'สตูล', provinceNameEn: 'Satun', region: 'ใต้', iso: 'TH-54' },
  { id: 44, code: '55', provinceNameTh: 'ตรัง', provinceNameEn: 'Trang', region: 'ใต้', iso: 'TH-55' },
  { id: 45, code: '56', provinceNameTh: 'พัทลุง', provinceNameEn: 'Phatthalung', region: 'ใต้', iso: 'TH-56' },
  { id: 46, code: '57', provinceNameTh: 'ปัตตานี', provinceNameEn: 'Pattani', region: 'ใต้', iso: 'TH-57' },
  { id: 47, code: '58', provinceNameTh: 'ยะลา', provinceNameEn: 'Yala', region: 'ใต้', iso: 'TH-58' },
  { id: 48, code: '60', provinceNameTh: 'นราธิวาส', provinceNameEn: 'Narathiwat', region: 'ใต้', iso: 'TH-60' },
  { id: 49, code: '90', provinceNameTh: 'บึงกาฬ', provinceNameEn: 'Bueng Kan', region: 'ตะวันออกเหนือ', iso: 'TH-38' }, // Note: ISO reused

  // ภาคตะวันออกเหนือ (Northeastern)
  { id: 50, code: '30', provinceNameTh: 'อุบลราชธานี', provinceNameEn: 'Ubon Ratchathani', region: 'ตะวันออกเหนือ', iso: 'TH-34' },
  { id: 51, code: '31', provinceNameTh: 'ศรีสะเกษ', provinceNameEn: 'Si Sa Ket', region: 'ตะวันออกเหนือ', iso: 'TH-33' },
  { id: 52, code: '32', provinceNameTh: 'ยโสธร', provinceNameEn: 'Yasothon', region: 'ตะวันออกเหนือ', iso: 'TH-35' },
  { id: 53, code: '33', provinceNameTh: 'ชัยภูมิ', provinceNameEn: 'Chaiyaphum', region: 'ตะวันออกเหนือ', iso: 'TH-36' },
  { id: 54, code: '34', provinceNameTh: 'อำนาจเจริญ', provinceNameEn: 'Amnat Charoen', region: 'ตะวันออกเหนือ', iso: 'TH-37' },
  { id: 55, code: '35', provinceNameTh: 'หนองบัวลำภู', provinceNameEn: 'Nong Bua Lam Phu', region: 'ตะวันออกเหนือ', iso: 'TH-39' },
  { id: 56, code: '36', provinceNameTh: 'ขอนแก่น', provinceNameEn: 'Khon Kaen', region: 'ตะวันออกเหนือ', iso: 'TH-40' },
  { id: 57, code: '37', provinceNameTh: 'อุดรธานี', provinceNameEn: 'Udon Thani', region: 'ตะวันออกเหนือ', iso: 'TH-41' },
  { id: 58, code: '38', provinceNameTh: 'เลย', provinceNameEn: 'Loei', region: 'ตะวันออกเหนือ', iso: 'TH-42' },
  { id: 59, code: '39', provinceNameTh: 'หนองคาย', provinceNameEn: 'Nong Khai', region: 'ตะวันออกเหนือ', iso: 'TH-43' },
  { id: 60, code: '40', provinceNameTh: 'มหาสารคาม', provinceNameEn: 'Maha Sarakham', region: 'ตะวันออกเหนือ', iso: 'TH-44' },
  { id: 61, code: '41', provinceNameTh: 'ร้อยเอ็ด', provinceNameEn: 'Roi Et', region: 'ตะวันออกเหนือ', iso: 'TH-45' },
  { id: 62, code: '42', provinceNameTh: 'กาฬสินธุ์', provinceNameEn: 'Kalasin', region: 'ตะวันออกเหนือ', iso: 'TH-46' },
  { id: 63, code: '43', provinceNameTh: 'สกลนคร', provinceNameEn: 'Sakon Nakhon', region: 'ตะวันออกเหนือ', iso: 'TH-47' },
  { id: 64, code: '44', provinceNameTh: 'นครพนม', provinceNameEn: 'Nakhon Phanom', region: 'ตะวันออกเหนือ', iso: 'TH-48' },
  { id: 65, code: '45', provinceNameTh: 'มุกดาหาร', provinceNameEn: 'Mukdahan', region: 'ตะวันออกเหนือ', iso: 'TH-49' },

  // ภาคเหนือ (Northern) - ต่อ
  { id: 66, code: '50', provinceNameTh: 'เชียงใหม่', provinceNameEn: 'Chiang Mai', region: 'เหนือ', iso: 'TH-50' },
  { id: 67, code: '51', provinceNameTh: 'ลำพูน', provinceNameEn: 'Lamphun', region: 'เหนือ', iso: 'TH-51' },
  { id: 68, code: '52', provinceNameTh: 'ลำปาง', provinceNameEn: 'Lampang', region: 'เหนือ', iso: 'TH-52' },
  { id: 69, code: '53', provinceNameTh: 'อุตรดิตถ์', provinceNameEn: 'Uttaradit', region: 'เหนือ', iso: 'TH-53' },
  { id: 70, code: '54', provinceNameTh: 'แพร่', provinceNameEn: 'Phrae', region: 'เหนือ', iso: 'TH-54' },
  { id: 71, code: '55', provinceNameTh: 'น่าน', provinceNameEn: 'Nan', region: 'เหนือ', iso: 'TH-55' },
  { id: 72, code: '56', provinceNameTh: 'พะเยา', provinceNameEn: 'Phayao', region: 'เหนือ', iso: 'TH-56' },
  { id: 73, code: '57', provinceNameTh: 'เชียงราย', provinceNameEn: 'Chiang Rai', region: 'เหนือ', iso: 'TH-57' },
  { id: 74, code: '58', provinceNameTh: 'แม่ฮ่องสอน', provinceNameEn: 'Mae Hong Son', region: 'เหนือ', iso: 'TH-58' },

  // ภาคตะวันออกเหนือ (Northeastern) - ต่อ
  { id: 75, code: '60', provinceNameTh: 'นครราชสีมา', provinceNameEn: 'Nakhon Ratchasima', region: 'ตะวันออกเหนือ', iso: 'TH-30' },
  { id: 76, code: '61', provinceNameTh: 'บุรีรัมย์', provinceNameEn: 'Buri Ram', region: 'ตะวันออกเหนือ', iso: 'TH-31' },
  { id: 77, code: '62', provinceNameTh: 'สุรินทร์', provinceNameEn: 'Surin', region: 'ตะวันออกเหนือ', iso: 'TH-32' },
]

const plants = [
  { plantId: "PLT001", plantNameTh: "ข้าว", plantNameEn: "Rice" },
  { plantId: "PLT002", plantNameTh: "ข้าวโพด", plantNameEn: "Corn" },
]

const pests = [
  // --- กลุ่มสัตว์ศัตรูข้าว (Animals) ---
  { pestId: "PST001", pestNameTh: "หอยเชอรี่", pestNameEn: "Golden Apple Snail" },
  { pestId: "PST002", pestNameTh: "หนู", pestNameEn: "Rat" },
  { pestId: "PST003", pestNameTh: "นกกระติ๊ดตะโพกขาว", pestNameEn: "White-rumped Munia" },
  // --- กลุ่มแมลงศัตรูข้าว (Insects) ---
  { pestId: "PST004", pestNameTh: "เพลี้ยกระโดดสีน้ำตาล", pestNameEn: "Brown Planthopper" },
  { pestId: "PST005", pestNameTh: "หนอนกระทู้ข้าวโพดลายจุด", pestNameEn: "Fall Armyworm" },
  { pestId: "PST006", pestNameTh: "หนอนกอข้าว", pestNameEn: "Rice Stem Borer" },
  { pestId: "PST007", pestNameTh: "เพลี้ยไฟข้าว", pestNameEn: "Rice Thrips" },
  { pestId: "PST008", pestNameTh: "หนอนห่อใบข้าว", pestNameEn: "Rice Leaf Folder" },
  { pestId: "PST009", pestNameTh: "แมลงสิง", pestNameEn: "Rice Bug" },
  { pestId: "PST010", pestNameTh: "เพลี้ยกระโดดหลังขาว", pestNameEn: "White-backed Planthopper" },
  { pestId: "PST011", pestNameTh: "บั่ว", pestNameEn: "Rice Gall Midge" },
  { pestId: "PST012", pestNameTh: "เพลี้ยจักจั่นสีเขียว", pestNameEn: "Green Leafhopper" },
  { pestId: "PST013", pestNameTh: "แมลงดำหนามข้าว", pestNameEn: "Rice Hispa" },
  { pestId: "PST014", pestNameTh: "หนอนปลอกข้าว", pestNameEn: "Rice Caseworm" },
  { pestId: "PST015", pestNameTh: "หนอนกระทู้กล้า", pestNameEn: "Rice Swarming Caterpillar" },
  { pestId: "PST016", pestNameTh: "แมลงหล่า", pestNameEn: "Black Rice Bug" },
  { pestId: "PST017", pestNameTh: "เพลี้ยจักจั่นหยัก", pestNameEn: "Zigzag Leafhopper" },
  // --- กลุ่มโรคข้าว (Diseases) ---
  { pestId: "PST018", pestNameTh: "โรคไหม้ข้าว", pestNameEn: "Rice Blast Disease" },
  { pestId: "PST019", pestNameTh: "โรคขอบใบแห้ง", pestNameEn: "Bacterial Leaf Blight" },
  { pestId: "PST020", pestNameTh: "โรคใบสีส้ม", pestNameEn: "Rice Tungro Disease" },
  { pestId: "PST021", pestNameTh: "โรคใบขีดโปร่งแสง", pestNameEn: "Bacterial Leaf Streak" },
  { pestId: "PST022", pestNameTh: "โรคเมล็ดด่าง", pestNameEn: "Dirty Panicle Disease" },
  { pestId: "PST023", pestNameTh: "โรคกาบใบแห้ง", pestNameEn: "Sheath Blight" },
  { pestId: "PST024", pestNameTh: "โรคใบจุดสีน้ำตาล", pestNameEn: "Brown Spot" },
  { pestId: "PST025", pestNameTh: "โรคใบขีดสีน้ำตาล", pestNameEn: "Narrow Brown Spot" },
  { pestId: "PST026", pestNameTh: "โรคไหม้คอรวง", pestNameEn: "Neck Blast Disease" },
  { pestId: "PST027", pestNameTh: "โรคถอดฝักดาบ", pestNameEn: "Bakanae Disease" },
  { pestId: "PST028", pestNameTh: "โรคกาบใบเน่า", pestNameEn: "Sheath Rot" },
];

export const reporterRoles = [
  { reporterId: "REP001", labelTH: "เกษตรกร", labelEN: "Farmer" },
  { reporterId: "REP002", labelTH: "อาสาสมัครเกษตร", labelEN: "Agriculture Volunteer" },
  { reporterId: "REP003", labelTH: "เจ้าหน้าที่ส่งเสริมการเกษตร", labelEN: "Agricultural Extension Officer" },
  { reporterId: "REP004", labelTH: "เจ้าหน้าที่ศูนย์วิจัยข้าว", labelEN: "Rice Research Center Staff" },
  { reporterId: "REP005", labelTH: "เจ้าหน้าที่ราชการ", labelEN: "Government Officials" },
  { reporterId: "REP006", labelTH: "ผู้นำชุมชน", labelEN: "Community Leader" },
  { reporterId: "REP007", labelTH: "อาจารย์มหาวิทยาลัย", labelEN: "University Researcher" },
  { reporterId: "REP008", labelTH: "นักศึกษ", labelEN: "Student" },
  { reporterId: "REP009", labelTH: "ไม่ระบุ", labelEN: "Not Specified" },
];

async function main() {
  console.log('กำลังเริ่มทำการ Seed ข้อมูล...')

  // ล้างข้อมูลเก่าออกก่อนเพื่อให้ข้อมูลไม่ซ้ำซ้อนเวลาสั่ง seed ใหม่
  await prisma.pestReport.deleteMany()
  await prisma.province.deleteMany()
  await prisma.plant.deleteMany()
  await prisma.pest.deleteMany()

  // Seed Province
  console.log('Seeding provinces...')
  for (const p of provinces) {
    await prisma.province.create({
      data: {
        provinceId: p.id,
        provinceNameEn: p.provinceNameEn,
      }
    })
  }
  console.log(`Seeded ${provinces.length} provinces`)

  // Seed Plant
  console.log('Seeding plants...')
  for (const plant of plants) {
    await prisma.plant.create({
      data: {
        plantId: plant.plantId,
        plantNameEn: plant.plantNameEn,
      }
    })
  }
  console.log(`Seeded ${plants.length} plants`)

  // Seed Pest
  console.log('Seeding pests...')
  for (const pest of pests) {
    await prisma.pest.create({
      data: {
        pestId: pest.pestId,
        pestNameEn: pest.pestNameEn,
      }
    })
  }
  console.log(`Seeded ${pests.length} pests`)

  // Seed PestReport
  const seedData = [
    {
      province: "ปทุมธานี",
      plantId: "PLT001",
      pestId: "PST001", // เพลี้ยกระโดดสีน้ำตาล
      symptomOnSet: new Date('2026-01-10'),
      fieldAffectedArea: 15.0,
      incidencePercent: 30,
      severityPercent: 20,
      latitude: 14.0208,
      longitude: 100.7250,
      imageUrls: ["https://picsum.photos/seed/pest1/400/300"],
      imageCaptions: ["พบกลุ่มเพลี้ยบริเวณโคนต้น"],
      isAnonymous: true,
      reporterFirstName: "สมชาย",
      reporterLastName: "ใจดี",
      reporterPhone: "081-234-5678",
      reporterRoles: "REP001",
      status: ReportStatus.VERIFIED,
    },
    {
      province: "พระนครศรีอยุธยา",
      plantId: "PLT001",
      pestId: "PST013", // หอยเชอรี่
      symptomOnSet: new Date('2026-01-15'),
      fieldAffectedArea: 5.5,
      incidencePercent: 50,
      severityPercent: 40,
      latitude: 14.3532,
      longitude: 100.5681,
      imageUrls: ["https://picsum.photos/seed/pest2/400/300"],
      imageCaptions: ["พบไข่หอยเชอรี่สีชมพูตามกอข้าว"],
      isAnonymous: false,
      reporterFirstName: "สมหญิง",
      reporterLastName: "รักนา",
      reporterPhone: "082-345-6789",
      reporterRoles: "REP001",
      status: ReportStatus.VERIFIED,
    },
    {
      province: "สุพรรณบุรี",
      plantId: "PLT001",
      pestId: "PST003", // โรคไหม้ข้าว
      symptomOnSet: new Date('2026-01-20'),
      fieldAffectedArea: 25.0,
      incidencePercent: 60,
      severityPercent: 50,
      latitude: 14.4742,
      longitude: 100.1177,
      imageUrls: ["https://picsum.photos/seed/pest3/400/300"],
      imageCaptions: ["ใบข้าวมีแผลจุดสีน้ำตาลรูปร่างคล้ายตา"],
      isAnonymous: false,
      reporterFirstName: "มานะ",
      reporterLastName: "ขยันยิ่ง",
      reporterPhone: "083-456-7890",
      reporterRoles: "REP002",
      status: ReportStatus.VERIFIED,
    },
    {
      province: "นครสวรรค์",
      plantId: "PLT001",
      pestId: "PST004", // หนอนกอข้าว
      symptomOnSet: new Date('2026-01-25'),
      fieldAffectedArea: 10.0,
      incidencePercent: 20,
      severityPercent: 15,
      latitude: 15.7048,
      longitude: 100.1372,
      imageUrls: ["https://picsum.photos/seed/pest4/400/300"],
      imageCaptions: ["ยอดข้าวแห้งตาย (อาการยอดเหี่ยว)"],
      isAnonymous: true,
      reporterFirstName: "วิชัย",
      reporterLastName: "รุ่งเรือง",
      reporterPhone: "084-567-8901",
      reporterRoles: "REP001",
      status: ReportStatus.VERIFIED,
    },
    {
      province: "ชัยนาท",
      plantId: "PLT001",
      pestId: "PST009", // โรคขอบใบแห้ง
      symptomOnSet: new Date('2026-01-28'),
      fieldAffectedArea: 40.0,
      incidencePercent: 45,
      severityPercent: 30,
      latitude: 15.1851,
      longitude: 100.1251,
      imageUrls: ["https://picsum.photos/seed/pest5/400/300"],
      imageCaptions: ["ขอบใบข้าวมีลักษณะแห้งเป็นสีขาวซีด"],
      isAnonymous: false,
      reporterFirstName: "ปราณี",
      reporterLastName: "เกษตรดี",
      reporterPhone: "085-678-9012",
      reporterRoles: "REP001",
      status: ReportStatus.VERIFIED,
    },
    {
      province: "พิจิตร",
      plantId: "PLT001",
      pestId: "PST027", // หนูนา
      symptomOnSet: new Date('2026-02-01'),
      fieldAffectedArea: 8.0,
      incidencePercent: 15,
      severityPercent: 10,
      latitude: 16.4404,
      longitude: 100.3488,
      imageUrls: ["https://picsum.photos/seed/pest6/400/300"],
      imageCaptions: ["ต้นข้าวถูกกัดขาดเป็นหย่อมๆ"],
      isAnonymous: true,
      reporterFirstName: "บุญส่ง",
      reporterLastName: "คงมั่น",
      reporterPhone: "086-789-0123",
      reporterRoles: "REP001",
      status: ReportStatus.VERIFIED,
    },
    {
      province: "ขอนแก่น",
      plantId: "PLT001",
      pestId: "PST014", // บั่ว
      symptomOnSet: new Date('2026-02-02'),
      fieldAffectedArea: 12.0,
      incidencePercent: 35,
      severityPercent: 25,
      latitude: 16.4322,
      longitude: 102.8236,
      imageUrls: ["https://picsum.photos/seed/pest7/400/300"],
      imageCaptions: ["ใบข้าวมีลักษณะเป็นหลอดคล้ายใบหอม"],
      isAnonymous: false,
      reporterFirstName: "ทองดี",
      reporterLastName: "มีทรัพย์",
      reporterPhone: "087-890-1234",
      reporterRoles: "REP002",
      status: ReportStatus.VERIFIED,
    },
    {
      province: "อุบลราชธานี",
      plantId: "PLT001",
      pestId: "PST021", // โรคกาบใบแห้ง
      symptomOnSet: new Date('2026-02-03'),
      fieldAffectedArea: 30.0,
      incidencePercent: 55,
      severityPercent: 40,
      latitude: 15.2287,
      longitude: 104.8564,
      imageUrls: ["https://picsum.photos/seed/pest8/400/300"],
      imageCaptions: ["แผลบนกาบใบมีลักษณะคล้ายเมฆ"],
      isAnonymous: false,
      reporterFirstName: "สายใจ",
      reporterLastName: "งามดี",
      reporterPhone: "088-901-2345",
      reporterRoles: "REP001",
      status: ReportStatus.VERIFIED,
    },
    {
      province: "ร้อยเอ็ด",
      plantId: "PLT001",
      pestId: "PST007", // แมลงสิง
      symptomOnSet: new Date('2026-02-04'),
      fieldAffectedArea: 18.0,
      incidencePercent: 40,
      severityPercent: 20,
      latitude: 16.0544,
      longitude: 103.6521,
      imageUrls: ["https://picsum.photos/seed/pest9/400/300"],
      imageCaptions: ["พบแมลงสิงดูดกินน้ำเลี้ยงเมล็ดข้าวระยะน้ำนม"],
      isAnonymous: true,
      reporterFirstName: "กานดา",
      reporterLastName: "สีสด",
      reporterPhone: "089-012-3456",
      reporterRoles: "REP001",
      status: ReportStatus.VERIFIED,
    },
    {
      province: "ฉะเชิงเทรา",
      plantId: "PLT001",
      pestId: "PST005", // เพลี้ยไฟข้าว
      symptomOnSet: new Date('2026-02-05'),
      fieldAffectedArea: 22.0,
      incidencePercent: 70,
      severityPercent: 50,
      latitude: 13.6904,
      longitude: 101.0703,
      imageUrls: ["https://picsum.photos/seed/pest10/400/300"],
      imageCaptions: ["ปลายใบข้าวม้วนเป็นเกลียวและแห้ง"],
      isAnonymous: false,
      reporterFirstName: "อนุชิต",
      reporterLastName: "สว่างจิต",
      reporterPhone: "080-123-4567",
      reporterRoles: "REP001",
      status: ReportStatus.PENDING,
    }
  ];

  console.log('Seeding pest reports...')
  for (const data of seedData) {
    await prisma.pestReport.create({ data })
  }

  console.log('Seed ข้อมูลทั้งหมดสำเร็จแล้ว!')
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
