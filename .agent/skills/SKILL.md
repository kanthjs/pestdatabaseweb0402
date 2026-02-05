---
name: RicePestNet Project
description: Next.js 16 Agricultural Pest Survey Application with Prisma 7 + PostgreSQL database for tracking rice pest outbreaks across Thailand provinces.
---

# RicePestNet Project Skill

## 🎯 Project Overview

**RicePestNet** is a web-based agricultural pest and disease monitoring system designed for Thailand. It enables farmers and agronomists to submit pest sighting reports, track pest outbreaks geographically, and access management strategies to protect rice harvests.

### Core Purpose

- **Pest Reporting**: Collect field reports on pest sightings with geolocation, severity, and incidence data
- **Data Visualization**: Map-based outbreak tracking and analytics (planned)
- **Expert Network**: Connect users with local agronomists (planned)
- **Mobile-First**: Designed for field use with GPS auto-detection

---

## 🏗️ Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **Language** | TypeScript | 5.9.3 |
| **React** | React 19 | 19.2.3 |
| **Database** | PostgreSQL | Supabase |
| **ORM** | Prisma Client | 7.3.0 |
| **Auth** | Supabase Auth (@supabase/ssr) | Latest |
| **Styling** | Tailwind CSS v4 | 4.x |
| **UI Components** | Radix UI + shadcn/ui | Latest |
| **Forms** | React Hook Form + Zod | 7.71.1 / 4.3.6 |
| **State** | TanStack Query | 5.90.20 |

---

## 📁 Project Structure

```
pestdatabaseweb0402/
├── .env                          # Environment variables (DB URLs, Supabase Keys)
├── middleware.ts                 # Next.js Middleware (Auth session refresh/protection)
├── prisma.config.ts              # Prisma 7 config
│
├── prisma/
│   ├── schema.prisma             # Schema (PestReport, UserProfile, Enums)
│   └── seed.ts                   # Seed data (Provinces, Plants, Pests, Sample Reports)
│
├── src/
│   ├── app/                      
│   │   ├── dashboard/            # Public Dashboard (Verified reports only)
│   │   │   ├── components/       # Analytics charts, Map, Filter
│   │   │   └── actions.ts        # Dashboard metrics aggregation
│   │   ├── expert/review/        # Expert Verification Queue (EXPERT/ADMIN only)
│   │   ├── login/                # Auth: SignIn (Server Actions)
│   │   ├── signup/               # Auth: SignUp (Server Actions)
│   │   ├── survey/               # Report submission form
│   │   └── page.tsx              # Landing Page
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components (including chart)
│   │   ├── providers/            # QueryProvider for TanStack Query
│   │   └── UserMenu.tsx          # Auth-aware navigation menu
│   │
│   ├── lib/
│   │   ├── prisma.ts             # Prisma singleton
│   │   └── supabase/             # Supabase Auth utilities
│   │       ├── client.ts         # Browser client
│   │       ├── server.ts         # Server client
│   │       └── middleware.ts     # Middleware session logic
│   │
│   └── generated/                # Auto-generated Prisma types
```

---

## 🗃️ Database Schema

### Enums

- **ReportStatus**: `PENDING`, `VERIFIED`, `REJECTED`
- **UserRole**: `ADMIN`, `EXPERT`, `USER`

### Models

#### UserProfile (Linked to Supabase Auth)

```prisma
model UserProfile {
  id        String   @id // Supabase auth.users UUID
  email     String   @unique
  role      UserRole @default(USER)
  fullName  String?
}
```

#### Plant

```prisma
model Plant {
  plantId     String @id
  plantNameEn String
}
```

#### Pest

```prisma
model Pest {
  pestId     String @id
  pestNameEn String
}
```

#### PestReport (Updated with Verification)

