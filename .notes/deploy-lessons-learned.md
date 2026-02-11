# บทเรียนการ Deploy: Vercel + Supabase + Prisma 7

> บันทึกจากการ deploy จริงเมื่อ 11 ก.พ. 2569
> ใช้เป็น reference สำหรับ project นี้และ project ถัดไป

---

## ปัญหาที่ 1: Prerender Error — `PrismaClientKnownRequestError P2021`

**Error:**
```
Error occurred prerendering page "/survey"
The table `public.PestReport` does not exist in the current database.
```

**สาเหตุ:** Next.js พยายาม render page เป็น static ตอน build แต่ Prisma ต้องการ database connection ซึ่งไม่มีตอน build time

**แก้:** เพิ่ม 1 บรรทัดในทุก page ที่ query database:
```ts
export const dynamic = 'force-dynamic';
```

**กฎ:** ทุก `page.tsx` ที่ใช้ Prisma/database ต้องมีบรรทัดนี้เสมอ

---

## ปัญหาที่ 2: Edge Function Size เกิน 1MB

**Error:**
```
The Edge Function "middleware" size is 1.35 MB and your plan size limit is 1 MB.
```

**สาเหตุ:** `src/lib/supabase/middleware.ts` import Prisma Client — Prisma เป็น Node.js library ขนาดใหญ่ ไม่ compatible กับ Edge Runtime และทำให้ bundle ใหญ่เกินกำหนด

**แก้:** ลบ Prisma ออกจาก middleware ทั้งหมด

middleware ทำแค่ 2 อย่างเท่านั้น:
1. Refresh Supabase session token
2. เช็คว่า user login อยู่ไหม (redirect to `/login` ถ้าไม่ได้ login)

Role-based access control → ย้ายไปใน server actions แต่ละ page (รันบน Node.js ปกติ)

```ts
// ✅ middleware ที่ถูกต้อง — ไม่มี Prisma
export async function updateSession(request: NextRequest) {
    // ... refresh session ...

    const protectedPaths = ["/dashboard/admin", "/review", "/admin"];
    const isProtected = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isProtected && !user) {
        // redirect to login
    }

    return supabaseResponse;
}
```

---

## ปัญหาที่ 3: ตาราง DB ไม่มีใน Production

**Error:**
```
The table `public.PestReport` does not exist in the current database.
```

**สาเหตุ:** `prisma migrate deploy` ไม่เคยถูกรันบน production — ตาราง schema มีใน local แต่ยังไม่ถูก apply ขึ้น Supabase จริง

**แก้:** เพิ่ม migrate deploy ใน `package.json` build script:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

**และ** รัน manual ครั้งแรกจาก local เพื่อ initialize DB:
```bash
DIRECT_URL="postgresql://..." npx prisma migrate deploy
```

---

## ปัญหาที่ 4: Vercel เชื่อมต่อ DB ไม่ได้ระหว่าง migrate

**Error:**
```
P1001: Can't reach database server at `db.xxx.supabase.co:5432`
```

**สาเหตุ:** `DIRECT_URL` ชี้ไปที่ direct connection (`db.xxx.supabase.co:5432`) ซึ่ง Supabase block จาก Vercel build servers

**แก้:** เปลี่ยน `DIRECT_URL` ให้ใช้ **Session Mode Pooler** แทน

### Supabase Connection Modes (จำให้ขึ้นใจ)

| ตัวแปร | Host | Port | Mode | ใช้สำหรับ |
|--------|------|------|------|----------|
| `DATABASE_URL` | `pooler.supabase.com` | **6543** | Transaction (pgbouncer) | Runtime queries |
| `DIRECT_URL` | `pooler.supabase.com` | **5432** | Session | Migrations ✅ |
| ❌ อย่าใช้ | `db.xxx.supabase.co` | 5432 | Direct | Vercel เข้าไม่ได้ |

**ตัวอย่าง URL ที่ถูกต้อง:**
```
# DATABASE_URL — transaction pooler (port 6543)
postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true

# DIRECT_URL — session pooler (port 5432, same host, no pgbouncer param)
postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-REGION.pooler.supabase.com:5432/postgres
```

---

## สรุป Checklist ก่อน Deploy ครั้งถัดไป

- [ ] ทุก page ที่ใช้ Prisma → มี `export const dynamic = 'force-dynamic'`
- [ ] `middleware.ts` → ไม่มี import Prisma เลย
- [ ] `DIRECT_URL` ใน Vercel → ใช้ session mode pooler (port 5432, pooler host)
- [ ] `DATABASE_URL` ใน Vercel → ใช้ transaction mode (port 6543, `?pgbouncer=true`)
- [ ] `package.json` build script → มี `prisma migrate deploy`
- [ ] รัน `prisma migrate deploy` manual ครั้งแรกก่อน deploy จาก local

---

## Prisma 7 Config สำคัญ

Prisma 7 เปลี่ยน approach — ไม่รองรับ `url`/`directUrl` ใน `schema.prisma` อีกต่อไป

```ts
// prisma.config.ts ✅
export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: process.env["DIRECT_URL"], // ใช้ DIRECT_URL สำหรับ migrations
    },
});

// src/lib/prisma.ts ✅
const pool = new Pool({ connectionString: process.env.DATABASE_URL }); // ใช้ DATABASE_URL สำหรับ runtime
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
```
