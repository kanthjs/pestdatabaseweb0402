# Dashboard Development Guide

## Overview

This skill covers the dashboard system for RicePestNet, a role-based analytics and management interface.

## Dashboard Types

### 1. Public Dashboard (`/dashboard`)
- **Access**: Everyone (no login required)
- **Features**:
  - Total reports count (all time)
  - Reports in past 30 days
  - Top 5 pest ranking
  - Geographic map of all verified reports

### 2. User Dashboard (`/dashboard/user`)
- **Access**: Logged-in users (USER, EXPERT, ADMIN)
- **Features**:
  - Personal report statistics
  - My reports in past 30 days
  - Top 5 pests from my reports
  - Map of my reports

### 3. Expert Dashboard (`/dashboard/expert`)
- **Access**: EXPERT and ADMIN roles only
- **Features**:
  - View mode toggle (ALL vs My Report)
  - Analytics: Reports by province, pest, daily trends
  - Stats: Verified today/week/total
  - Full dashboard with map and charts

### 4. Admin Dashboard (`/dashboard/admin`)
- **Access**: ADMIN role only
- **Features**:
  - System overview statistics
  - User management (view, change roles)
  - Expert request management
  - Reports moderation
  - Activity logs (audit trail)
  - Master data management (pests, plants)

## Key Implementation Details

### User ID Handling

**Problem**: Supabase Auth user ID often doesn't match UserProfile ID in database.

**Solution**: Always implement dual lookup:
```typescript
// Try by ID first
let profile = await prisma.userProfile.findUnique({
    where: { id: user.id }
});

// Fallback to email lookup
if (!profile && user.email) {
    profile = await prisma.userProfile.findUnique({
        where: { email: user.email }
    });
}
```

**Files requiring this pattern**:
- `src/app/login/actions.ts` - Login redirect
- `src/app/dashboard/expert/actions.ts` - checkExpertAccess()
- `src/app/dashboard/admin/actions.ts` - checkAdminAccess()
- `src/lib/supabase/middleware.ts` - Route protection

### Login Flow

1. User submits login form
2. Server validates credentials
3. Server fetches user profile (with ID/Email fallback)
4. Server redirects based on role:
   - ADMIN → `/dashboard/admin`
   - EXPERT → `/dashboard/expert`
   - USER → `/dashboard/user`

### Navigation

**UserMenu** (`src/components/UserMenu.tsx`):
- Receives `role` prop from Navbar
- Links to appropriate dashboard based on role
- Uses same role constants as middleware

**Navbar** (`src/components/Navbar.tsx`):
- Fetches role from `/api/user-role` endpoint
- Passes role to UserMenu
- Updates on auth state changes

### Middleware Protection

Routes are protected in `src/lib/supabase/middleware.ts`:

```typescript
const protectedRoutes = [
    { path: "/dashboard/admin", roles: ["ADMIN"] },
    { path: "/dashboard/expert", roles: ["EXPERT", "ADMIN"] },
    { path: "/dashboard/user", roles: ["USER", "EXPERT", "ADMIN"] },
];
```

Unauthorized access redirects to `/dashboard` (public).

### Database Schema

**UserRole Enum**:
```prisma
enum UserRole {
  ADMIN    // ผู้ดูแลระบบ
  EXPERT   // ผู้เชี่ยวชาญ
  USER     // ผู้ใช้ทั่วไป
}
```

**ExpertStatus Enum**:
```prisma
enum ExpertStatus {
  NONE      // ไม่ได้ขอเป็นผู้เชี่ยวชาญ
  PENDING   // รอการอนุมัติ
  APPROVED  // อนุมัติแล้ว
  REJECTED  // ปฏิเสธ
}
```

## Common Tasks

### Adding a New Dashboard Component

1. Create component in appropriate location:
   - Shared: `src/app/dashboard/components/`
   - Admin only: `src/app/dashboard/admin/components/`

2. Import shadcn/ui components as needed:
   ```bash
   npx shadcn add card table tabs
   ```

3. Use server actions for data fetching:
   ```typescript
   // In actions.ts
   "use server";
   export async function getMyData() {
       // Check access first
       await checkAccess();
       // Fetch data
       return data;
   }
   ```

### Adding a New Protected Route

1. Add to middleware protectedRoutes:
   ```typescript
   { path: "/my-new-route", roles: ["ADMIN"] }
   ```

2. Create access check function:
   ```typescript
   async function checkMyRouteAccess() {
       const user = await getCurrentUser();
       if (!user || user.role !== "ADMIN") {
           redirect("/dashboard");
       }
       return user;
   }
   ```

### Debugging Role Issues

Enable console logs in:
- `src/app/login/actions.ts` - Login flow
- `src/components/Navbar.tsx` - Role fetching
- `src/components/UserMenu.tsx` - Role prop
- `src/lib/supabase/middleware.ts` - Access control

Check database:
```sql
SELECT id, email, role FROM "UserProfile" WHERE email = 'user@example.com';
```

## Testing

Use provided test scripts:
- `test-public-dash.mjs` - Test public dashboard
- `test-expert-user-dash.mjs` - Test expert/user dashboard
- `test-admin-db-logic.mjs` - Test admin functions
- `test-master-data.mjs` - Test master data operations

## Related Files

- `.notes/dashboard_tomake.md` - Detailed feature notes
- `docs/ENVIRONMENT_VARIABLES.md` - Environment setup
- `prisma/schema.prisma` - Database schema
