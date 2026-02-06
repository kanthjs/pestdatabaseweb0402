---
name: RicePestNet
version: 1.0.0
description: Next.js 16 + Prisma 7 agricultural pest survey app for Thailand
---

# RicePestNet Skill

## Quick Reference

| Item | Value |
|------|-------|
| **Framework** | Next.js 16 (App Router) |
| **Database** | PostgreSQL via Supabase |
| **ORM** | Prisma 7 |
| **Auth** | Supabase Auth (`@supabase/ssr`) |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **State** | TanStack Query |
| **Maps** | Leaflet |
| **Charts** | Recharts |

## Common Commands

```bash
# Dev server
npm run dev

# Database
npx supabase start          # Start local Supabase
npx prisma db push          # Push schema changes
npx prisma db seed          # Seed master data
npx prisma migrate dev      # Create migration (dev only)
npx prisma studio           # Open DB GUI

# Build
npm run build
```

## Project Structure

```
src/
├── app/                    # Next.js routes
│   ├── (main)/            # Group: main layout
│   │   ├── dashboard/     # Public analytics
│   │   ├── survey/        # Pest report form
│   │   └── page.tsx       # Landing
│   ├── expert/            # Expert routes (protected)
│   ├── login/             # Auth pages
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   └── *.tsx              # App components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   └── supabase/          # Supabase clients
└── types/                 # TypeScript types

prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Seed data
```

## Database Schema (Key Models)

```prisma
model User { id, email, role: USER|EXPERT }
model PestReport { id, latitude, longitude, severity, verifiedBy }
model Province { id, name, region }
model Pest { id, name, description }
model Plant { id, name }
```

## Coding Conventions

### 1. Server Actions
- Use `'use server'` at top of file
- Place in `src/app/**/actions.ts`
- Revalidate with `revalidatePath()` after mutations

```typescript
'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createReport(data: FormData) {
  // ... validation & creation
  revalidatePath('/dashboard')
}
```

### 2. Data Fetching
- Use TanStack Query for client components
- Use direct Prisma calls in Server Components

```typescript
// Server Component
const reports = await prisma.pestReport.findMany()

// Client Component
const { data } = useQuery({ queryKey: ['reports'], queryFn: fetchReports })
```

### 3. Route Protection
- Use `middleware.ts` for auth checks
- Expert routes under `/expert/*`

### 4. Forms
- Use `react-hook-form` + `zod` for validation
- Use shadcn/ui form components

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

## Test Accounts (Local)

| Role | Email | Password |
|------|-------|----------|
| Expert | expert@demo.com | password123 |
| User | user@demo.com | password123 |

## Critical Rules

1. **Never** use `prisma migrate dev` in production - use `migrate deploy`
2. Always run `npx prisma db seed` after fresh setup for master data
3. Use `revalidatePath()` after Server Action mutations
4. Keep client components minimal - leverage Server Components
