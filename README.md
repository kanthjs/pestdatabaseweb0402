# RicePestNet 🌾

A comprehensive agricultural pest monitoring and reporting system for Thailand. Enables farmers, agricultural experts, and administrators to report, verify, and track pest infestations with real-time geospatial analysis.

**Live Demo**: Vercel Deployment | **Repository**: [GitHub](https://github.com/yourusername/ricepestnet)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Routes](#-api-routes)
- [Authentication & Authorization](#-authentication--authorization)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)
- [Critical Technical Notes](#-critical-technical-notes)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality

- 📍 **Geotagged Pest Reports** - GPS-based pest sighting submissions with location verification
- 📊 **Interactive Dashboards** - Role-specific analytics with maps, charts, and trend analysis
- ✅ **Expert Verification Workflow** - Agronomist review system with approval/rejection tracking
- 🌍 **Comprehensive Geographic Data** - Full support for 77 Thai provinces with district-level tracking
- 🔐 **Role-Based Access Control** - Separate dashboards for Users, Experts, and Administrators
- 📱 **Responsive Design** - Mobile-first interface for field use and desktop analytics

### Data Management

- Multi-image upload with captions (up to 2 images per report)
- Pest identification with Thai/English plant and pest database
- Anonymous reporting option with optional email notifications
- Activity logging and audit trails for administrative oversight
- Real-time notification system for report status changes

### Analytical Tools

- Heat maps showing pest concentration by region
- Charts tracking pest distribution and severity trends
- Province-level filtering and analysis
- Expert request management and approval workflow

---

## 🛠 Tech Stack

| Layer | Technology | Version |
| --- | --- | --- |
| **Framework** | Next.js | 16.1.6 (App Router) |
| **Language** | TypeScript | 5.9+ |
| **Runtime** | Node.js | 20+ |
| **Database** | PostgreSQL | 14+ (via Supabase) |
| **ORM** | Prisma | 7.3.0 |
| **DB Driver** | @prisma/adapter-pg | 7.3.0 |
| **Authentication** | Supabase Auth | 0.8.0+ |
| **UI Components** | shadcn/ui + Radix UI | Latest |
| **Styling** | Tailwind CSS | 4.0 |
| **Maps** | Leaflet + react-leaflet | 5.0.0 |
| **Charts** | Recharts | 2.15.4 |
| **Forms** | React Hook Form | 7.71.1 |
| **Validation** | Zod | 4.3.6 |
| **HTTP Client** | TanStack React Query | 5.90.20 |
| **Email** | Resend | 6.9.1 |
| **Deployment** | Vercel | Latest |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20 or higher
- **npm** 10+ or **yarn**
- **Supabase CLI** (for local development): `npm install -g supabase`
- **Git**

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ricepestnet.git
cd ricepestnet

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. For local development: Start Supabase
npx supabase start

# 5. Copy local Supabase credentials to .env.local
# (Follow the output from `supabase start`)

# 6. Initialize database
npx prisma migrate deploy
npx prisma db seed

# 7. Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### Test Accounts (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| 👤 User | user1@demo.com | password123 |
| 👨‍🌾 Expert | expert1@demo.com | password123 |
| 👨‍💼 Admin | admin1@demo.com | password123 |

---

## 📂 Project Structure

```
ricepestnet/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/               # Login page + actions
│   │   │   ├── signup/              # Registration page + actions
│   │   │   └── layout.tsx           # Auth layout wrapper
│   │   ├── dashboard/               # Main dashboards (public + protected)
│   │   │   ├── page.tsx             # Public dashboard (for all users)
│   │   │   ├── components/          # Map, charts, filters
│   │   │   ├── user/                # User dashboard (authenticated)
│   │   │   ├── expert/              # Expert review dashboard
│   │   │   ├── admin/               # Admin management dashboard
│   │   │   └── actions.ts           # Server actions for dashboards
│   │   ├── survey/                  # Pest report form
│   │   │   ├── page.tsx             # Form wrapper
│   │   │   ├── SurveyFormClient.tsx # Client form component
│   │   │   ├── components/          # Form fields, map picker
│   │   │   └── actions.ts           # Form submission logic
│   │   ├── reports/                 # Report viewing
│   │   │   ├── [id]/                # Individual report details
│   │   │   └── page.tsx             # Reports list page
│   │   ├── my-reports/              # Authenticated user's reports
│   │   ├── expert/review/           # Expert review workflow
│   │   ├── profile/                 # User profile management
│   │   ├── api/
│   │   │   ├── notifications/       # Notification API
│   │   │   ├── pending-count/       # Report count for experts
│   │   │   ├── user-role/           # Get current user role
│   │   │   └── geocode/             # Reverse geocoding
│   │   ├── login/
│   │   ├── signup/
│   │   ├── about/                   # About page
│   │   ├── privacy/                 # Privacy policy
│   │   ├── terms/                   # Terms of service
│   │   ├── disclaimer/              # Disclaimer
│   │   ├── layout.tsx               # Root layout
│   │   └── action.tsx               # Root server actions
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── select.tsx
│   │   │   └── ... (other UI components)
│   │   ├── landing/                 # Landing page components
│   │   ├── map/                     # Leaflet map components
│   │   ├── forms/                   # Form components
│   │   └── common/                  # Shared components
│   │
│   ├── lib/
│   │   ├── prisma.ts               # Prisma client with PrismaPg adapter
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client
│   │   │   ├── server.ts           # Server Supabase client
│   │   │   └── middleware.ts       # Auth middleware
│   │   ├── permissions.ts          # Role-based permission checks
│   │   ├── validation.ts           # Zod schemas for validation
│   │   ├── api-utils.ts            # API response utilities
│   │   ├── email.ts                # Email sending utilities
│   │   ├── rate-limit.ts           # Rate limiting
│   │   └── utils.ts                # General utilities
│   │
│   └── types/
│       ├── index.ts                # Global types
│       └── supabase.ts             # Supabase types
│
├── prisma/
│   ├── schema.prisma               # Database schema (7 models)
│   ├── migrations/                 # Migration history
│   └── seed.ts                     # Database seed script
│
├── public/                         # Static assets
│   ├── images/
│   └── icons/
│
├── docs/                           # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT.md
│
├── scripts/                        # Utility scripts
├── middleware.ts                   # Next.js middleware (edge runtime)
├── prisma.config.ts               # Prisma 7 config (datasource config)
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── CLAUDE.md                      # Development guidelines
├── SKILL.md                       # Custom skills documentation
└── README.md                      # This file
```

---

## 🗄️ Database Schema

### Models Overview

#### **UserProfile**

Extends Supabase auth.users with role and profile information.

```typescript
{
  id: string               // Supabase auth.users UUID
  userName: string         // Unique username
  email: string           // Unique email
  role: UserRole          // ADMIN | EXPERT | USER
  firstName?: string
  lastName?: string
  phone?: string
  occupationRoles?: string
  expertRequest: ExpertStatus  // NONE | PENDING | APPROVED | REJECTED
  expertProofUrl?: string      // Credentials for expert verification
  address?: string
  province?: string
  district?: string
  subDistrict?: string
  zipCode?: string
  createdAt: DateTime
  updatedAt: DateTime
  pestReports: PestReport[]
  notifications: Notification[]
  activityLogs: ActivityLog[]
}
```

#### **PestReport**

Main table for pest observations.

```typescript
{
  id: string              // CUID
  provinceCode: string    // FK to Province
  plantId: string         // FK to Plant
  pestId: string          // FK to Pest
  reportedAt: DateTime    // When report was created
  symptomOnSet: DateTime  // When symptoms appeared

  // Quantitative data
  fieldAffectedArea: Float    // Area in ไร่ (Thai unit)
  incidencePercent: Float     // 0-100%
  severityPercent: Float      // 0-100%

  // Location
  latitude: Float
  longitude: Float

  // Media
  imageUrls: String[]     // Up to 2 image URLs
  imageCaptions: String[] // Captions for images

  // Reporter info
  isAnonymous: Boolean
  reporterFirstName?: string
  reporterLastName?: string
  reporterPhone?: string
  reporterUserId?: string // FK to UserProfile
  reporterEmail?: string  // For anonymous reports
  ipHash?: string         // Anti-spam
  sessionId?: string      // Anti-spam

  // Verification
  status: ReportStatus    // PENDING | APPROVED | REJECTED
  verifiedAt?: DateTime
  verifiedBy?: string
  rejectionReason?: string
  deletedAt?: DateTime    // Soft delete

  createdAt: DateTime
  updatedAt: DateTime
  notifications: Notification[]
}
```

#### **Province**

Thai geographic divisions (77 provinces).

```typescript
{
  provinceId: Int         // Primary key
  provinceCode: String    // ISO 3166-2:TH code (unique)
  provinceNameEn: String
  provinceNameTh?: string
  pestReports: PestReport[]
}
```

#### **Plant**

Agricultural plant types (Rice, Corn, etc.).

```typescript
{
  plantId: String
  plantNameEn: String
  plantNameTh?: string
  imageUrl?: string
  pestReports: PestReport[]
}
```

#### **Pest**

Pest species database.

```typescript
{
  pestId: String
  pestNameEn: String
  pestNameTh?: string
  imageUrl?: string
  pestReports: PestReport[]
}
```

#### **Notification**

User notification system.

```typescript
{
  id: String              // CUID
  userId: String          // FK to UserProfile
  type: String            // "NEW_REPORT", "VERIFIED", "REJECTED"
  message: String
  reportId?: String       // FK to PestReport
  isRead: Boolean
  createdAt: DateTime
}
```

#### **ActivityLog**

Admin audit trail.

```typescript
{
  id: String              // CUID
  adminId: String         // FK to UserProfile
  action: String          // e.g., "APPROVE_REPORT", "CHANGE_ROLE"
  entityId?: String       // ID of affected object
  entityType?: String     // "REPORT", "USER", "EXPERT_REQUEST"
  details?: Json          // Additional context
  createdAt: DateTime
}
```

### Database Indexes

Optimized queries on:

- `PestReport.provinceCode` - Province filtering
- `PestReport.pestId` - Pest filtering
- `PestReport.plantId` - Plant filtering
- `PestReport.status` - Report status queries
- `PestReport.reporterUserId` - User's reports
- `Notification.userId` + `isRead` - Notification queries
- `ActivityLog.adminId` + `createdAt` - Admin audit logs

---

## 🔌 API Routes

### Public Routes

#### `GET /api/user-role`

Get current authenticated user's role.

**Response:**

```json
{
  "role": "ADMIN" | "EXPERT" | "USER" | null,
  "userId": "uuid" | null
}
```

#### `GET /api/notifications`

Fetch user notifications (requires authentication).

**Query Parameters:**

- `limit`: number (default: 10)
- `isRead`: boolean (optional)

**Response:**

```json
{
  "notifications": [
    {
      "id": "string",
      "type": "NEW_REPORT" | "VERIFIED" | "REJECTED",
      "message": "string",
      "reportId": "string | null",
      "isRead": boolean,
      "createdAt": "ISO 8601 string"
    }
  ],
  "total": number
}
```

#### `GET /api/pending-count`

Get count of pending reports for expert review (expert/admin only).

**Response:**

```json
{
  "pendingCount": number
}
```

### Server Actions

Server actions follow the pattern of `actions.ts` files colocated with pages.

#### Survey Submission

**Location:** `/src/app/survey/actions.ts`

Creates a new pest report with image uploads, geocoding, and validation.

#### Dashboard Queries

**Location:** `/src/app/dashboard/actions.ts`

Fetches dashboard metrics, filtered reports, and analytics data.

#### Expert Review

**Location:** `/src/app/dashboard/expert/actions.ts`

Approve/reject pest reports with audit logging.

#### Admin Management

**Location:** `/src/app/dashboard/admin/actions.ts`

User management, expert request approval, activity logging.

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Sign Up** (`/signup`) - Supabase Auth + UserProfile creation
2. **Login** (`/login`) - Supabase Auth email/password
3. **Middleware** - Token refresh and session management
4. **Protected Routes** - Role-based access control

### Role-Based Access Control

| Role | Permissions | Access |
| --- | --- | --- |
| **USER** | Submit reports, view own reports | `/survey`, `/my-reports`, `/profile` |
| **EXPERT** | Review/verify reports, view analytics | `/dashboard/expert/review`, `/dashboard/expert` |
| **ADMIN** | All permissions + user management, expert requests | `/dashboard/admin`, full system access |

### Protected Routes

```
/dashboard              → PUBLIC (all users)
/dashboard/user        → USER, EXPERT, ADMIN
/dashboard/expert      → EXPERT, ADMIN
/dashboard/expert/review → EXPERT, ADMIN
/dashboard/admin       → ADMIN only
/survey               → Authenticated (all roles)
/my-reports           → USER, EXPERT, ADMIN
/profile              → Authenticated (all roles)
/expert/review        → EXPERT, ADMIN
```

### Permission Checks

Use the `permissions.ts` utility for role validation:

```typescript
import { canReviewReports, canManageUsers } from '@/lib/permissions';

// In server actions
if (!canReviewReports(userRole)) {
  throw new Error('Unauthorized');
}
```

---

## 👨‍💻 Development Guide

### Running the Development Server

```bash
# Start Next.js dev server (http://localhost:3000)
npm run dev

# In another terminal, start Supabase (for local DB)
npx supabase start
```

### Database Development

```bash
# Create new migration (local)
npx prisma migrate dev --name add_field_name

# View/edit data in browser UI
npx prisma studio

# Seed database with test data
npx prisma db seed

# Apply migrations (production)
npx prisma migrate deploy
```

### Code Patterns

#### Server Actions

```typescript
// File: src/app/feature/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function myServerAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Your business logic
  const result = await prisma.model.create({...});

  return result;
}
```

#### Form Validation

```typescript
// File: src/lib/validation.ts
import { z } from 'zod';

export const reportSchema = z.object({
  pestId: z.string().min(1, 'Pest is required'),
  plantId: z.string().min(1, 'Plant is required'),
  incidencePercent: z.number().min(0).max(100),
  // ...
});

export type ReportInput = z.infer<typeof reportSchema>;
```

#### Authorization Check

```typescript
// File: src/lib/permissions.ts
export function canReviewReports(role: UserRole): boolean {
  return ['EXPERT', 'ADMIN'].includes(role);
}
```

#### Client-Side Auth

```typescript
// File: src/components/SomeComponent.tsx
'use client';

import { createBrowserClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export function Component() {
  const [user, setUser] = useState(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return <div>{user?.email}</div>;
}
```

### Type Safety

All TypeScript types should be strict. Use the following patterns:

```typescript
// Global types
export type UserRole = 'ADMIN' | 'EXPERT' | 'USER';
export type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Component props
interface DashboardProps {
  userId: string;
  role: UserRole;
  reports?: PestReport[];
}

// API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Format code (use Prettier in your editor)
npx prettier --write "src/**/*.{ts,tsx}"
```

---

## 🚀 Deployment

### Vercel Deployment

The project is configured for Vercel with automatic deployments from the `main` branch.

#### Environment Variables (Vercel)

Set these in Vercel dashboard under **Settings → Environment Variables**:

```env
DATABASE_URL=postgresql://user:pass@pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://user:pass@pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

#### Build Process

The `npm run build` script:

1. Generates Prisma Client (`prisma generate`)
2. Applies pending migrations (`prisma migrate deploy`)
3. Builds Next.js (`next build`)

#### Database Setup for Production

If migrating to a new production database:

```bash
# From your local machine with DIRECT_URL set to session mode pooler
DIRECT_URL="..." npx prisma migrate deploy
```

#### Monitoring

- **Build failures**: Check Vercel logs in dashboard
- **Migrations issues**: Verify DIRECT_URL uses session mode (port 5432)
- **Bundle size**: Monitor Vercel analytics, optimize imports

---

## ⚠️ Critical Technical Notes

### 1. Prisma in Edge Functions (CRITICAL)

**Rule: NEVER import Prisma in `middleware.ts`**

- Edge Runtime has a 1MB bundle limit
- Prisma Client is too large (~2MB)
- **Solution**: Only use `updateSession()` in middleware.ts for session refresh

```typescript
// ✅ CORRECT: middleware.ts
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
```

```typescript
// ❌ WRONG: Do NOT import Prisma here
import { prisma } from '@/lib/prisma'; // ERROR!
```

### 2. Prisma 7 Configuration

**Rule: NO `url`/`directUrl` in `schema.prisma`**

Prisma 7 requires datasource configuration in `prisma.config.ts`:

```typescript
// ✅ prisma.config.ts
export default defineConfig({
  datasource: {
    url: process.env['DIRECT_URL'], // Migration URL
  },
});
```

Runtime connections use the PrismaPg adapter:

```typescript
// ✅ lib/prisma.ts
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5, // Vercel serverless limit
});

export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});
```

### 3. Supabase Connection Modes (CRITICAL)

| Mode | Host | Port | Use For | Note |
|------|------|------|---------|------|
| **Transaction Mode** (pgbouncer) | pooler.supabase.com | **6543** | `DATABASE_URL` - runtime queries | ✅ For Vercel |
| **Session Mode** | pooler.supabase.com | **5432** | `DIRECT_URL` - migrations | ✅ Must use same host |
| **Direct Connection** | db.xxx.supabase.co | 5432 | **NEVER** on Vercel | ❌ Blocked by NAT |

```env
# ✅ CORRECT
DATABASE_URL=postgresql://...@pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://...@pooler.supabase.com:5432/postgres

