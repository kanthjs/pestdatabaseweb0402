# RicePestNet 🌾

Agricultural pest monitoring system for Thailand. Built with Next.js 16, Supabase, and Prisma 7.

## Features

- 📍 **Geotagged Reports** - GPS-based pest sighting submissions
- 📊 **Analytics Dashboard** - Interactive maps, charts, and trend analysis
- ✅ **Expert Verification** - Agronomist review workflow
- 🌐 **Thai Language** - Full support for Thai provinces and data

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
| Expert | expert1@demo.com | password123 | I added this account
| User | reporter1@demo.com | password123 | I added this account
| Admin | admin1@demo.com | password123 | I added this account

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
│   ├── (main)/         # Main layout group
│   │   ├── dashboard/  # Public analytics
│   │   └── survey/     # Report form
│   ├── expert/         # Protected expert routes
│   └── api/            # API routes
├── components/         # UI components
├── lib/                # Utils (Prisma, Supabase)
└── hooks/              # Custom hooks

prisma/                 # Schema & seeds
supabase/               # Local config
```

## License

MIT
