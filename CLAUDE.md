# CLAUDE.md - Pest Database Web Project

## Project Overview
ระบบฐานข้อมูลศัตรูพืชออนไลน์ (Pest Reporting System) สำหรับการรายงานและติดตามการระบาดของศัตรูพืชในประเทศไทย

## Tech Stack
- **Framework:** Next.js 16 (App Router) + TypeScript
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma 7 with `@prisma/adapter-pg` driver adapter
- **Auth:** Supabase Auth
- **UI:** Tailwind CSS 4 + Radix UI + shadcn/ui components
- **Maps:** Leaflet + react-leaflet
- **Charts:** Recharts
- **Deployment:** Vercel

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages (admin/expert/user)
│   ├── survey/            # Survey form (pest reporting)
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── profile/           # User profile
│   ├── my-reports/        # User's own reports
│   ├── expert/review/     # Expert review queue
│   └── reports/[id]/      # Individual report view
├── components/            # Shared components
│   ├── ui/               # shadcn/ui components
│   └── landing/          # Landing page components
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client with PrismaPg adapter
│   ├── supabase/         # Supabase clients (client.ts, server.ts, middleware.ts)
│   ├── permissions.ts    # Role-based permissions
│   └── validation.ts     # Zod schemas
└── types/                # TypeScript type definitions
prisma/
├── schema.prisma         # Database schema
├── migrations/           # Migration files
└── seed.ts              # Seed data
```

## Common Commands
```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run lint            # Run ESLint

# Prisma
npx prisma generate     # Generate Prisma Client
npx prisma migrate dev  # Create new migration (local)
npx prisma migrate deploy  # Apply migrations (production)
npx prisma db seed      # Seed database
npx prisma studio       # Open Prisma Studio
```

## Environment Variables
```env
DATABASE_URL=           # Supabase pooler (port 6543) for runtime queries
DIRECT_URL=             # Session mode pooler (port 5432) for migrations
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Critical Rules (MUST FOLLOW)

### 1. NEVER Import Prisma in middleware.ts
- Edge Runtime cannot bundle Prisma (>1MB limit)
- middleware.ts should ONLY: refresh Supabase session + check authentication
- Role-based access control MUST be in server actions/pages (Node.js runtime)

### 2. Prisma 7 Configuration
- NO `url`/`directUrl` in schema.prisma - Prisma 7 uses `prisma.config.ts` instead
- Runtime connection uses PrismaPg adapter in `lib/prisma.ts`
- Migrations use DIRECT_URL from prisma.config.ts

### 3. Supabase Connection Modes
| Mode | Host | Port | Use For |
|------|------|------|---------|
| Transaction (pgbouncer) | pooler.supabase.com | **6543** | DATABASE_URL - runtime queries |
| **Session Mode** | pooler.supabase.com | **5432** | DIRECT_URL - migrations |
| Direct | db.xxx.supabase.co | 5432 | NEVER use on Vercel |

### 4. Prevent Static Prerender Errors
- Pages that query Prisma MUST have `export const dynamic = 'force-dynamic'`
- This prevents Next.js from trying to prerender during build time

### 5. Database Schema Key Models
- **UserProfile:** Links to Supabase auth.users UUID, has role (ADMIN/EXPERT/USER)
- **PestReport:** Main reporting table with status (PENDING/APPROVED/REJECTED)
- **Plant, Pest, Province:** Master data tables
- **Notification:** User notifications
- **ActivityLog:** Admin audit logs

## User Roles & Permissions
- **ADMIN:** Full access, manage users, approve expert requests
- **EXPERT:** Review and verify pest reports
- **USER:** Submit reports, view own reports

## Code Patterns
- Server Actions: Located in `actions.ts` files next to pages
- Form validation: Use Zod schemas from `lib/validation.ts`
- Auth check: Use `createClient()` from `@/lib/supabase/server` in server components
- Client auth: Use `createBrowserClient()` from `@/lib/supabase/client`
