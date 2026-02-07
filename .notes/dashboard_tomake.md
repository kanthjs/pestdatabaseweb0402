# Dashboard Structure Notes

## Public Dashboard (`/dashboard`)

- กราฟแท่ง "Top 5 ศัตรูพืชเฝ้าระวัง" (Pest Ranking) เพื่อบอกว่า ศัตรูพืชชนิดไหนที่คุณต้องรู้จักในตอนนี้

- ทิศทางสถานการณ์ สร้างกราฟเส้น (Trend) เพื่อบอกว่า การระบาดกำลังขยายตัวหรือเริ่มสงบลง

---

## Personal Dashboard Structure (by Role)

### Route Structure

```
/dashboard           → Public Dashboard (ทุกคนเข้าได้)
/dashboard/user         → User Dashboard (ต้อง Login - USER, EXPERT, ADMIN)
/dashboard/expert    → Expert Dashboard (ต้อง Login - EXPERT, ADMIN)
/dashboard/admin     → Admin Dashboard (ต้อง Login - ADMIN เท่านั้น)
```

---

### `/dashboard/user` - for USER (Registered)

**Features:**

- ✅ สถิติรายงานของตัวเอง (total, verified, pending, rejected)
- ✅ Timeline & History: ประวัติการรายงานล่าสุด พร้อมสถานะ
- ✅ Visual Diary: แกลเลอรีรูปภาพที่ถ่ายไว้ แยกดูตามชนิดพืช

---

### `/dashboard/expert` - for EXPERT

**Features:**

- ✅ สถิติการตรวจสอบ (pending, verified today/week, total)
- ✅ Verification Queue: รายการรายงานที่รอตรวจสอบ (เรียงจากเก่าสุด)
  - ดูรายละเอียด, อนุมัติ, หรือปฏิเสธพร้อมเหตุผล
- ✅ Analytics:
  - รายงานตามจังหวัด (Top 10)
  - รายงานตามศัตรูพืช (Top 10)
  - แนวโน้มรายวัน (30 วัน)

---

### `/dashboard/admin` - for ADMIN

**Features:**

- ✅ สถิติระบบ (total users, experts, reports, pending, expert requests)
- ✅ User Management:
  - ดูรายชื่อผู้ใช้ทั้งหมด
  - เปลี่ยน Role (USER ↔ EXPERT ↔ ADMIN)
- ✅ System Health:
  - Database status
  - Activity today
  - Security info
- ⏳ Settings: กำลังพัฒนา

---

## Middleware Protection

Routes ถูกป้องกันด้วย middleware ที่ตรวจสอบ role:

| Path | Required Role |
|------|--------------|
| `/dashboard` | None (public) |
| `/dashboard/user` | USER, EXPERT, ADMIN |
| `/dashboard/expert` | EXPERT, ADMIN |
| `/dashboard/admin` | ADMIN |

---

## Files Created

```
src/app/dashboard/
├── page.tsx                    # Public Dashboard
├── DashboardClient.tsx
├── actions.ts
├── components/
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
```
