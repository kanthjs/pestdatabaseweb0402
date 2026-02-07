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

**Guiding Principle:** เน้น "การจัดการ" (Management) เพื่อความปลอดภัยและความถูกต้องของข้อมูล มากกว่าการแก้ไขข้อมูลดิบ (Raw Data Editing) โดยตรงใน Database

**Features Roadmap:**

- **Phase 1: System Overview & Users (Done ✅)**
  - ✅ **System Stats**: Total users, experts, reports, approved.
  - ✅ **User Management**: ดูรายชื่อผู้ใช้ทั้งหมด และเปลี่ยน Role (USER ↔ EXPERT ↔ ADMIN).
  - ✅ **Access Control**: ระบบป้องกันการเข้าถึงด้วย Middleware.

- **Phase 2: Moderation & Requests (Next ⏳)**
  - ⏳ **Report Moderation**: ดูรายงานทั้งหมดในระบบ, ค้นหา/กรอง, และสามารถสั่ง Delete (Soft Delete) หรือแก้ไขสถานะ (Approve/Reject) รายงานที่มีปัญหาได้.
  - ⏳ **Expert Request Management**: จัดการคำขอเป็นผู้เชี่ยวชาญจากผู้ใช้ทั่วไป (Approve/Reject).
  - ⏳ **Activity Logs**: ติดตามการกระทำที่สำคัญของ Admin เพื่อความโปร่งใส (Audit Trail).

- **Phase 3: Master Data & System Settings (Future 🚀)**
  - 🚀 **Master Data Management**: หน้าจอสำหรับเพิ่ม/แก้ไข/ลบ ข้อมูลต้นทาง เช่น รายชื่อศัตรูพืช (Pests), รายชื่อพืช (Plants), และข้อมูลพื้นฐานอื่นๆ โดยไม่ต้องใช้ SQL.
  - 🚀 **System Health & Logs**: ดู Database Status, Traffic วันนี้ และข้อมูลความปลอดภัยเบื้องต้น.
  - 🚀 **Export Tools**: ระบบ Export ข้อมูลเป็น CSV สำหรับการนำไปวิเคราะห์ต่อภายนอก.

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