```prisma
model PestReport {
  id                String   @id @default(cuid())
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  province          String
  plantId           String
  pestId            String
  
  reportedAt        DateTime @default(now())
  symptomOnSet      DateTime

  filedAffectedArea Float    // Area in ไร่ (Thai unit)
  incidencePercent  Float    // 0-100
  severityPercent   Float    // 0-100

  latitude          Float
  longitude         Float

  imageUrls         String[]
  imageTitles       String[]

  status          ReportStatus @default(PENDING)
  verifiedAt      DateTime?
  verifiedBy      String?
  rejectionReason String?
  
  @@index([province])
  @@index([pestId])
  @@index([status])
}
```

### Master Data (Seed)

- **77 Thai provinces** with English names, codes, and region info
- **2 plant types**: Rice, Corn
- **28 pests/diseases**: Expanded list including Brown Planthopper, Rice Blast Disease, Golden Apple Snail, etc. (IDs PST001-PST028)

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Database operations (Prisma 7)
npx prisma generate          # Generate Prisma Client
npx prisma migrate dev       # Create & apply migrations
npx prisma db seed           # Run seed.ts (via tsx)
npx prisma studio            # Open Prisma Studio GUI

# Build & production
npm run build
npm run start

# Linting
npm run lint
```

### Docker Database

```bash
# Start PostgreSQL container
docker-compose up -d

# Database runs on: localhost:5433
# Credentials: myuser/mypassword/mydb
```

## 🔧 Database Migration Lifecycle

### Development Workflow

1. **Model Change**: Update `prisma/schema.prisma`.
2. **Migration**: `npx prisma migrate dev --name <change_name>`.
3. **Verification**: `npx prisma studio`.
4. **Seeding**: `npx prisma db seed` (if master data changed).

### ⚠️ Cautions & Best Practices

- **Production**: Use `npx prisma migrate deploy`. Never use `dev` on production.
- **Field Renaming**: Be careful; Prisma might drop the column and recreate it, causing data loss. Manual SQL modification in the migration file may be needed for complex renames.
- **No `url` in Schema**: Remember Prisma 7 uses `prisma.config.ts`.

---

## ⚠️ Critical Implementation Notes

### 1. Prisma 7 Configuration

**IMPORTANT**: This project uses Prisma 7 which has breaking changes from earlier versions:

- **No `url` in schema.prisma**: The datasource URL is configured in `prisma.config.ts`, NOT in `schema.prisma`
- **Adapter-based connection**: Uses `@prisma/adapter-pg` with a pg Pool
- **Seed command**: Uses `tsx` via `npx tsx ./prisma/seed.ts`

```typescript
// ❌ WRONG (Old Prisma)
datasource db {
  provider = "postgresql"
  url       = env("DATABASE_URL")  // DO NOT ADD THIS
}

// ✅ CORRECT (Prisma 7)
datasource db {
  provider = "postgresql"
  // URL is in prisma.config.ts
}
```

### 2. Prisma Client Initialization

```typescript
// src/lib/prisma.ts - CORRECT pattern for Prisma 7
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
```

### 3. Server Components vs Client Components

- **Server Components** (`page.tsx`): Fetch data with Prisma, pass to Client Components
- **Client Components** (`SurveyFormClient.tsx`): Handle interactivity, forms, state

```tsx
// Server Component pattern (survey/page.tsx)
export default async function SurveyPage() {
  const [provinces, plants, pests] = await Promise.all([
    prisma.province.findMany({ orderBy: { provinceNameEn: "asc" } }),
    // ... more queries
  ]);
  return <SurveyFormClient provinces={provinces} plants={plants} pests={pests} />;
}
```

### 4. Field Naming Convention

All database fields use **English names** with specific casing:

- `provinceNameEn` (not `provinceName` or `province_name`)
- `plantNameEn` (not `plantName`)
- `pestNameEn` (not `pestName`)
- `filedAffectedArea` (Note: this may be a typo for "fieldAffectedArea")
- `symptomOnSet` (camelCase)

### 5. Form Data Fields

The survey form (`PestReportFormData`) matches Prisma schema:

```typescript
interface PestReportFormData {
  province: string;        // Province name (not ID)
  latitude: number;
  longitude: number;
  plantId: string;         // Plant ID (e.g., "P001")
  pestId: string;          // Pest ID (e.g., "INS001")
  symptomOnSet: string;    // Date string (ISO format)
  filedAffectedArea: number;
  incidencePercent: number;
  severityPercent: number;
}
```

## 🎨 Design System & Styling

### Theme: "Organic White Theme"

The application uses a carefully curated organic aesthetic with nature-inspired colors:

**Core Color Palette:**

```css
:root {
  /* Organic Background */
  --cream-bg: 45 30% 98%;           /* #FDFCF9 - Warm cream background */
  
  /* Primary: Deep Forest Green */
  --fresh-forest: 165 35% 15%;      /* #152B25 - Headers, primary elements */
  --primary-foreground: 0 0% 100%;
  
  /* Secondary: Fresh Leaf Green */
  --fresh-leaf: 115 40% 45%;        /* #4BAF47 - Icons, accents */
  --secondary-foreground: 0 0% 100%;
  
  /* CTA: Warm Orange */
  --fresh-orange: 20 90% 60%;       /* #F37335 - Call-to-action buttons */
  --cta-foreground: 0 0% 100%;
  
  /* Text: Soft Charcoal */
  --fresh-charcoal: 165 10% 25%;    /* #3A4442 - Body text */
  
  /* Borders & Inputs */
  --border: 165 20% 90%;            /* Soft green tint */
  --input: 165 20% 90%;
}

