# Dashboard Structure Notes

## Public Dashboard (`/dashboard`)

- totoal report
- No of report in past 30 days
- Top 5 Pest
- Map of report

## Personal Dashboard Structure (by Role)

### Route Structure

```
/dashboard           → Public Dashboard (ทุกคนเข้าได้)
/dashboard/user      → User Dashboard (ต้อง Login - USER, EXPERT, ADMIN)
/dashboard/expert    → Expert Dashboard (ต้อง Login - EXPERT, ADMIN)
/dashboard/admin     → Admin Dashboard (ต้อง Login - ADMIN เท่านั้น)
```

---

### `/dashboard/user` - for USER (Registered)

**Features:**

- total report of user
- No of report in past 30 days
- Top 5 Pest
- Map of report

---

### `/dashboard/expert` - for EXPERT

**Features:**

- ✅ **View Mode Toggle**:
  - **ALL**: ข้อมูลทั้งหมดจากทุกคนที่ผ่านการ verified แล้ว
  - **My Report**: ข้อมูลของตัวเองเท่านั้น
- ✅ **Dashboard Overview**:
  - Total reports (Filtered by view mode)
  - Reports in past 30 days
  - Top 5 Pests summary
  - Map of reports
- ✅ **Analytics**:
  - รายงานตามจังหวัด (Top 10)
  - รายงานตามศัตรูพืช (Top 10)
  - แนวโน้มรายวัน (30 วัน)
- 🗑️ **Verification Queue**: ถูกย้ายออกไปหน้าอื่น / หรือนำออก (ตามความต้องการล่าสุด)
- ✅ **Role Access Fix**: ระบบตรวจสอบ Role และลิ้งค์ไปยังหน้า Expert Dashboard ได้ถูกต้องแล้ว (ID/Email sync)

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
