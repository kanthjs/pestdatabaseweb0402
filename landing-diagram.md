# Landing Page Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LANDING PAGE (/)                                │
│                           src/app/page.tsx                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  1. LANDING HERO                                                    │    │
│  │     src/components/landing/LandingHero.tsx                          │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Hero Image (Full Width)                                    │   │    │
│  │  │  - รูปทุ่งนาข้าว                                            │   │    │
│  │  │  - Gradient Overlay                                         │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                              ↓                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Content Card (Overlap)                                     │   │    │
│  │  │  ├─ Headline: "เครือข่ายเฝ้าระวังศัตรูพืชข้าวแห่งประเทศไทย" │   │    │
│  │  │  ├─ Description                                            │   │    │
│  │  │  ├─ CTA Buttons: [เข้าร่วมเครือข่าย] [ดูข้อมูลศัตรูพืช]     │   │    │
│  │  │  └─ Stats: สมาชิก | หน่วยงาน | รายงาน                       │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  DATA: reportCount, memberCount, organizationCount (from Prisma)   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  2. VALUE PROPOSITION                                               │    │
│  │     src/components/landing/ValueProposition.tsx                     │    │
│  │                                                                     │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │    │
│  │  │   ผลกระทบ   │  │  การปกป้อง  │  │  การตรวจจับ │                 │    │
│  │  │ ทางเศรษฐกิจ │  │สิ่งแวดล้อม  │  │  ที่รวดเร็ว │                 │    │
│  │  │  (trending) │  │  (forest)   │  │   (speed)   │                 │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │    │
│  │                                                                     │    │
│  │  UI: Card components with hover effects                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  3. NETWORK ROLE                                                    │    │
│  │     src/components/landing/NetworkRole.tsx                          │    │
│  │                                                                     │    │
│  │  ┌────────────────────────┐  ┌─────────────────────────────────┐   │    │
│  │  │                        │  │  • การแลกเปลี่ยนความรู้         │   │    │
│  │  │    Hero Image          │  │  • การร่วมมือกับผู้เชี่ยวชาญ    │   │    │
│  │  │    (Rice Field)        │  │  • การประสานงานการเฝ้าระวัง     │   │    │
│  │  │                        │  │                                  │   │    │
│  │  └────────────────────────┘  └─────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  LAYOUT: Image Left | Content Right                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  4. NETWORK ACTIVITIES                                              │    │
│  │     src/components/landing/NetworkActivities.tsx                    │    │
│  │                                                                     │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │    │
│  │  │  เฝ้าระวัง  │  │   รายงาน    │  │  อบรม/ร่วม  │                 │    │
│  │  │ (monitoring)│  │(assignment) │  │   มือ      │                 │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │    │
│  │                              ↓                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │              CTABanner (Reusable Component)                 │   │    │
│  │  │         "พร้อมที่จะเข้าร่วมกับเราหรือยัง"                   │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  IMPORTS: Card, CTABanner                                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  5. NETWORK STATS                                                   │    │
│  │     src/components/landing/NetworkStats.tsx                         │    │
│  │                                                                     │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │    │
│  │  │   1,234+        │  │       25        │  │   5,678+        │     │    │
│  │  │  สมาชิกที่ใช้งาน │  │ หน่วยงานพันธมิตร │  │ รายงานที่ยืนยัน │     │    │
│  │  │  (Animated)     │  │                 │  │   (Animated)    │     │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘     │    │
│  │                                                                     │    │
│  │  FEATURE: AnimatedNumber (Intersection Observer)                   │    │
│  │  DATA: reports, members, organizations (from props)                │    │
│  │  STYLE: Dark background (bg-primary) with orange numbers           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  6. MEMBER ORGANIZATIONS                                            │    │
│  │     src/components/landing/MemberOrganizations.tsx                  │    │
│  │                                                                     │    │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                        │    │
│  │  │ RD │ │MOAC│ │NSTDA│ │ KU │ │CMU │ │KKU │  (Placeholder logos)  │    │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                        │    │
│  │                                                                     │    │
│  │  NOTE: Static placeholders - can be replaced with real logos       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  7. PEST REPORTING                                                  │    │
│  │     src/components/landing/PestReporting.tsx                        │    │
│  │                                                                     │    │
│  │  ┌────────────────────────┐  ┌─────────────────────────────────┐   │    │
│  │  │  วิธีการรายงานศัตรูพืช  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │   │    │
│  │  │                          │  │  │ 01 │ │ 02 │ │ 03 │ │ 04 │  │   │    │
│  │  │  • รายงานง่าย            │  │  │สัง │ │ถ่าย│ │ส่ง │ │รอ  │  │   │    │
│  │  │  • ตรวจสอบโดยผู้เชี่ยวชาญ│  │  │เกต │ │ภาพ │ │ราย│ │ตรว│  │   │    │
│  │  │  • มีส่วนร่วม            │  │  │    │ │    │ │งาน│ │สอบ│  │   │    │
│  │  │                          │  │  └────┘ └────┘ └────┘ └────┘  │   │    │
│  │  │  [รายงานศัตรูพืช]        │  │      4 Steps Grid             │   │    │
│  │  │  [สมัครสมาชิก]           │  │                                 │   │    │
│  │  └────────────────────────┘  └─────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  LAYOUT: Content Left | Steps Grid Right                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  8. LANDING FOOTER                                                  │    │
│  │     src/components/landing/LandingFooter.tsx                        │    │
│  │                                                                     │    │
│  │  ┌──────────┬──────────┬──────────┬──────────┐                     │    │
│  │  │  Brand   │ ลิงก์ด่วน │  กฎหมาย  │  ติดต่อ  │                     │    │
│  │  │RicePest  │ หน้าหลัก │ นโยบาย  │  email   │                     │    │
│  │  │   Net    │ข้อมูล    │ ข้อกำหนด │  phone   │                     │    │
│  │  │          │รายงาน    │ คำชี้แจง │  location│                     │    │
│  │  └──────────┴──────────┴──────────┴──────────┘                     │    │
│  │                              ↓                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │              © 2025 Rice Pest Survey Network                │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  STYLE: Dark background (bg-primary)                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                              SHARED COMPONENTS
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│  CTABanner.tsx (Reusable)                                                   │
│  ├─ Used in: NetworkActivities                                              │
│  ├─ Props: title, description, buttonText, href                             │
│  └─ Style: bg-primary, rounded-2xl, centered                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  UI Components (from src/components/ui/)                                    │
│  ├─ Button (with 'cta' variant)                                             │
│  ├─ Card, CardHeader, CardContent, CardTitle                               │
│  └─ Badge (if needed)                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  Navbar (Modified)                                                          │
│  src/components/Navbar.tsx                                                   │
│  ├─ Added: "เข้าร่วมเครือข่าย" button (cta style)                           │
│  ├─ Added: "เข้าสู่ระบบ" button (outline style)                             │
│  └─ Hidden: NotificationBell for non-authenticated users                    │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                              DATA FLOW
═══════════════════════════════════════════════════════════════════════════════

    Database (Prisma)
         │
         ├─ prisma.pestReport.count ───┐
         │                               │
         └─ prisma.userProfile.count ───┤
                                          ▼
    src/app/page.tsx (Server Component)
         │
         ├─ reportCount ───┐
         ├─ memberCount ───┼──► LandingHero, NetworkStats
         └─ orgCount=25 ───┘
                                           │
                                           ▼
    Client Components
         │
         ├─ NetworkStats ──► AnimatedNumber (Intersection Observer)
         │
         └─ All Sections ──► Responsive Design (Mobile/Tablet/Desktop)

