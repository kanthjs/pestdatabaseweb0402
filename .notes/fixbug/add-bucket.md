# แผนการแก้ไข Bucket not found และการตั้งค่า Supabase Storage

> **สถานะ:** ✅ เสร็จสมบูรณ์ (Completed on 2026-02-12)

จากการตรวจสอบโครงสร้างโปรเจค พบว่ามีการใช้งาน Supabase Storage สำหรับเก็บรูปภาพสองส่วนหลักๆ โดยทั้งคู่ใช้ bucket ชื่อเดียวกันคือ `pestPics`

## 1. จุดที่มีการใช้งาน Storage

- **รายงานศัตรูพืช (Pest Reports):** เก็บรูปภาพการระบาดในฟอร์ม `/survey` (ฟิลด์ `imageUrls` ใน `PestReport` model)
- **หลักฐานยืนยันตัวตนผู้เชี่ยวชาญ (Expert Proof):** เก็บรูปภาพบัตรเจ้าหน้าที่หรือใบรับรองในหน้า `/profile` (ฟิลด์ `expertProofUrl` ใน `UserProfile` model)

## 2. โครงสร้างที่ต้องสร้างใน Supabase

เพื่อให้ระบบทำงานได้ ต้องสร้าง Bucket และกำหนดนโยบายความปลอดภัย (RLS) ดังนี้:

### Bucket: `pestPics`

- **สถานะ:** Public (สาธารณะ) - เพื่อให้สามารถดึงรูปมาแสดงผลผ่าน Public URL ได้ตามโค้ดปัจจุบัน
- **ข้อควรระวัง (Security Warning):** ปัจจุบันหลักฐานผู้เชี่ยวชาญ (`expertProofUrl`) ถูกเก็บไว้ใน bucket สาธารณะนี้ด้วย ซึ่งอาจไม่ปลอดภัยสำหรับข้อมูลส่วนตัว ในอนาคตควรแยกไปเก็บใน Private Bucket และใช้ Signed URL แทน

### Storage Policies (SQL สำหรับตั้งค่า)

1. **สิทธิ์การอ่าน (Public Read):**

   ```sql
   CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'pestPics');
   ```

2. **สิทธิ์การอัปโหลด (Authenticated Upload):**

   ```sql
   CREATE POLICY "Authenticated Users Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pestPics' AND auth.role() = 'authenticated');
   ```

3. **สิทธิ์การแก้ไข/ลบ (Owner Update/Delete):**

   ```sql
   CREATE POLICY "Users Update Own Files" ON storage.objects FOR UPDATE USING (bucket_id = 'pestPics' AND auth.uid() = owner);
   CREATE POLICY "Users Delete Own Files" ON storage.objects FOR DELETE USING (bucket_id = 'pestPics' AND auth.uid() = owner);
   ```

## 3. รายการตัวแปรอื่นๆ ที่เกี่ยวข้องกับการเก็บข้อมูล (Prisma)

จากการเช็ค `schema.prisma` นอกจาก `imageUrls` และ `expertProofUrl` ยังมีส่วนที่อาจต้องอ้างอิงรูปภาพในอนาคต (หรือตอนนี้ใช้ URL ภายนอก):

- `Plant.imageUrl`: รูปภาพประเภทพืช (เช่น ข้าว)
- `Pest.imageUrl`: รูปภาพศัตรูพืช (เช่น เพลี้ยกระโดดสีน้ำตาล)
*ปัจจุบันข้อมูลสองส่วนนี้มักจะถูก Seed ไว้ล่วงหน้า แต่ถ้ามีการเพิ่มฟีเจอร์ให้ Admin อัปโหลดรูปเองได้ จะต้องดึงข้อมูล Storage มาใช้เพิ่มในภายหลัง*
