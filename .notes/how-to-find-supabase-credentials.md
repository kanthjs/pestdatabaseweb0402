# 🔑 วิธีหาค่า Environment Variables จาก Supabase Dashboard

## ขั้นตอนที่ 1: เข้า Supabase Dashboard

1. ไปที่ [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Login เข้าบัญชีของคุณ
3. เลือก Project: **pestdatabase**

---

## ขั้นตอนที่ 2: หา `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### วิธีที่ 1: จากหน้า Project Settings (แนะนำ)

1. คลิกที่ไอคอน **⚙️ Settings** (ด้านล่างซ้าย)
2. เลือก **API**
3. คุณจะเห็น:

```
Project URL
https://cuigpgzjnvzyczbwofpr.supabase.co
```

→ นี่คือค่า **`NEXT_PUBLIC_SUPABASE_URL`**

```
Project API keys
┌─────────────────────────────────────────────────────────────┐
│ anon public                                                  │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz... │
│ [คลิกเพื่อคัดลอก]                                            │
└─────────────────────────────────────────────────────────────┘
```

→ นี่คือค่า **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**

### วิธีที่ 2: จากหน้า Home (Dashboard)

1. ไปที่หน้า **Home** ของ Project
2. มองหาส่วน **Connect to your project**
3. เลือก **App Frameworks** → **Next.js**
4. คุณจะเห็นค่าทั้งสองแสดงอยู่

---

## ขั้นตอนที่ 3: หา `DATABASE_URL` และ `DIRECT_URL`

### 3.1 ไปที่ Database Settings

1. คลิกที่ไอคอน **⚙️ Settings** (ด้านล่างซ้าย)
2. เลือก **Database**
3. Scroll ลงมาหาส่วน **Connection string**

### 3.2 คัดลอก Connection Pooler (สำหรับ `DATABASE_URL`)

คุณจะเห็น 2 แท็บ:

- **Transaction Mode** (ใช้อันนี้)
- **Session Mode**

เลือก **Transaction Mode** แล้วคัดลอก Connection String:

```
postgresql://postgres.cuigpgzjnvzyczbwofpr:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```

⚠️ **สำคัญ:** `[YOUR-PASSWORD]` คือรหัสผ่านที่คุณตั้งตอนสร้าง Project  
→ ถ้าจำไม่ได้ ให้คลิก **Reset Database Password** (อยู่ด้านล่างหน้านี้)

นี่คือค่า **`DATABASE_URL`** สำหรับ Vercel

### 3.3 คัดลอก Direct Connection (สำหรับ `DIRECT_URL`)

ในหน้าเดียวกัน มองหาส่วน **Connection parameters** หรือ **Direct connection**:

```
postgresql://postgres:[YOUR-PASSWORD]@db.cuigpgzjnvzyczbwofpr.supabase.co:5432/postgres
```

นี่คือค่า **`DIRECT_URL`** สำหรับ Prisma Migrations

---

## 📋 สรุปค่าที่คุณต้องหา (Checklist)

### ✅ ค่าที่ผมหาให้แล้ว (ไม่ต้องหาเอง)

- [x] `NEXT_PUBLIC_SUPABASE_URL` = `https://cuigpgzjnvzyczbwofpr.supabase.co`
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aWdwZ3pqbnZ6eWN6YndvZnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MTE5NDIsImV4cCI6MjA4NTQ4Nzk0Mn0.8yF828jCRMz_bzU6L9HLG8JOJ5l6I0ql9pY-PMwdtcc`

### ⚠️ ค่าที่คุณต้องหาเอง (ต้องใช้รหัสผ่าน Database)

- [ ] `DATABASE_URL` = `postgresql://postgres.cuigpgzjnvzyczbwofpr:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true`
- [ ] `DIRECT_URL` = `postgresql://postgres:[YOUR-PASSWORD]@db.cuigpgzjnvzyczbwofpr.supabase.co:5432/postgres`

---

## 🔐 ถ้าจำรหัสผ่าน Database ไม่ได้

1. ไปที่ Supabase Dashboard → Settings → Database
2. Scroll ลงมาหาปุ่ม **Reset Database Password**
3. คลิกแล้วตั้งรหัสผ่านใหม่
4. **⚠️ สำคัญมาก:** คัดลอกรหัสผ่านใหม่ไว้ทันที (จะไม่แสดงอีก)
5. นำรหัสผ่านใหม่ไปแทนที่ `[YOUR-PASSWORD]` ใน Connection String

---

## 📸 ภาพประกอบ (ตำแหน่งที่ต้องมองหา)

### หน้า API Settings

```
Settings → API
├── Project URL: https://cuigpgzjnvzyczbwofpr.supabase.co
└── Project API keys
    └── anon public: eyJhbGci...
```

### หน้า Database Settings

```
Settings → Database
├── Connection string
│   ├── Transaction Mode (ใช้อันนี้สำหรับ DATABASE_URL)
│   └── Session Mode
├── Connection parameters
│   └── Direct connection (ใช้อันนี้สำหรับ DIRECT_URL)
└── Reset Database Password (ถ้าจำรหัสผ่านไม่ได้)
```

---

## ✅ เมื่อได้ครบแล้ว

นำค่าทั้งหมดไปใส่ใน Vercel → Project Settings → Environment Variables ตามคู่มือใน `vercel-deploy-guide.md`
