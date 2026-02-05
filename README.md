# RicePestNet 🌾

A modern, mobile-first agricultural pest and disease monitoring system for Thailand. Built with Next.js 16, Supabase, and Prisma 7.

![RicePestNet Dashboard](/public/dashboard-preview.png)

## 🎯 Project Overview

RicePestNet enables farmers and agricultural experts to collaborate in tracking pest outbreaks. The system facilitates:

- **Real-time Reporting**: Farmers can submit geotagged pest sighting reports.
- **Expert Verification**: Agronomists review and verify reports to ensure data accuracy.
- **Public Dashboard**: Visualizes verified outbreaks to help communities take preventive action.

## 🚀 Key Features

- **Advanced Analytics Dashboard**: Real-time visualization of pest outbreaks with:
  - **Interactive Map**: Marker clustering and heatmap layers using Leaflet.
  - **Trend Analysis**: Area, Donut, and Bar charts for pest ranking and geographic distribution.
  - **Live Updates**: Automatic background polling for the latest verification data.
  - **Date Filtering**: Dynamic data selection across custom time ranges.
- **Expert Verification**: Agronomists review and verify reports to ensure data accuracy.
- **Organic White Theme**: Premium, nature-inspired design system with dark mode support.
- **Thai Language Support**: Built-in support for Thai provinces and master data.

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (Supabase Local/Cloud) |
| **ORM** | Prisma Client 7 |
| **Auth** | Supabase Auth (`@supabase/ssr`) |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui + Radix UI |
| **State Mgt** | TanStack Query |
| **Charts** | Recharts (via shadcn/ui chart) |
| **Maps** | Leaflet + Leaflet.heat |

## 🏗️ Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop (for local database)
- Supabase CLI (`npm install -g supabase`)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ricepestnet.git
   cd ricepestnet
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start Local Supabase**

   ```bash
   npx supabase start
   ```

4. **Setup Environment Variables**
   Copy `.env.example` to `.env` (or use the configured values from Supabase start output):

   ```env
   DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
   DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
   NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

5. **Initialize Database**

   ```bash
   # Push schema to local database
   npx prisma db push

   # Seed initial data (Provinces, Plants, Pests)
   npx prisma db seed
   ```

6. **Run Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🧪 Testing Accounts

When running locally seeded data:

| Role | Email | Password |
|------|-------|----------|
| **Expert** | <expert@demo.com> | password123 |
| **User** | <user@demo.com> | password123 |

## 🗂️ Database Schema Updates

Follow these best practices when updating the database schema using Prisma:

1. **Modify the Schema**: Update your models in `prisma/schema.prisma`.
2. **Create a Migration**:

   ```bash
   # Generates a SQL migration file and applies it to your local DB
   npx prisma migrate dev --name describe_your_change
   ```

   *Always use `migrate dev` instead of `db push` for development to maintain a clear history of changes.*
3. **Synchronize Types**:
   The Prisma Client is usually updated automatically after a migration. If not, run:

   ```bash
   npx prisma generate
   ```

4. **Update Seed Data**:
   If your schema changes affect master data or sample reports, update `prisma/seed.ts` and re-seed:

   ```bash
   npx prisma db seed
   ```

5. **Typescript Errors**: Restart your IDE or the Next.js dev server if you notice stale type errors after a schema change.

## 📦 Project Structure

```
├── prisma/               # Database schema & seeds
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js Pages & Layouts
│   │   ├── dashboard/    # Public analytics
│   │   ├── expert/       # Protected expert routes
│   │   ├── login/        # Auth pages
│   │   └── survey/       # Report submission
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utilities (Prisma, Supabase)
└── supabase/             # Local Supabase config
```

## 📄 License

This project is licensed under the MIT License.
