Landing Page Brief

inspiration website: <https://plantsurveillancenetwork.net.au/>

Goal of the page
Create a landing page inspired by the structure and intent of
plantsurveillancenetwork.net.au
The main goal is conversion: encourage visitors to Join the Network, while also explaining the importance of plant surveillance.

1. Overall Concept

A professional, trustworthy website for a specialist plant surveillance network

Clear separation between public information and member-only content

Simple, clean, and responsive (works well on desktop and mobile)

Every major section should reinforce the value of joining the network

1. Header & Navigation (Sticky Navbar)

Logo on the top-left corner

Navigation bar is sticky (always visible when scrolling)

On the right side of the navbar:

Join button (primary CTA)

Login button (for existing members)

1. Hero Section (Top of Page)

Purpose: instantly explain who this network is and what it does.

Clear headline explaining:

Who the network is

What the network does (plant surveillance, pest monitoring, expert collaboration)

Short supporting text (1–2 lines)

Primary Call-to-Action button:

"Join the Network"

1. The Problem / Value Proposition

Purpose: build awareness and importance.

Explain why plant surveillance is critical

Economic impact

Environmental protection

Early detection and rapid response

Emphasize consequences of not having effective surveillance

Keep language simple and authoritative

1. Role of the Network

Explain the role and mission of the network

What the network provides:

Knowledge sharing

Expert collaboration

Surveillance coordination

Reinforce that this is a trusted, specialist network

1. Network Activities

Describe key activities of the network

Monitoring

Reporting

Training / collaboration

End this section with a clear CTA:

Join the Network button

1. Network Status / Impact (Near Bottom)

Purpose: show credibility and scale.

Display key statistics:

Number of active members

Number of member organizations

Number of reports submitted

Below or beside this section:

Join the Network button (repeat CTA)

1. Member Organizations

Visual section with logos or images of member organizations

Show diversity and legitimacy of the network

1. Pest Surveillance & Reporting Section

Purpose: practical guidance + urgency.

"Keeping an eye on pests"

How to identify and report a suspect pest

Clear explanation of:

How to report

Why reporting is important

Emphasize early reporting and shared responsibility

1. Footer (Bottom of Page)

Privacy Policy

Disclaimer

Contact information

---

# Implementation Plan

## User Decisions
- **ภาษา:** ภาษาไทย (เนื้อหาทั้งหมด)
- **Member Organizations:** Static placeholders (เปลี่ยนทีหลังได้)
- **Hero Image:** ใช้รูปจาก homepage ปัจจุบัน

## Decision: Replace Current Homepage
แทนที่ `src/app/page.tsx` ปัจจุบันด้วย Landing Page ใหม่ เพราะ:
- URL `/` เหมาะสำหรับ conversion
- โครงสร้างเดิม (Hero + Features + Footer) สามารถขยายได้
- ไม่ต้องจัดการหลาย routes

---

## Sections to Implement

| # | Section | Component File |
|---|---------|----------------|
| 1 | Header & Navigation | Modify `Navbar.tsx` |
| 2 | Hero Section | `landing/LandingHero.tsx` |
| 3 | Value Proposition | `landing/ValueProposition.tsx` |
| 4 | Role of Network | `landing/NetworkRole.tsx` |
| 5 | Network Activities | `landing/NetworkActivities.tsx` |
| 6 | Network Statistics | `landing/NetworkStats.tsx` |
| 7 | Member Organizations | `landing/MemberOrganizations.tsx` |
| 8 | Pest Reporting Guide | `landing/PestReporting.tsx` |
| 9 | Footer | `landing/LandingFooter.tsx` |

---

## File Structure

```
src/
├── app/
│   └── page.tsx                    # MODIFY: แทนที่ด้วย landing sections
│
├── components/
│   ├── Navbar.tsx                  # MODIFY: เพิ่ม Join/Login CTAs
│   ├── landing/                    # NEW DIRECTORY
│   │   ├── index.ts                # Barrel exports
│   │   ├── LandingHero.tsx
│   │   ├── ValueProposition.tsx
│   │   ├── NetworkRole.tsx
│   │   ├── NetworkActivities.tsx
│   │   ├── NetworkStats.tsx
│   │   ├── MemberOrganizations.tsx
│   │   ├── PestReporting.tsx
│   │   ├── LandingFooter.tsx
│   │   └── CTABanner.tsx           # Reusable CTA
│   │
│   └── ui/
│       └── button.tsx              # MODIFY: เพิ่ม 'cta' variant
│
└── public/
    └── logos/                      # NEW: organization logos
```

