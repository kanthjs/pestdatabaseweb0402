# RicePestNet 🌾

A modern, mobile-first agricultural pest and disease monitoring system for Thailand. Built with Next.js 16, Supabase, and Prisma 7.

![RicePestNet Dashboard](/public/dashboard-preview.png)

## 🎯 Project Overview

RicePestNet enables farmers and agricultural experts to collaborate in tracking pest outbreaks. The system facilitates:

- **Real-time Reporting**: Farmers can submit geotagged pest sighting reports.
- **Expert Verification**: Agronomists review and verify reports to ensure data accuracy.
- **Public Dashboard**: Visualizes verified outbreaks to help communities take preventive action.

## 🚀 Key Features

- **Multi-Step Survey Form**: Intuitive wizard with GPS auto-location and map previews.
- **Role-Based Access Control**:
  - **USER/Anonymous**: Submit reports, view public dashboard.
  - **EXPERT/ADMIN**: Verify reports, manage outbreak data.
- **Interactive Dashboard**: Filterable stats by province, pest type, and severity.
- **Organic White Theme**: Premium, nature-inspired design system.
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