═══════════════════════════════════════════════════════════════════════════════
                              FILE STRUCTURE
═══════════════════════════════════════════════════════════════════════════════

src/
├── app/
│   └── page.tsx                    # Main landing page (imports all sections)
│
├── components/
│   ├── Navbar.tsx                  # MODIFIED: Added Join/Login CTAs
│   │
│   ├── landing/                    # NEW DIRECTORY
│   │   ├── index.ts                # Barrel exports
│   │   ├── LandingHero.tsx         # Hero with image + content card
│   │   ├── ValueProposition.tsx    # 3 cards: Economic/Environment/Detection
│   │   ├── NetworkRole.tsx         # Image left, mission right
│   │   ├── NetworkActivities.tsx   # 3 activity cards + CTABanner
│   │   ├── NetworkStats.tsx        # Animated statistics
│   │   ├── MemberOrganizations.tsx # Logo grid (placeholders)
│   │   ├── PestReporting.tsx       # 4-step reporting guide
│   │   ├── LandingFooter.tsx       # 4-column footer
│   │   └── CTABanner.tsx           # Reusable CTA component
│   │
│   └── ui/
│       └── button.tsx              # MODIFIED: Added 'cta' variant
│
└── public/
    └── logos/                      # Placeholder for organization logos

═══════════════════════════════════════════════════════════════════════════════
                              COLOR SYSTEM
═══════════════════════════════════════════════════════════════════════════════

Primary:    #152B25 (fresh-forest) - Headings, buttons
Secondary:  #4BAF47 (fresh-leaf)   - Icons, accents
CTA:        #F37335 (fresh-orange) - Call-to-action buttons
Background: #FDFCF9 (cream-bg)      - Page background

Dark Mode:  Forest Night Theme (adapted automatically)
