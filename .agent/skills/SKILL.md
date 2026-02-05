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

## 📋 Feature Status & Roadmap

### ✅ Completed Features

1. **Multi-Step Survey Form**: 4-step wizard with validation and progress tracking
2. **Map Integration**: Leaflet map with GPS auto-detection and draggable marker
3. **Database Schema**: Prisma 7 with PostgreSQL (77 provinces, plants, pests)
4. **Organic White Theme**: Complete design system with light/dark mode support
5. **Thai Font Support**: Noto Sans Thai for proper Thai character rendering
6. **Responsive UI**: Mobile-first design with organic shapes and animations
7. **Server Actions**: `createPestReport` action for form submission

### 🚧 In Progress

1. **Image Upload**: Photo upload for pest evidence documentation
2. **Form Validation**: Enhanced client-side and server-side validation with Zod

### 📅 Planned Features

1. **Dashboard**:
   - Report management interface
   - Analytics and visualization
   - Export functionality

2. **Authentication**:
   - User login and registration
   - Role-based access control (Farmer, Expert, Admin)

3. **Expert Verification**:
   - Expert review workflow for submitted reports
   - Comment and feedback system

4. **Advanced Mapping**:
   - Heat maps for pest outbreak density
   - Historical data overlay
   - Cluster visualization

5. **Notifications**:
   - Alert system for nearby outbreaks
   - Expert response notifications

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
