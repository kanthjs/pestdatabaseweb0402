# Landing Page Architecture Diagram (Updated 2026-02-08)

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
│  │  │  Hero Image (Top) - Rice Field with Gradient Overlay         │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                              ↓                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Content Card (Glassmorphism Overlap)                       │   │    │
│  │  │  ├─ Headline: "ปกป้องผลผลิตข้าวของคุณ ก่อนที่จะสายเกินไป"       │   │    │
│  │  │  ├─ CTA: [เข้าร่วมเครือข่าย (ฟรี)] [ดูข้อมูลศัตรูพืช]               │   │    │
│  │  │  └─ Stats: Members | Organizations | Confirmed Reports      │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  2. PROBLEM AGITATE                                                 │    │
│  │     src/components/landing/ProblemAgitate.tsx                       │    │
│  │                                                                     │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │    │
│  │  │  30% Loss   │  │  80% No Data │  │ 48hr Delay  │                 │    │
│  │  │ (Economic)  │  │ (Information)│  │ (Response)  │                 │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │    │
│  │                                                                     │    │
│  │  UI: Destructive-themed cards making status quo painful            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  3. VALUE STACK                                                     │    │
│  │     src/components/landing/ValueStack.tsx                           │    │
│  │                                                                     │    │
│  │  (01) Real-time Alerts      (02) Easy Reporting                    │    │
│  │  (03) Expert Verification   (04) Community & Training              │    │
│  │                                                                     │    │
│  │  BANNER: "ทั้งหมดนี้... ไม่มีค่าใช้จ่าย"                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  4. SOCIAL PROOF                                                    │    │
│  │     src/components/landing/SocialProof.tsx                          │    │
│  │                                                                     │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │    │
│  │  │ Testimonial │  │ Testimonial │  │ Testimonial │                 │    │
│  │  │ (Farmer)    │  │ (Expert)    │  │ (Official)  │                 │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │    │
│  │                                                                     │    │
│  │  PARTNERS: [RD] [MOAC] [NSTDA] [KU] [CMU] [KKU]                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  5. TRANSFORMATION (Timeline)                                       │    │
│  │     src/components/landing/Transformation.tsx                       │    │
│  │                                                                     │    │
│  │  [24h: Alerts] ──► [30d: Reports] ──► [6m: Local Expert]            │    │
│  │                                          │                        │    │
│  │                                          └──► [1y+: Regional Impact]  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  6. SECONDARY CTA                                                   │    │
│  │     src/components/landing/SecondaryCTA.tsx                         │    │
│  │                                                                     │    │
│  │  AVATAR STACK: [ส][ว][พ][อ][ม][+1,234]                              │    │
│  │  "พร้อมที่จะปกป้องพืชผลของคุณหรือยัง?"                               │    │
│  │  BUTTONS: [เข้าร่วมเครือข่ายเลย] [ดูข้อมูลเพิ่มเติม]                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  7. LANDING FOOTER                                                  │    │
│  │     src/components/landing/LandingFooter.tsx                        │    │
│  │                                                                     │    │
│  │  [Brand]   [Quick Links]   [Legal]   [Contact]                     │    │
│  │  [© 2025 Rice Pest Survey Network]                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

═══════════════════════════════════════════════════════════════════════════════
                              SHARED COMPONENTS
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│  UI Components (src/components/ui/)                                         │
│  ├─ Button: Custom variants for 'cta' (orange) and 'primary' (green)        │
│  ├─ Card: Standardized containers for sections                              │
│  └─ Material Icons: Used for all iconography                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  Navbar (src/components/Navbar.tsx)                                         │
│  ├─ Dynamic CTAs: Shows Login/Join for guests, Dashboard for members        │
│  └─ Sticky with glassmorphism effect                                        │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                              DATA FLOW
═══════════════════════════════════════════════════════════════════════════════

    Database (Prisma)
         │
         ├─ pestReport.count (APPROVED) ──┐
         │                                │
         └─ userProfile.count ────────────┤
                                          ▼
    src/app/page.tsx (Server Component)
         │
         ├─ reportCount ──┐
         ├─ memberCount ──┼──► Passed as props to:
         └─ orgCount(25) ─┘    LandingHero, SocialProof, SecondaryCTA

═══════════════════════════════════════════════════════════════════════════════
                              FILE STRUCTURE
═══════════════════════════════════════════════════════════════════════════════

src/
├── app/
│   └── page.tsx                    # Main landing entry (Direct Response focus)
│
├── components/
│   ├── landing/                    # High-conversion landing components
│   │   ├── index.ts                # Barrel exports
│   │   ├── LandingHero.tsx         # Hero with problem/solution focus
│   │   ├── ProblemAgitate.tsx      # Highlighting pain points
│   │   ├── ValueStack.tsx          # Benefit explanation (4 tiers)
│   │   ├── SocialProof.tsx         # Testimonials and partner logos
│   │   ├── Transformation.tsx      # Timeline of user progress
│   │   ├── SecondaryCTA.tsx        # Bottom catch-all CTA
│   │   └── LandingFooter.tsx       # Standard footer
│   │
│   └── ui/                         # Base design system components
│
└── lib/
    └── prisma.ts                   # Database client

═══════════════════════════════════════════════════════════════════════════════
                              COLOR SYSTEM (REFINED)
═══════════════════════════════════════════════════════════════════════════════

Primary:    #152B25 (Forest)    - Trust, Authority, Agriculture
Secondary:  #4BAF47 (Leaf)      - Growth, Verification, Success
CTA:        #F37335 (Orange)    - Action, Urgency, Contrast
Muted:      #FDFCF9 (Cream)     - Background stability
Destructive:#EF4444 (Red-Tint)  - Used in ProblemAgitate for pain points