---

## Components to Reuse

| Component | Location | Usage |
|-----------|----------|-------|
| `Button` | `ui/button.tsx` | CTAs (เพิ่ม cta variant) |
| `Card` | `ui/card.tsx` | Feature/Activity cards |
| `Badge` | `ui/badge.tsx` | Status indicators |
| `ThemeToggle` | `ThemeToggle.tsx` | Keep in navbar |
| Animations | `globals.css` | `fadeInUp`, `fadeInUpRight` |
| Color System | `globals.css` | Primary, Secondary, CTA colors |

---

## Section Details

### 1. Navbar Modification
**File:** `src/components/Navbar.tsx`
- เพิ่มปุ่ม "Join the Network" (สี orange/cta)
- เพิ่มปุ่ม "Login" (outline style)
- ซ่อน NotificationBell สำหรับ non-authenticated users

### 2. LandingHero
- Two-column layout (text left, image right)
- Headline: เกี่ยวกับ Network identity
- Primary CTA: "Join the Network"
- Stats: Active Members, Partner Organizations, Reports Submitted

### 3. ValueProposition
- 3-column grid layout
- Cards: Economic Impact, Environmental Protection, Early Detection
- ใช้ Card component กับ hover effects

### 4. NetworkRole
- Two-column (reversed: image left, text right)
- Mission statement + bullet points
- Knowledge sharing, Expert collaboration, Surveillance coordination

### 5. NetworkActivities
- 3-column grid
- Cards: Monitoring, Reporting, Training/Collaboration
- CTA Banner ด้านล่าง

### 6. NetworkStats
- Large statistics display
- Fetch จาก database:
  - `prisma.pestReport.count()`
  - `prisma.userProfile.count()`
  - Organizations count (static หรือ hardcode ก่อน)

### 7. MemberOrganizations
- Grid of logos (2 cols mobile, 6 cols desktop)
- Static images ใน `/public/logos/`

### 8. PestReporting
- Two-column layout
- Steps to report (1. Identify, 2. Document, 3. Submit, 4. Review)
- Links to `/survey` และ `/signup`

### 9. LandingFooter
- 4-column grid (Brand, Quick Links, Legal, Contact)
- Copyright bar

---

## Data Fetching (Server-Side)

```typescript
// src/app/page.tsx
const [reportCount, memberCount] = await Promise.all([
  prisma.pestReport.count({ where: { status: ReportStatus.APPROVED } }),
  prisma.userProfile.count(),
]);

const stats = {
  reports: reportCount,
  members: memberCount,
  organizations: 25, // Hardcode initially
};
```

---

## Implementation Sequence

### Phase 1: Foundation
1. สร้าง `src/components/landing/` directory
2. เพิ่ม CTA variant ใน Button component
3. สร้าง `CTABanner` component
4. สร้าง `index.ts` barrel export

### Phase 2: Core Sections
5. สร้าง `LandingHero`
6. สร้าง `ValueProposition`
7. สร้าง `NetworkRole`
8. สร้าง `NetworkActivities`

### Phase 3: Data-Driven
9. สร้าง `NetworkStats`
10. Setup stats data fetching
11. สร้าง `MemberOrganizations` (static)
12. เพิ่ม placeholder logos

### Phase 4: Supporting
13. สร้าง `PestReporting`
14. สร้าง `LandingFooter`
15. Modify Navbar

### Phase 5: Integration
16. แทนที่ `page.tsx`
17. Test responsive design
18. Test light/dark theme

---

## Responsive Design

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero | Stack | Stack | Side-by-side |
| Feature grids | 1 col | 2 col | 3 col |
| Member logos | 2 col | 4 col | 6 col |
| Footer | Stack | 2 col | 4 col |

---

## Verification Steps

1. **Visual Testing:**
   - Desktop: 1920px, 1440px, 1024px
   - Tablet: 768px
   - Mobile: 375px, 414px

2. **Functionality:**
   - All CTAs link correctly
   - Mobile menu works
   - Stats load from database

3. **Theme:**
   - Test light mode
   - Test dark mode

4. **Performance:**
   - Lighthouse audit > 90

---

## Critical Files

- `src/app/page.tsx` - Main file to replace
- `src/components/Navbar.tsx` - Add Join/Login CTAs
- `src/components/ui/button.tsx` - Add CTA variant
- `src/app/globals.css` - Color system reference
