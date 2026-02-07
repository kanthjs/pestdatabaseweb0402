# Dashboard Structure Notes

## Overview

ระบบ Dashboard แบ่งตามสิทธิ์ผู้ใช้ (Role-based) โดยมี Public Dashboard ที่ทุกคนเข้าถึงได้ และ Dashboard ส่วนตัวตาม Role

---

## Route Structure

```
/dashboard           → Public Dashboard (ทุกคนเข้าได้)
/dashboard/user      → User Dashboard (ต้อง Login - USER, EXPERT, ADMIN)
/dashboard/expert    → Expert Dashboard (ต้อง Login - EXPERT, ADMIN)
/dashboard/admin     → Admin Dashboard (ต้อง Login - ADMIN เท่านั้น)
```

---

## Public Dashboard (`/dashboard`)

**Features:**
- Total reports (ทั้งหมดในฐานข้อมูล)
- Number of reports in past 30 days
- Top 5 Pest Ranking
- Map of reports (Geographic Distribution)

---

## User Dashboard (`/dashboard/user`)

**For:** USER, EXPERT, ADMIN (ทุกคนที่ login)

**Features:**
- Total reports ของตัวเอง
- Number of reports in past 30 days (ของตัวเอง)
- Top 5 Pest (จากรายงานของตัวเอง)
- Map of reports (ของตัวเอง)

---

## Expert Dashboard (`/dashboard/expert`)

**For:** EXPERT, ADMIN

**Features:**

### View Mode Toggle
- **ALL**: ข้อมูลทั้งหมดจากทุกคนที่ผ่านการ verified แล้ว
- **My Report**: ข้อมูลของตัวเองเท่านั้น

### Dashboard Overview Tab
- Total reports (Filtered by view mode)
- Reports in past 30 days
- Top 5 Pests summary
- Map of reports

### Analytics Tab
- รายงานตามจังหวัด (Top 10)
- รายงานตามศัตรูพืช (Top 10)
- แนวโน้มรายวัน (30 วัน)

### Stats Cards
- ยืนยันวันนี้ (verified today)
- ยืนยันสัปดาห์นี้ (verified this week)
- ยืนยันทั้งหมด (total verified)

---

## Admin Dashboard (`/dashboard/admin`)

**For:** ADMIN only

**Guiding Principle:** เน้น "การจัดการ" (Management) เพื่อความปลอดภัยและความถูกต้องของข้อมูล

### System Overview Tab
- **System Stats**: Total users, experts, reports, pending
- **Quick Actions**: Access to key management functions

### User Management Tab
- ดูรายชื่อผู้ใช้ทั้งหมด
- เปลี่ยน Role (USER ↔ EXPERT ↔ ADMIN)
- ดู Expert Requests และจัดการ (Approve/Reject)

### Reports Management Tab
- ดูรายงานทั้งหมดในระบบ
- ค้นหา/กรองรายงาน
- เปลี่ยนสถานะรายงาน (Approve/Reject/Delete)

### Activity Logs Tab
- ติดตามการกระทำที่สำคัญของ Admin (Audit Trail)
- ดูประวัติการเปลี่ยน Role, จัดการรายงาน

### Master Data Tab
- จัดการข้อมูลต้นทาง (Pests, Plants)
- เพิ่ม/แก้ไข/ลบ ข้อมูลพื้นฐาน

---

## Middleware Protection

Routes ถูกป้องกันด้วย middleware (`src/lib/supabase/middleware.ts`):

| Path | Required Role |
|------|--------------|
| `/dashboard` | None (public) |
| `/dashboard/user` | USER, EXPERT, ADMIN |
| `/dashboard/expert` | EXPERT, ADMIN |
| `/dashboard/admin` | ADMIN |

**หมายเหตุสำคัญ:** ระบบตรวจสอบ Role โดยค้นหาจาก ID ก่อน ถ้าไม่เจอจะค้นหาจาก Email (เพราะ Supabase Auth ID อาจไม่ตรงกับ UserProfile ID)

