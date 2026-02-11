# 🚀 Vercel Deploy Guide — TRPMN (RicePestNet)

## ขั้นตอนที่ 1: เตรียม Environment Variables

ใน Vercel Dashboard → Project Settings → Environment Variables ให้เพิ่มค่าเหล่านี้:

### 🔴 ค่าที่ต้องใส่ (Required)

| ชื่อ Variable | ค่าที่ต้องใส่ | หมายเหตุ |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true` | ใช้ Connection Pooler (Transaction Mode) |
| `DIRECT_URL` | `postgresql://postgres:[PASSWORD]@db.cuigpgzjnvzyczbwofpr.supabase.co:5432/postgres` | Direct Connection สำหรับ Prisma Migrate |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://cuigpgzjnvzyczbwofpr.supabase.co` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aWdwZ3pqbnZ6eWN6YndvZnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MTE5NDIsImV4cCI6MjA4NTQ4Nzk0Mn0.8yF828jCRMz_bzU6L9HLG8JOJ5l6I0ql9pY-PMwdtcc` | Anon Key (public) |

### 🟡 ค่าที่ควรใส่ (Recommended)

| ชื่อ Variable | ค่าที่ต้องใส่ | หมายเหตุ |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | ใส่ URL จริงของเว็บบน Vercel (จะได้หลัง Deploy ครั้งแรก) |
| `ALLOWED_ORIGIN` | `https://your-project.vercel.app` | เพื่อความปลอดภัย CORS (ใส่โดเมนจริง) |
| `RESEND_API_KEY` | *(ถ้ามี)* | สำหรับส่ง Email Notification — ข้ามได้ถ้ายังไม่ต้องการ |

> ⚠️ **สำคัญ:** `DATABASE_URL` ต้องเป็น **Connection Pooler URL** (port 6543) ไม่ใช่ Direct URL  
> เพราะ Vercel Serverless Functions ใช้ Connection Pooling

---

## ขั้นตอนที่ 2: ตั้งค่า Supabase Authentication

ไปที่ Supabase Dashboard → Authentication → URL Configuration:

1. **Site URL** → ใส่ `https://your-project.vercel.app`
2. **Redirect URLs** → เพิ่ม:
   - `https://your-project.vercel.app/**`
   - `https://your-project.vercel.app/login`
   - `https://your-project.vercel.app/signup`

> ⚠️ ถ้าไม่ตั้งค่านี้ ระบบ Login/Signup จะไม่ทำงาน!

---

## ขั้นตอนที่ 3: Deploy บน Vercel

### วิธี A: ผ่าน Vercel Dashboard (แนะนำ)

1. ไปที่ [vercel.com/new](https://vercel.com/new)
2. เลือก **Import Git Repository**
3. เลือก repo `kanthjs/pestdatabaseweb0402`
4. ตั้งค่า:
   - **Framework Preset:** Next.js (จะตรวจจับอัตโนมัติ)
   - **Root Directory:** `./` (default)
   - **Build Command:** `prisma generate && next build` (จะตรวจจับจาก package.json)
   - **Output Directory:** `.next` (default)
5. เพิ่ม Environment Variables ทั้งหมดจาก ขั้นตอนที่ 1
6. กด **Deploy**

### วิธี B: ผ่าน Vercel CLI

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (จาก project directory)
cd d:\Github\pestdatabaseweb0402
vercel

# สำหรับ Production deployment
vercel --prod
```

---

## ขั้นตอนที่ 4: หลัง Deploy สำเร็จ

### 4.1 อัปเดต Environment Variables

เมื่อได้ URL จริง (เช่น `https://pestdatabaseweb0402.vercel.app`):

1. กลับไป Vercel → Settings → Environment Variables
2. อัปเดต `NEXT_PUBLIC_APP_URL` และ `ALLOWED_ORIGIN` เป็น URL จริง
3. กลับไป Supabase Dashboard → Authentication → URL Configuration → อัปเดต Site URL

### 4.2 อัปเดต Sitemap URL

ไฟล์ `public/robots.txt` — เปลี่ยน Sitemap URL ให้ตรงกับโดเมนจริง

### 4.3 ทดสอบ

- [ ] หน้าแรก (Landing Page) แสดงผลถูกต้อง
- [ ] Login/Signup ทำงานได้
- [ ] Survey Form กรอกข้อมูลและส่งได้
- [ ] Dashboard แสดงข้อมูลถูกต้อง
- [ ] แผนที่ (Leaflet) โหลดได้
- [ ] รูปภาพแสดงผลครบ
- [ ] Favicon แสดงถูกต้อง

---

## ⚠️ ปัญหาที่อาจเจอ

### 1. Prisma Client ไม่ถูกสร้าง

**อาการ:** Error `Cannot find module '@prisma/client'`  
**แก้ไข:** ตรวจสอบว่า build script เป็น `prisma generate && next build`

### 2. Database Connection Timeout

**อาการ:** Error `Connection terminated unexpectedly`  
**แก้ไข:** ต้องใช้ Connection Pooler URL (port 6543) ไม่ใช่ Direct URL

### 3. Login ไม่ทำงาน

**อาการ:** Redirect กลับมาหน้า Login ตลอด  
**แก้ไข:** ตรวจสอบ Supabase → Auth → URL Configuration → Redirect URLs

### 4. Middleware ใช้ Prisma (Edge Runtime)

**อาการ:** Error เกี่ยวกับ Prisma ไม่ทำงานบน Edge Runtime  
**แก้ไข:** อาจต้องย้าย Prisma query ออกจาก middleware ไปใช้ API Route แทน  
(ปัญหานี้อาจเกิดขึ้นได้ — ต้องทดสอบตอน Deploy จริง)

---

## 📋 สรุปค่าที่ต้องเตรียม

ก่อน Deploy คุณต้องมี:

1. ✅ Vercel Account (สมัครแล้ว)
2. ✅ GitHub Repo (เชื่อมต่อแล้ว)
3. ✅ Supabase Project URL: `https://cuigpgzjnvzyczbwofpr.supabase.co`
4. ✅ Supabase Anon Key: (ดูด้านบน)
5. ⚠️ **Database Password** — ต้องใช้รหัสผ่านที่ตั้งตอนสร้าง Supabase Project
6. ⚠️ **Supabase Auth Redirect URLs** — ต้องอัปเดตหลัง Deploy ครั้งแรก