# ❌ WRONG: Direct DB will fail on Vercel
DIRECT_URL=postgresql://...@db.xxx.supabase.co:5432/postgres
```

### 4. Static Prerender Protection

**Rule: Pages with Prisma queries need `export const dynamic = 'force-dynamic'`**

This prevents Next.js from prerendering during build time when the database isn't ready:

```typescript
// ✅ CORRECT: Any page that queries Prisma
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const reports = await prisma.pestReport.findMany();
  return <Dashboard reports={reports} />;
}
```

### 5. Connection Pooling & Limits

- Vercel serverless: **5 concurrent connections** maximum per function
- PrismaPg adapter configured with `max: 5` connections
- Use connection pooling in production (Database pooling mode: Transaction)

---

## 🐛 Troubleshooting

### Deployment Issues

#### Error: "ENOENT: no such file or directory, open '.prisma/client'"
```bash
# Solution: Generate Prisma Client
npm install
npx prisma generate
npm run build
```

#### Error: "relation 'public.Province' does not exist"
```bash
# Solution: Migrations not applied on Vercel
# 1. Verify DIRECT_URL in Vercel env vars
# 2. Ensure using session mode pooler (port 5432)
# 3. Manually run: DIRECT_URL="..." npx prisma migrate deploy
```

#### Error: "Your project exceeded the connection limit"
```bash
# Solution: Reduce concurrent connections
# - Check for connection leaks in server actions
# - Ensure using PrismaPg adapter with pool: { max: 5 }
# - Use $disconnect() after direct queries
```

### Development Issues

#### Supabase connection fails locally
```bash
# Solution: Restart Supabase
npx supabase stop
npx supabase start
```

#### Type errors after schema changes
```bash
# Solution: Regenerate Prisma types
npx prisma generate
npm run lint
```

#### "Token refresh failed" on localhost
```bash
# Solution: Check NEXT_PUBLIC_SUPABASE_URL
# Must match local Supabase URL (http://127.0.0.1:54321)
```

---

## 📚 Additional Resources

- **[Prisma Docs](https://www.prisma.io/docs/)** - ORM documentation
- **[Supabase Docs](https://supabase.com/docs)** - Database & Auth
- **[Next.js Docs](https://nextjs.org/docs)** - Framework reference
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling
- **[Leaflet Maps](https://leafletjs.com/)** - Map library
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

Please follow:
- TypeScript strict mode
- ESLint rules (checked in CI)
- Existing code patterns
- Test before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💼 Support

For issues, questions, or feedback:
- **Issues**: [GitHub Issues](https://github.com/yourusername/ricepestnet/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ricepestnet/discussions)
- **Email**: contact@example.com

---

**Last Updated:** February 2025 | **Version:** 0.1.0
