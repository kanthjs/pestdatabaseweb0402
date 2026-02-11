# 🚀 Deploy ขึ้น Vercel — 5 นาทีเสร็จ

## ขั้นตอนที่ 1: Import Project

1. ไปที่ [https://vercel.com/new](https://vercel.com/new)
2. คลิก **Import Git Repository**
3. เลือก `kanthjs/pestdatabaseweb0402`
4. คลิก **Import**

---

## ขั้นตอนที่ 2: ใส่ Environment Variables

ในหน้า Configure Project → กด **Environment Variables**

**คัดลอกค่าเหล่านี้ไปวางทีละตัว:**

### Variable 1

```
Name: DATABASE_URL
Value: postgresql://postgres.cuigpgzjnvzyczbwofpr:UZMr8zxYCKxIqVeK@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Variable 2

```
Name: DIRECT_URL
Value: postgresql://postgres:UZMr8zxYCKxIqVeK@db.cuigpgzjnvzyczbwofpr.supabase.co:5432/postgres
```

### Variable 3

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://cuigpgzjnvzyczbwofpr.supabase.co
```

### Variable 4

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aWdwZ3pqbnZ6eWN6YndvZnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MTE5NDIsImV4cCI6MjA4NTQ4Nzk0Mn0.8yF828jCRMz_bzU6L9HLG8JOJ5l6I0ql9pY-PMwdtcc
```

> 💡 **เคล็ดลับ:** เปิดไฟล์ `.notes/.env.vercel.READY` แล้วคัดลอกค่าจากไฟล์นั้นได้เลย!

---

## ขั้นตอนที่ 3: Deploy

1. ตรวจสอบว่าใส่ Environment Variables ครบทั้ง 4 ตัว
2. คลิกปุ่ม **Deploy** สีน้ำเงิน
3. รอประมาณ 2-3 นาที (Vercel จะ build และ deploy ให้อัตโนมัติ)

---

## ขั้นตอนที่ 4: หลัง Deploy สำเร็จ

### 4.1 คัดลอก URL ของเว็บ

เมื่อ Deploy เสร็จ คุณจะได้ URL เช่น:

```
https://pestdatabaseweb0402.vercel.app
```

### 4.2 อัปเดต Supabase Auth Settings

1. ไปที่ [Supabase Dashboard → Authentication → URL Configuration](https://supabase.com/dashboard/project/cuigpgzjnvzyczbwofpr/auth/url-configuration)
2. ตั้งค่าดังนี้:

**Site URL:**

```
https://pestdatabaseweb0402.vercel.app
```

**Redirect URLs (เพิ่มทั้ง 3 บรรทัด):**

```
https://pestdatabaseweb0402.vercel.app/**
https://pestdatabaseweb0402.vercel.app/login
https://pestdatabaseweb0402.vercel.app/signup
```

1. คลิก **Save**

### 4.3 อัปเดต Environment Variables ใน Vercel (Optional แต่แนะนำ)

1. กลับไปที่ Vercel → Project Settings → Environment Variables
2. เพิ่ม 2 ตัวนี้:

```
Name: NEXT_PUBLIC_APP_URL
Value: https://pestdatabaseweb0402.vercel.app
```

```
Name: ALLOWED_ORIGIN
Value: https://pestdatabaseweb0402.vercel.app
```

1. คลิก **Redeploy** (ไปที่ Deployments → คลิก ... → Redeploy)

---

## ✅ ทดสอบว่าทำงานถูกต้อง

เปิดเว็บที่ URL ที่ได้ แล้วทดสอบ:

- [ ] หน้าแรกโหลดได้
- [ ] Login/Signup ทำงานได้
- [ ] Survey Form กรอกและส่งได้
- [ ] Dashboard แสดงข้อมูล
- [ ] แผนที่แสดงผล
- [ ] รูปภาพโหลดได้

---

## 🆘 ถ้าเจอปัญหา

### ปัญหา: Build Failed

→ ดู Build Logs ใน Vercel → มักจะเป็นเรื่อง Environment Variables ไม่ครบ

### ปัญหา: Login ไม่ทำงาน

→ ตรวจสอบ Supabase Auth Redirect URLs ว่าตั้งค่าถูกต้องหรือยัง

### ปัญหา: Database Connection Error

→ ตรวจสอบ `DATABASE_URL` ว่าใช้ Connection Pooler (port 6543) หรือเปล่า

---

## 🎉 เสร็จแล้ว

เว็บของคุณออนไลน์แล้วที่: `https://pestdatabaseweb0402.vercel.app`

**Next Steps:**

- แชร์ Link ให้ทีมทดสอบ
- ตั้งค่า Custom Domain (ถ้ามี)
- เพิ่ม Google Analytics (ถ้าต้องการ)
