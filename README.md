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

## 🗂️ Database Schema Updates (การจัดการฐานข้อมูล)

Follow these best practices when updating the database schema using Prisma:

### 1. Modify the Schema (แก้ไขไฟล์ Schema)

Update your models in `prisma/schema.prisma`.

### 2. Create and Apply Migration (การทำ Migration)

Use this command in development to generate a SQL migration file and update your local database:

```bash
npx prisma migrate dev --name describe_your_change
```

- `--name`: Give your migration a clear name (e.g., `add_user_role`, `init_pest_table`).
- **What happens?**: Prisma generating a SQL file in `/prisma/migrations` and applies it to your DB immediately.

### 3. Verify with Prisma Studio (ตรวจสอบผลลัพธ์)

Open the browser-based GUI to view and edit your data:

```bash
npx prisma studio
```

### ⚠️ Critical Cautions (ข้อควรระวัง)

- **Production Environment**: **NEVER** use `prisma migrate dev` on a production server. Use `npx prisma migrate deploy` instead. This applies existing migrations without deleting data.
- **Renaming Fields**: Renaming a field might be treated as "Delete old field + Create new field" by Prisma, which **deletes data** in that column. Always check the generated SQL file before applying if you have existing data.
- **Master Data**: If your changes affect master data (Provinces, Pests), update `prisma/seed.ts` and run:

  ```bash
  npx prisma db seed
  ```

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