---

## Key Files Structure

```
src/app/dashboard/
├── page.tsx                    # Public Dashboard
├── DashboardClient.tsx         # Client component for public dashboard
├── actions.ts                  # Server actions for metrics
├── components/                 # Shared components
│   ├── AdvancedMap.tsx
│   ├── DashboardFilter.tsx
│   ├── MetricsCards.tsx
│   └── PestRankingChart.tsx
├── user/                       # User Dashboard
│   ├── page.tsx
│   ├── UserDashboardClient.tsx
│   └── actions.ts
├── expert/                     # Expert Dashboard
│   ├── page.tsx
│   ├── ExpertDashboardClient.tsx
│   ├── actions.ts
│   └── components/
└── admin/                      # Admin Dashboard
    ├── page.tsx
    ├── AdminDashboardClient.tsx
    ├── actions.ts
    └── components/
        ├── ActivityLogsTable.tsx
        ├── MasterDataTab.tsx
        ├── ReportsTable.tsx
        └── UsersTable.tsx
```

---

## Login & Navigation Flow

1. **Login** (`src/app/login/actions.ts`):
   - ตรวจสอบ Role จาก UserProfile
   - Redirect ไปยัง dashboard ที่เหมาะสม:
     - ADMIN → `/dashboard/admin`
     - EXPERT → `/dashboard/expert`
     - USER → `/dashboard/user`

2. **UserMenu** (`src/components/UserMenu.tsx`):
   - แสดง link ไปยัง Dashboard ตาม Role
   - ใช้ props role จาก Navbar

3. **Navbar** (`src/components/Navbar.tsx`):
   - Fetch role จาก `/api/user-role`
   - ส่ง role ไปให้ UserMenu

---

## Common Issues & Solutions

### Issue: User ID Mismatch
**Problem:** Supabase Auth user ID ไม่ตรงกับ UserProfile ID ใน database
**Solution:** ค้นหาด้วย Email เป็นสำรองเมื่อค้นหาด้วย ID ไม่เจอ

**Files affected:**
- `src/app/login/actions.ts`
- `src/app/dashboard/expert/actions.ts` (checkExpertAccess)
- `src/app/dashboard/admin/actions.ts` (checkAdminAccess)
- `src/lib/supabase/middleware.ts`

### Issue: Missing UI Components
**Problem:** Build error เนื่องจากขาด UI components
**Solution:** สร้างไฟล์ components ที่ขาดใน `src/components/ui/`

**Components needed:**
- `scroll-area.tsx` → `@radix-ui/react-scroll-area`
- `select.tsx` → `@radix-ui/react-select`
- `table.tsx` → `@radix-ui/react-table`

---

## Database Schema Related

### UserRole Enum
```prisma
enum UserRole {
  ADMIN    // ผู้ดูแลระบบ
  EXPERT   // ผู้เชี่ยวชาญ
  USER     // ผู้ใช้ทั่วไป
}
```

### ExpertStatus Enum
```prisma
enum ExpertStatus {
  NONE      // ไม่ได้ขอเป็นผู้เชี่ยวชาญ
  PENDING   // รอการอนุมัติ
  APPROVED  // อนุมัติแล้ว
  REJECTED  // ปฏิเสธ
}
```

---

## API Endpoints

- `GET /api/user-role` → ดู role ของผู้ใช้ปัจจุบัน
- `GET /api/notifications` → ดูการแจ้งเตือน
- `GET /api/pending-count` → ดูจำนวนรายงานรอตรวจสอบ (สำหรับ expert/admin)

---

## Test Users (Demo)

| Email | Role | Password |
|-------|------|----------|
| admin1@demo.com | ADMIN | (demo) |
| expert1@demo.com | EXPERT | (demo) |
| user1@demo.com | USER | (demo) |

**Note:** UserProfile ID อาจไม่ตรงกับ Supabase Auth ID เนื่องจากการสร้าง user ในช่วงทดสอบ