.dark {
  /* Forest Night Theme */
  --background: 165 40% 10%;        /* Very dark forest green */
  --foreground: 50 27% 96%;         /* Cream text */
  --primary: 118 42% 48%;           /* Leaf green for visibility */
  --border: 165 30% 20%;
}
```

### Typography

**Primary Font**: Noto Sans Thai

- Supports Thai and Latin scripts
- All weights (100-900) included
- Applied to body, headings, and all UI elements

```tsx
// Configuration in layout.tsx
const noto_sans_thai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-sans-thai",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});
```

### UI Component Standards

**Border Radius:**

- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-full` for CTAs, `rounded-xl` for standard buttons
- Inputs: `rounded-xl` (12px)
- Icons: `rounded-xl` for icon containers

**Spacing:**

- Form fields: `space-y-3` between label and input
- Grid gaps: `gap-4` for standard layouts, `gap-6` for feature sections

**Shadows:**

- Primary CTAs: `shadow-lg shadow-orange-500/20`
- Cards: `shadow-xl shadow-black/5`
- Hover states: `hover:shadow-lg`

### Icons

Uses **Google Material Icons (Outlined)**:

```html
<span className="material-icons-outlined">agriculture</span>
```

Icons are loaded via Google Fonts CDN in `layout.tsx`.

---

## 🔄 Multi-Step Form Flow

The Survey Form has **4 steps**:

### 1. Location (`location`)

- **Province**: Dropdown selection (77 Thai provinces from database)
- **Latitude/Longitude**: Auto-populated via GPS or manual entry
- **Map Preview**: Interactive Leaflet map with draggable marker
- **GPS Button**: One-click geolocation with `navigator.geolocation`

**UI Components:**

- `rounded-xl` dropdown with `border-border`
- GPS button with `my_location` icon
- Lat/Long display in `font-mono` style with `bg-muted/30` background

### 2. Plant (`plant`)

- **Plant Type Selection**: Radio cards with icons (Rice, Corn, Cassava, Sugarcane)
- **Pest/Disease Selection**: See step 3 below

**UI Pattern:**

```tsx
<label className="cursor-pointer group">
  <input type="radio" className="peer sr-only" />
  <div className="peer-checked:border-primary peer-checked:bg-primary/5">
    {/* Plant card with icon and name */}
  </div>
</label>
```

### 3. Pest (`pest`)

- **Pest Selection**: Radio cards with pest names from database (BPH, Spot, Pink, Rice Blast)
- Horizontal layout with `border-border` and `hover:bg-muted/30`

### 4. Issue Details (`issue`)

