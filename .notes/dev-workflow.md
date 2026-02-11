# Dev Workflow — วิธีทำงานที่ไม่ทำให้ Project พัง

> กฎเหล็ก: `main` = production จริง อย่าแตะโดยตรง

---

## โครงสร้าง Branch

```
main          ← Vercel deploy อัตโนมัติ (production จริง)
  └── fix/xxx       ← แก้ bug
  └── feature/xxx   ← เพิ่ม feature ใหม่
  └── schema/xxx    ← แก้ database schema
```

---

## Workflow วันต่อวัน

### แก้ Bug / เพิ่ม Feature (ไม่แตะ DB)

```bash
# 1. สร้าง branch ใหม่
git checkout main
git pull                          # sync ให้ main ล่าสุดก่อนเสมอ
git checkout -b fix/ชื่อปัญหา     # เช่น fix/survey-validation

# 2. แก้งาน + ทดสอบ local
npm run dev

# 3. push branch นี้ (ยังไม่ขึ้น production)
git add .
git commit -m "fix: อธิบายสั้นๆ ว่าแก้อะไร"
git push origin fix/ชื่อปัญหา
# Vercel จะสร้าง Preview URL ให้อัตโนมัติ → ทดสอบที่นั่นก่อน

# 4. โอเคแล้ว → merge เข้า main → production อัพเดท
git checkout main
git merge fix/ชื่อปัญหา
git push
```

---

### แก้ Database Schema (ระวังที่สุด)

```bash
# 1. สร้าง branch ใหม่
git checkout -b schema/เพิ่ม-column-xxx

# 2. แก้ prisma/schema.prisma

# 3. สร้าง migration file (อย่ารัน db push)
npx prisma migrate dev --name เพิ่ม_column_xxx

# 4. ตรวจ migration file ใน prisma/migrations/ ว่า SQL ถูกต้อง

# 5. ทดสอบ local ให้ผ่านก่อน
npm run dev

# 6. push และ merge เข้า main
git add .
git commit -m "schema: เพิ่ม column xxx ใน table yyy"
git push origin schema/เพิ่ม-column-xxx
git checkout main
git merge schema/เพิ่ม-column-xxx
git push
# Vercel จะรัน prisma migrate deploy อัตโนมัติตอน build
```

**ห้าม:** แก้ตารางตรงใน Supabase Dashboard — จะทำให้ schema ใน code กับ DB ไม่ตรงกัน

---

## Checklist ก่อน Merge เข้า main ทุกครั้ง

- [ ] ทดสอบใน local ผ่านแล้ว (`npm run dev`)
- [ ] ดู Preview URL จาก Vercel แล้วว่าทำงานถูกต้อง
- [ ] ถ้าแก้ schema → มี migration file ใน `prisma/migrations/` แล้ว
- [ ] commit message อธิบายชัดว่าแก้/เพิ่มอะไร

---

## ถ้า Production พัง หลัง Deploy

```bash
# วิธีที่ 1: Rollback ใน Vercel Dashboard
# Vercel → Deployments → เลือก deployment ก่อนหน้า → Redeploy

# วิธีที่ 2: Revert commit แล้ว push
git revert HEAD
git push
```

---

## Commit Message Format (ทำให้อ่าน history ง่าย)

```
fix: แก้อะไร
feature: เพิ่มอะไร
schema: เปลี่ยน DB อย่างไร
style: แก้ UI/CSS
refactor: ปรับโครงสร้าง code
```

ตัวอย่าง:
```
fix: แก้ survey form ไม่ submit เมื่อไม่เลือก province
feature: เพิ่มหน้า export รายงานเป็น CSV
schema: เพิ่ม column notes ใน PestReport
```

---

## สรุป 1 บรรทัด

```
pull main → branch ใหม่ → แก้งาน → test local → push → ดู preview → merge main → production
```
