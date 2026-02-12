# Nominatim API Error: 403 Forbidden

## ปัญหาที่พบ

เมื่อทำการระบุตำแหน่ง (Geolocation) ผ่านฟังก์ชัน `reverseGeocode` ใน `actions.ts` ระบบได้รับ Error 403 Forbidden จาก Nominatim API (OpenStreetMap)

## สาเหตุ

Nominatim API มีนโยบายการใช้งาน (Usage Policy) ที่เคร่งครัด โดยเฉพาะเรื่อง `User-Agent` Header:

1. **User-Agent ไม่ถูกต้อง:** `User-Agent` ที่ใช้อาจจะเป็นค่า Default หรือ Generic เกินไป ("PestDatabaseWeb/1.0 (Contact: <admin@example.com>)") ซึ่งอาจถูกบล็อกโดยระบบป้องกันspam
2. **Rate Limiting:** หากมีการยิง Request ถี่เกินไปในช่วงเวลาสั้นๆ โดยไม่มี User-Agent ที่ชัดเจน อาจถูกระงับการใช้งานชั่วคราว

## แนวทางการแก้ไข (Solution)

1. **ปรับปรุง User-Agent Header:**
   - เปลี่ยน `User-Agent` ให้มีความเฉพาะเจาะจงมากขึ้น และระบุช่องทางการติดต่อที่ชัดเจนกว่าเดิม หรือใช้ URL ของโปรเจกต์ (ถ้ามี)
   - ตัวอย่าง: `PestDatabaseApp/1.0 (https://pestdatabase-th.vercel.app)` หรือ `PestDatabaseApp/1.0 (contact: your-email@domain.com)`

2. **เพิ่ม Referer Header:**
   - การระบุ `Referer` อาจช่วยยืนยันแหล่งที่มาของ Request ได้ดีขึ้น

3. **ตรวจสอบ Error Handling:**
   - ตรวจสอบว่าระบบจัดการกับ Error ได้ถูกต้อง และแสดงผลให้ผู้ใช้ทราบ (ซึ่งได้ทำไปแล้วใน commit ก่อนหน้า)

## แผนการดำเนินการ

- แก้ไขไฟล์ `src/app/survey/actions.ts`
- เปลี่ยน `User-Agent` เป็นค่าใหม่ที่เหมาะสม
- ทดสอบการใช้งาน Geolocation อีกครั้ง