- **Symptom Onset Date**: Date picker with calendar icon
- **Affected Area**: Number input with "Rai" suffix
- **Incidence Percent**: Number input (0-100%) with `%` suffix
- **Severity Percent**: Number input (0-100%) with `%` suffix

**Current Field Structure** (as of latest update):

```tsx
{/* All percentage fields use consistent pattern */}
<div className="relative">
  <Input
    type="number"
    placeholder="0"
    className="h-12 pr-12 rounded-xl border-border bg-background"
    value={formData.incidencePercent || ""}
  />
  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
    %
  </div>
</div>
```

**Navigation:**

- Back button: `ghost` variant with `west` icon
- Next/Submit: Primary CTA with `bg-cta` and `east`/`check` icons
- Steps tracker: Visual progress indicator with `rounded-2xl` step containers

---

## 🚫 Common Pitfalls to Avoid

1. **Never add `url` to datasource in `schema.prisma`** - Prisma 7 uses config file
2. **Don't create new PrismaClient in Server Actions** - Use the singleton from `@/lib/prisma`
3. **Don't import Prisma in Client Components** - Prisma runs server-side only
4. **Check field names carefully** - They're camelCase with "En" suffix for English names
5. **Seed data uses Thai province names in some places** - Be careful when matching

6. **TanStack Query & Hydration Management**

To prevent "Hydration Mismatch" errors and enable real-time updates:

- **QueryProvider**: Must wrap the application in `layout.tsx`.
- **Client-Side Initialization**: States like default date ranges that depend on `new Date()` should be initialized in a `useEffect` on mount.
- **Polling**: Use `refetchInterval` in `useQuery` for live dashboard data.

```tsx
// DashboardClient.tsx pattern
const [date, setDate] = useState<DateRange | undefined>();

useEffect(() => {
  setDate({ from: subDays(new Date(), 30), to: new Date() });
}, []);

const { data } = useQuery({
  queryKey: ['metrics', date],
  queryFn: () => getMetrics(date),
  enabled: !!date, // Wait for client mount
  refetchInterval: 30000,
});
```

## 🔐 Access Control & Verification

### Roles & Permissions

- **Anonymous/USER**: Submit reports (default `PENDING`), view `VERIFIED` dashboard.
- **EXPERT/ADMIN**: Access `/expert/review`, verify/reject reports, view all reports.

### Authentication Flow

Uses `@supabase/ssr` for cookie-based auth.

- **Middleware**: Refreshes sessions and protects `/expert/*` routes.
- **Server Actions**: `login`, `signup`, `signout`, `getCurrentUser`.

---

## 📋 Feature Status & Roadmap

### ✅ Completed Features

1. **Multi-Step Survey Form**: 4-step wizard with geolocation.
2. **Verification Workflow**: Expert review queue with Verify/Reject actions.
3. **Advanced Analytics Dashboard**: Public view showing ONLY verified reports with:
   - **Interactive Map**: Markers colored by severity and dynamic heatmap layer.
   - **Analytics Charts**: Area charts for trends, Donut charts for pest distribution.
   - **Real-time Updates**: TanStack Query polling every 30s.
4. **Access Control System**: Supabase Auth integration with role-based routing.
5. **Organic White Theme**: Consistent premium aesthetic across all pages.

### 🚧 In Progress

1. **User Role Management**: Admin UI to promote users to EXPERT role.
2. **Performance Optimization**: Server-side caching for heavy aggregation queries.

### 📅 Planned Features

1. **Real-time Alerts**: Notify users when pests are detected in their province.
2. **Export Tools**: CSV/PDF export for expert analysis.

---

## 🛠️ Quick Reference Commands

```bash
# Full reset & reseed database
npx prisma migrate reset

# View database in browser
npx prisma studio

# Check for schema issues
npx prisma validate

# Format schema file
npx prisma format
```

---

## 📞 External Resources

- [Next.js 16 App Router Docs](https://nextjs.org/docs)
- [Prisma 7 Documentation](https://www.prisma.io/docs)
- [Prisma pg Adapter](https://www.prisma.io/docs/orm/overview/databases/postgresql#using-the-pg-driver)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
