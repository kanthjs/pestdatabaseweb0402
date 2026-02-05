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
| **Database** | PostgreSQL | Docker |
| **ORM** | Prisma Client | 7.3.0 |
| **DB Adapter** | @prisma/adapter-pg | 7.3.0 |
| **Styling** | Tailwind CSS v4 | 4.x |
| **UI Components** | Radix UI + shadcn/ui | Latest |
| **Forms** | React Hook Form + Zod | 7.71.1 / 4.3.6 |
| **State** | TanStack Query | 5.90.20 |

---

## 📁 Project Structure

```
pestdatabaseweb0402/
├── .env                          # Environment variables (DATABASE_URL)
├── docker-compose.yml            # PostgreSQL container config
├── package.json                  # Dependencies & scripts
├── prisma.config.ts              # Prisma 7 config (migrations, seed)
├── tsconfig.json                 # TypeScript configuration
│
├── prisma/
│   ├── schema.prisma             # Database schema (Province, Plant, Pest, PestReport)
│   ├── seed.ts                   # Database seeding (77 Thai provinces, plants, pests)
│   └── migrations/               # Migration history
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout (fonts, metadata)
│   │   ├── page.tsx              # Landing page (homepage)
│   │   ├── globals.css           # Global styles + CSS variables
│   │   ├── action.tsx            # Server Actions (createPestReport)
│   │   └── survey/
│   │       ├── page.tsx          # Survey page (Server Component - fetches master data)
│   │       └── SurveyFormClient.tsx  # Multi-step form (Client Component)
│   │
│   ├── components/ui/            # shadcn/ui components
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   └── sheet.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts             # Prisma singleton with pg adapter
│   │   └── utils.ts              # cn() utility for class merging
│   │
│   └── generated/                # (Prisma generated types)
│
└── public/                       # Static assets
```

---

## 🗃️ Database Schema

### Models

#### Province
```prisma
model Province {
  provinceId     Int    @id
  provinceNameEn String @unique
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

#### PestReport (Main Entity)
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

  @@index([province])
  @@index([pestId])
}
```

### Master Data (Seed)
- **77 Thai provinces** with English names, codes, and region info
- **4 plant types**: Rice, Corn, Cassava, Sugarcane
- **4 pests/diseases**: BPH, Spot, Pink, Rice Blast

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
  url      = env("DATABASE_URL")  // DO NOT ADD THIS
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

---

## 🎨 Styling Guidelines

### CSS Variables (Light/Dark mode)
```css
:root {
  --primary: hsl(86 78% 27%);         /* Green: #4d7c0f */
  --primary-dark: hsl(92 60% 15%);    /* Dark green: #365314 */
  --background: hsl(210 20% 98%);     /* Light background */
  --card: hsl(0 0% 100%);
}

.dark {
  --background: hsl(220 39% 11%);     /* #111827 */
  --card: hsl(217 33% 17%);           /* #1f2937 */
}
```

### Icons
Uses **Google Material Icons (Outlined)**:
```html
<span className="material-icons-outlined">agriculture</span>
```
Icons are loaded via Google Fonts CDN in `layout.tsx`.

### Fonts
- **Body**: Inter (--font-sans)
- **Display**: Playfair Display (--font-display)

---

## 🔄 Multi-Step Form Flow

The Survey Form has 3 steps:

1. **Location** (`location`)
   - Province selection (dropdown from database)
   - Latitude/Longitude (manual or GPS auto-detect)

2. **Plant** (`plant`)
   - Plant type selection (radio cards from database)
   - Pest/Disease selection (radio cards from database)

3. **Issue** (`issue`)
   - Symptom onset date
   - Affected area (ไร่)
   - Incidence percent (slider 0-100%)
   - Severity percent (slider with Low/Medium/High presets)

---

## 🚫 Common Pitfalls to Avoid

1. **Never add `url` to datasource in `schema.prisma`** - Prisma 7 uses config file
2. **Don't create new PrismaClient in Server Actions** - Use the singleton from `@/lib/prisma`
3. **Don't import Prisma in Client Components** - Prisma runs server-side only
4. **Check field names carefully** - They're camelCase with "En" suffix for English names
5. **Seed data uses Thai province names in some places** - Be careful when matching

---

## 📋 TODO / Planned Features

1. **Server Action Integration**: Complete `createPestReport` action connection
2. **Image Upload**: Implement photo upload for pest evidence
3. **Map Integration**: Leaflet/Mapbox for location selection and visualization
4. **Dashboard**: Analytics and report management
5. **Authentication**: User login and role-based access
6. **Expert Verification**: Expert review workflow for reports

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
