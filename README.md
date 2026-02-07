# RicePestNet 🌾

Agricultural pest monitoring system for Thailand. Built with Next.js 16, Supabase, and Prisma 7.

## Features

- 📍 **Geotagged Reports** - GPS-based pest sighting submissions
- 📊 **Analytics Dashboard** - Interactive maps, charts, and trend analysis
- ✅ **Expert Verification** - Agronomist review workflow
- 🌐 **Thai Language** - Full support for Thai provinces and data
- 🔐 **Role-based Access** - User, Expert, and Admin dashboards

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Supabase
- **ORM**: Prisma 7
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Maps**: Leaflet
- **Charts**: Recharts

## Quick Start

### Prerequisites

- Node.js 20+
- Docker Desktop
- Supabase CLI: `npm install -g supabase`

### Setup

```bash
# 1. Clone
git clone https://github.com/yourusername/ricepestnet.git
cd ricepestnet

# 2. Install
npm install

# 3. Start local Supabase
npx supabase start

# 4. Setup env (copy from Supabase output)
cp .env.example .env

# 5. Init database
npx prisma db push
npx prisma db seed

# 6. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin1@demo.com | password123 |
| Expert | expert1@demo.com | password123 |
| User | user1@demo.com | password123 |

## Dashboard Structure

```
/dashboard           → Public Dashboard (ทุกคน)
/dashboard/user      → User Dashboard (ต้อง Login)
/dashboard/expert    → Expert Dashboard (EXPERT, ADMIN)
/dashboard/admin     → Admin Dashboard (ADMIN only)
```

See `.notes/dashboard_tomake.md` for detailed documentation.

## Database Workflow

```bash
# Development
npx prisma migrate dev --name description    # Create & apply migration
npx prisma studio                            # View/edit data

# Production
npx prisma migrate deploy                    # Apply migrations only
```

⚠️ **Never** use `migrate dev` on production databases.

## Project Structure

```
src/
├── app/                 # Next.js routes
│   ├── dashboard/       # Dashboard routes (public, user, expert, admin)
│   ├── survey/          # Report form
│   ├── expert/          # Expert review workflow
│   └── api/             # API routes
├── components/          # UI components
├── lib/                 # Utils (Prisma, Supabase)
└── hooks/               # Custom hooks

prisma/                  # Schema & seeds
supabase/                # Local config
.notes/                  # Development notes
```

## Important Notes for Developers

### User ID Mismatch Issue
Supabase Auth user ID may not match UserProfile ID in database. The system handles this by:
1. First lookup by ID
2. If not found, lookup by Email as fallback

Affected files:
- `src/app/login/actions.ts`
- `src/app/dashboard/expert/actions.ts`
- `src/app/dashboard/admin/actions.ts`
- `src/lib/supabase/middleware.ts`

### Role-based Access Control
Middleware protects routes based on user role:
- `/dashboard` - Public
- `/dashboard/user` - USER, EXPERT, ADMIN
- `/dashboard/expert` - EXPERT, ADMIN
- `/dashboard/admin` - ADMIN only

## License

MIT
