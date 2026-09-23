# Kolkata Nights — Hero Page Design Specification

**Project**: Kolkata Nights (EventHub)
**Design System Version**: 1.0.0
**Date**: 2026-09-23
**Platform**: Mobile-first responsive web application
**Tech Stack**: React 19, Tailwind CSS v4, Framer Motion, Lucide Icons

---

## 1. Design Overview

**Kolkata Nights** is a dark-themed, nightlife-focused event discovery platform for Kolkata. The design follows a **mobile-first** approach with a **rich dark UI**, vibrant coral-red accent color, card-based layout, and horizontal scroll patterns. The aesthetic is moody, premium, and immersive — designed to evoke the energy of Kolkata's nightlife.

---

## 2. Color Palette & Design Tokens

### 2.1 Primary Colors

| Token               | Value (Hex)   | OKLCH Value                    | Usage                                |
|---------------------|---------------|--------------------------------|--------------------------------------|
| `--kn-red-50`       | `#FFF1F2`    | `oklch(0.97 0.02 15)`         | Light tints                          |
| `--kn-red-100`      | `#FFE4E6`    | `oklch(0.93 0.04 15)`         | Subtle backgrounds                   |
| `--kn-red-200`      | `#FECDD3`    | `oklch(0.87 0.08 15)`         | Hover states (dark mode)             |
| `--kn-red-300`      | `#FDA4AF`    | `oklch(0.78 0.12 15)`         | Light accent                         |
| `--kn-red-400`      | `#FB7185`    | `oklch(0.72 0.16 15)`         | Secondary accent                     |
| `--kn-red-500`      | `#F43F5E`    | `oklch(0.65 0.20 15)`         | Primary accent / CTA buttons         |
| `--kn-red-600`      | `#E11D48`    | `oklch(0.58 0.22 15)`         | Hover state for CTAs                 |
| `--kn-red-700`      | `#BE123C`    | `oklch(0.50 0.20 15)`         | Active/pressed state                 |
| `--kn-red-800`      | `#9F1239`    | `oklch(0.43 0.18 15)`         | Deep accent                          |
| `--kn-red-900`      | `#881337`    | `oklch(0.37 0.15 15)`         | Darkest accent                       |

### 2.2 Surface / Background Colors (Dark Theme)

| Token               | Value (Hex)   | OKLCH Value                    | Usage                                |
|---------------------|---------------|--------------------------------|--------------------------------------|
| `--kn-bg-base`      | `#0A0A0F`    | `oklch(0.08 0.01 280)`        | Page body background                 |
| `--kn-bg-elevated`  | `#111118`    | `oklch(0.11 0.01 280)`        | Cards, sections                      |
| `--kn-bg-surface`   | `#1A1A24`    | `oklch(0.15 0.01 280)`        | Elevated cards, input backgrounds    |
| `--kn-bg-hover`     | `#222230`    | `oklch(0.19 0.01 280)`        | Hover states                         |
| `--kn-bg-overlay`   | `rgba(0,0,0,0.6)` | —                         | Modal overlays, hero gradient        |

### 2.3 Text Colors

| Token               | Value (Hex)   | Usage                                |
|---------------------|---------------|--------------------------------------|
| `--kn-text-primary` | `#FFFFFF`    | Headings, primary content            |
| `--kn-text-secondary`| `#A0A0B8`   | Descriptions, meta info              |
| `--kn-text-tertiary`| `#6B6B80`   | Disabled, subtle labels              |
| `--kn-text-accent`  | `#F43F5E`   | Links, highlighted text              |
| `--kn-text-on-accent`| `#FFFFFF`  | Text on red backgrounds              |

### 2.4 Semantic Colors

| Token               | Value (Hex)   | Usage                                |
|---------------------|---------------|--------------------------------------|
| `--kn-success`      | `#10B981`   | Location dots, success badges        |
| `--kn-warning`      | `#F59E0B`   | "Same Day" badges, urgency           |
| `--kn-info`         | `#3B82F6`   | Informational badges                 |
| `--kn-orange`       | `#F97316`   | Weekend specials accent              |
| `--kn-green-accent` | `#22C55E`   | Advance booking accent               |

### 2.5 Border Colors

| Token               | Value (Hex)   | Usage                                |
|---------------------|---------------|--------------------------------------|
| `--kn-border`       | `#1E1E2E`   | Card borders, dividers               |
| `--kn-border-hover` | `#2A2A3C`   | Hover state borders                  |
| `--kn-border-accent`| `#F43F5E`   | Featured card borders (red glow)     |

---

## 3. Typography System

### 3.1 Font Families

| Token                | Font Stack                                           | Usage            |
|----------------------|------------------------------------------------------|------------------|
| `--font-display`     | `'Plus Jakarta Sans', 'Inter', sans-serif`           | Headings, hero   |
| `--font-body`        | `'Inter', system-ui, -apple-system, sans-serif`      | Body text, UI    |
| `--font-mono`        | `'JetBrains Mono', monospace`                        | Code, prices     |

### 3.2 Type Scale

| Scale Name  | Size   | Weight | Line Height | Letter Spacing | Usage                                |
|-------------|--------|--------|-------------|----------------|--------------------------------------|
| `display`   | 36px   | 800    | 1.1         | -0.02em        | Hero headline                        |
| `h1`        | 28px   | 700    | 1.2         | -0.01em        | Section titles ("In The Spotlight")  |
| `h2`        | 22px   | 700    | 1.3         | -0.01em        | Sub-section headings                 |
| `h3`        | 18px   | 600    | 1.3         | 0              | Card titles                          |
| `h4`        | 16px   | 600    | 1.4         | 0              | Plan card headings                   |
| `body-lg`   | 15px   | 400    | 1.6         | 0              | Hero description, featured text      |
| `body`      | 14px   | 400    | 1.5         | 0              | Card descriptions, body content      |
| `body-sm`   | 13px   | 400    | 1.4         | 0              | Meta info, secondary text            |
| `caption`   | 12px   | 500    | 1.3         | 0.01em         | Badge text, labels, timestamps       |
| `overline`  | 10px   | 700    | 1.2         | 0.1em          | Section labels (uppercase), tags     |
| `price`     | 18px   | 700    | 1.0         | 0              | Price display                        |
| `price-sm`  | 14px   | 600    | 1.0         | 0              | Card price                           |

### 3.3 Text Styles (Tailwind Classes)

```css
/* Hero Display */
.text-hero { font-size: 2.25rem; font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; }

/* Section Heading */
.text-section { font-size: 1.75rem; font-weight: 700; line-height: 1.2; }

/* Overline (section labels) */
.text-overline { font-size: 0.625rem; font-weight: 700; line-height: 1.2; letter-spacing: 0.1em; text-transform: uppercase; }

/* Card Title */
.text-card-title { font-size: 1rem; font-weight: 600; line-height: 1.3; }

/* Price */
.text-price { font-size: 1.125rem; font-weight: 700; line-height: 1.0; }
```

---

## 4. Spacing System

### 4.1 Base Unit

**Base unit: 4px** — All spacing values are multiples of 4px.

### 4.2 Spacing Scale

| Token          | Value   | Usage                                            |
|----------------|---------|--------------------------------------------------|
| `--space-0`    | 0px     | Reset                                            |
| `--space-0.5`  | 2px     | Tight inline gaps                                |
| `--space-1`    | 4px     | Icon gaps, badge padding                         |
| `--space-1.5`  | 6px     | Small internal spacing                           |
| `--space-2`    | 8px     | Card internal spacing, item gaps                 |
| `--space-2.5`  | 10px    | Compact padding                                  |
| `--space-3`    | 12px    | Card padding, input padding                      |
| `--space-4`    | 16px    | Section horizontal padding, standard gaps        |
| `--space-5`    | 20px    | Card padding (large), grid gaps                  |
| `--space-6`    | 24px    | Section vertical spacing                         |
| `--space-8`    | 32px    | Major section separation                         |
| `--space-10`   | 40px    | Hero section spacing                             |
| `--space-12`   | 48px    | Footer spacing                                   |
| `--space-16`   | 64px    | Maximum spacing                                  |

### 4.3 Section Padding

| Element             | Mobile            | Tablet+           |
|---------------------|-------------------|-------------------|
| Page horizontal     | `px-4` (16px)     | `px-6` (24px)     |
| Section vertical    | `py-6` (24px)     | `py-8` (32px)     |
| Card padding        | `p-3` (12px)      | `p-4` (16px)      |
| Hero padding        | `py-8` (32px)     | `py-12` (48px)    |
| Footer padding      | `py-8` (32px)     | `py-10` (40px)    |

---

## 5. Border Radius

| Token             | Value    | Usage                                    |
|-------------------|----------|------------------------------------------|
| `--radius-sm`     | 6px      | Small badges, compact elements           |
| `--radius-md`     | 8px      | Standard cards, inputs                   |
| `--radius-lg`     | 12px     | Large cards, elevated panels             |
| `--radius-xl`     | 16px     | Feature cards, plan cards                |
| `--radius-2xl`    | 20px     | Hero cards, spotlight cards              |
| `--radius-full`   | 9999px   | Pills, badges, avatars, circular buttons |

---

## 6. Shadows & Elevation

| Token             | Value                                                       | Usage                |
|-------------------|-------------------------------------------------------------|----------------------|
| `--shadow-card`   | `0 2px 8px rgba(0,0,0,0.4)`                               | Standard cards       |
| `--shadow-card-hover` | `0 8px 24px rgba(0,0,0,0.6)`                           | Card hover           |
| `--shadow-elevated` | `0 12px 32px rgba(0,0,0,0.5)`                           | Elevated panels     |
| `--shadow-glow-red` | `0 0 20px rgba(244,63,94,0.15)`                          | Red accent glow      |
| `--shadow-glow-green` | `0 0 16px rgba(16,185,129,0.12)`                       | Success glow         |
| `--shadow-button` | `0 4px 12px rgba(244,63,94,0.3)`                          | CTA button shadow    |
| `--shadow-nav`    | `0 1px 3px rgba(0,0,0,0.3)`                               | Navigation bar       |

### 6.1 Elevation Levels

| Level | Shadow            | Usage                                  |
|-------|-------------------|----------------------------------------|
| 0     | None              | Flat elements, background cards        |
| 1     | `--shadow-card`   | Standard cards, list items             |
| 2     | `--shadow-card-hover` | Hover states, active cards        |
| 3     | `--shadow-elevated` | Modals, floating elements, nav bars |

---

## 7. Component Inventory

### 7.1 Navigation Bar (Header)

**Desktop (≥768px)**:
- Fixed top, full width, height: 64px
- Background: `--kn-bg-base` with `backdrop-blur-lg` + bottom border
- Left: Logo + brand name
- Center: Navigation links (Explore Events, Categories, Dining & Deals, Heritage, Sports Mania, My Bookings)
- Right: Search icon, location pin + "Kolkata" dropdown, user avatar

**Mobile (<768px)**:
- Fixed top, height: 56px
- Left: Hamburger menu (3-line icon)
- Center: Logo + "KOLKATA NIGHTS" brand name
- Right: Search icon, user avatar icon

**Mobile Menu (Bottom Sheet)**:
- Slides up from bottom
- Full-screen overlay with `--kn-bg-base` background
- Navigation links stacked vertically
- Close button (X) at top-right

**shadcn mapping**: Custom component — extends `NavigationMenu` or build from primitives

### 7.2 Hero Section

**Layout**: Full-width, vertically centered content with dark gradient overlay

**Structure**:
```
┌─────────────────────────────────────┐
│  [Background Image: Kolkata nightlife]│
│  [Dark gradient overlay: top→bottom]  │
│                                       │
│  ┌─ Badge ─────────────────────────┐  │
│  │ ★ EXCLUSIVE CITY SPOTLIGHT      │  │
│  └─────────────────────────────────┘  │
│                                       │
│  Discover the best                   │
│  events & nightlife in               │
│  ┌──────────────┐                    │
│  │ Kolkata      │ ← red highlight    │
│  └──────────────┘                    │
│                                       │
│  From high-octane Park Street...     │
│  [description text]                   │
│                                       │
│  [Explore Top Events →] [Browse by   │
│                          Neighborhood]│
│                                       │
│  🔴 Over 120+ live gigs this weekend │
└─────────────────────────────────────┘
```

**Components**:
- **Spotlight Badge**: Pill shape, `--kn-red-500` background, white text, star icon left
- **Headline**: `display` scale, white, bold, `Plus Jakarta Sans`
- **"Kolkata" highlight**: `--kn-red-500` color, same font weight
- **Description**: `body-lg`, `--kn-text-secondary`
- **Primary CTA**: Red filled button with right arrow icon, rounded-full, height 48px
- **Secondary CTA**: Outline/ghost button, white border, rounded-full, height 48px
- **Live indicator**: Small pill, `--kn-green-accent` dot (animated pulse), white text

**shadcn mapping**: Custom section; use `Badge` for spotlight, `Button` for CTAs

### 7.3 Category Chips (Horizontal Scroll)

**Layout**: Horizontal scroll row, no scrollbar visible, `overflow-x: auto`, `scroll-snap-type: x mandatory`

**Components**:
- **Category Chip**: Pill/rounded-full, 64px height, icon + label stacked vertically
- **Default state**: `--kn-bg-surface` background, `--kn-text-secondary` text
- **Active state**: `--kn-red-500` background (gradient glow), white text, subtle red shadow
- **Icons**: 24px, centered above label

**Categories**: Music, Dining, Art & Visuals, Nightlife, Sports, Heritage, Startup, Screenings

**shadcn mapping**: Custom `ScrollArea` + `ToggleGroup` pattern

### 7.4 Plan Cards (Horizontal Row)

**Layout**: 3 cards in horizontal scroll, equal width (min 280px)

**Card Variants**:

| Variant       | Left Border Color | Badge Color      | Badge Text          | Title                     |
|---------------|-------------------|------------------|----------------------|---------------------------|
| Same Day      | `--kn-red-500`   | `--kn-red-500`   | "SAME DAY PASSES"    | "PLANS FOR TODAY"         |
| Advance       | `--kn-green-accent`| `--kn-green-accent`| "ADVANCE BOOKINGS" | "PLANS FOR TOMORROW"      |
| Weekend       | `--kn-orange`    | `--kn-orange`    | "FRI-SUN SPECIALS"   | "PLANS FOR WEEKEND"       |

**Card Structure**:
```
┌─ Left border (4px, colored) ─────────────────────┐
│  [BADGE]  ← small colored pill, uppercase        │
│  [TITLE]  ← white, bold, 16px                    │
│  [Subtitle] ← gray, 12px, description text       │
└──────────────────────────────────────────────────┘
```

**Dimensions**: Height ~90px, min-width 280px, `p-4`, `rounded-lg`, `--kn-bg-elevated` background

**shadcn mapping**: Custom `Card` with colored left border

### 7.5 Event Cards (Trending Today / Spotlight)

**Layout**: Horizontal scroll row, 3 visible on mobile, snap scroll

**Card Structure**:
```
┌────────────────────────────────┐
│  [Image]                       │
│  ┌─ Live badge ─┐  ┌─ Date ─┐ │
│  │ 🔴 LIVE NOW  │  │ Sat 27 │ │
│  └──────────────┘  └────────┘ │
│  ┌─ Bookmark icon (top-right)─┐│
│  │            🔖              ││
│  └────────────────────────────┘│
│                                │
│  Event Title                   │
│  📍 Location                   │
│                                │
│  STARTING FROM                 │
│  ₹1,599 onwards    [Book Ticket]│
└────────────────────────────────┘
```

**Dimensions**:
- Width: ~260px (mobile), 320px (tablet+)
- Image height: ~160px
- Card border-radius: `--radius-lg` (12px)
- Card background: `--kn-bg-elevated`

**Sub-components**:
- **Image Container**: Rounded top, 160px height, `object-fit: cover`, dark gradient overlay at bottom
- **Live Badge**: Red pill, `--kn-red-500` bg, white text, 10px font, pulse dot, top-left absolute
- **Date Badge**: Dark translucent pill, top-right absolute, calendar icon + date text
- **Bookmark Button**: 32px circle, `--kn-bg-surface` bg, heart/bookmark icon, top-right absolute
- **Title**: `h3` scale, white, 1 line clamp
- **Location**: Green dot + text, `--kn-text-secondary`, 12px
- **Price Section**: "STARTING FROM" overline label (10px, uppercase, `--kn-text-tertiary`), price in white bold
- **CTA Button**: "Book Ticket" — `--kn-red-500` bg, white text, rounded-full, `h-9 px-4`, 13px font

**shadcn mapping**: Custom card component extending `Card`

### 7.6 Spotlight Cards

**Layout**: 3 cards in horizontal scroll

**Card Structure** (same as Event Cards but with category tag overlays):

**Tag Variants**:
| Tag Text                | Background Color        | Usage                    |
|-------------------------|-------------------------|--------------------------|
| "BOLLYWOOD MUSIC PARTY" | `--kn-red-500`          | Music events             |
| "INTERNATIONAL HEADLINER"| `--kn-green-accent`    | International events     |
| "LOCAL MOTION PICTURES" | `--kn-surface-800` (dark brown/gray) | Local/cultural events |

- **"Grab Passes"** CTA button: Same as "Book Ticket" but text variant

### 7.7 Dining / Deals Cards

**Layout**: Horizontal scroll, 4 visible on desktop, 1.5 on mobile

**Card Structure**:
```
┌────────────────────────────────┐
│  [Image]                       │
│  ┌─ Discount badge ──────────┐ │
│  │ 🔥 Flat 20% off on Buffet │ │
│  └───────────────────────────┘ │
│  ┌─ Promo tag ───────────────┐ │
│  │ ✨ Flat 20% off + ₹2000  │ │
│  └───────────────────────────┘ │
│                                │
│  Venue Name                    │
│  Location · Rating             │
│                                │
│  AVERAGE                       │
│  ₹2,999/two    [Reserve]      │
└────────────────────────────────┘
```

**Sub-components**:
- **Discount Badge**: Red pill, positioned bottom-left on image, "Flat X% off" text
- **Promo Tag**: Small pill below image, green or red background, promotional text
- **Rating**: Star icon + numeric rating
- **"Reserve" Button**: Outline style, `--kn-red-500` border, rounded-full

### 7.8 Heritage Tour Cards

**Layout**: 3 cards in horizontal scroll

**Card Structure**:
```
┌────────────────────────────────┐
│  [Image]  ┌─ Tour type pill ─┐ │
│           │ 📍 Outdoor/Venue │ │
│           └──────────────────┘ │
│                                │
│  Tour Name                     │
│  Distance · Trail info         │
│                                │
│  ₹299 onwards    [Book Tour]  │
└────────────────────────────────┘
```

### 7.9 Feature Cards (After Office Hours / Sports Mania)

**Layout**: 2-column grid on desktop, stacked on mobile

**Left Card — "After Office Hours"**:
- Dark card with `--kn-border-accent` (red border, 1-2px)
- "KOLKATA DIARY FEATURE" badge (red pill)
- Title: "AFTER OFFICE HOURS" in large white bold text
- Description paragraph
- CTA: "EXPLORE HANGOUTS" — red outline button, rounded-full

**Right Card — "Sports Mania"**:
- "LIVE ARENA SCREENINGS" badge (dark pill)
- "Sports Mania" heading
- Match card: Team flags vs Team flags with score/time
- Includes package info
- Price + "Reserve Seat" button
- "Full Schedule →" link

### 7.10 Footer

**Layout**: Dark background (`--kn-bg-elevated`), 4-column grid on desktop, stacked on mobile

**Sections**:
1. **Brand**: Logo + "KOLKATA NIGHTS" + description paragraph + social icons row
2. **DISCOVER**: Link list (Park Street Nightlife, Salt Lake Live Venues, etc.)
3. **FOR ORGANIZERS**: Link list (List an Event, Townhall by Kolkata Nights, etc.)
4. **GET THE MOBILE APP**: App Store + Google Play buttons

**Bottom Bar**: Copyright text + legal links (Privacy Policy, Terms of Service, etc.)

---

## 8. Layout System

### 8.1 Breakpoints

| Breakpoint | Width     | Columns | Gutter | Container Max |
|------------|-----------|---------|--------|---------------|
| Mobile     | <640px    | 1       | 16px   | 100%          |
| Tablet     | 640-768px | 2       | 16px   | 100%          |
| Desktop    | 768-1024px| 3       | 24px   | 1024px        |
| Wide       | ≥1024px   | 4       | 24px   | 1200px        |

### 8.2 Grid System

```css
/* Mobile: single column, 16px horizontal padding */
.container {
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
  margin: 0 auto;
}

/* Tablet+: wider padding */
@media (min-width: 768px) {
  .container { max-width: 1024px; padding: 0 24px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1200px; }
}
```

### 8.3 Horizontal Scroll Sections

All card carousels use this pattern:

```css
.scroll-container {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;       /* Firefox */
  padding-bottom: 8px;        /* Prevent cut-off */
}
.scroll-container::-webkit-scrollbar { display: none; }

.scroll-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
}
```

### 8.4 Section Layout Pattern

```
┌─ Section ────────────────────────────────────────┐
│  [Container px-4]                                │
│  ┌─ Section Header ──────────────────────────┐   │
│  │  [Overline Label]            [View All →] │   │
│  │  [Section Title]                          │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  ┌─ Content Area ────────────────────────────┐   │
│  │  [Cards / Grid / Scroll]                  │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  [Section spacing: py-6 mobile, py-8 desktop]   │
└──────────────────────────────────────────────────┘
```

---

## 9. Interactive Elements & States

### 9.1 Button States

| State    | Primary (Red)                           | Outline                                 | Ghost                            |
|----------|-----------------------------------------|-----------------------------------------|----------------------------------|
| Default  | `bg-[#F43F5E] text-white`              | `border border-[#F43F5E] text-[#F43F5E]`| `text-white/70`                 |
| Hover    | `bg-[#E11D48]` + shadow                | `bg-[#F43F5E]/10`                       | `bg-white/10`                   |
| Active   | `bg-[#BE123C] scale-[0.98]`            | `bg-[#F43F5E]/20 scale-[0.98]`          | `bg-white/15 scale-[0.98]`      |
| Disabled | `opacity-50 cursor-not-allowed`         | `opacity-50 cursor-not-allowed`          | `opacity-50 cursor-not-allowed` |
| Loading  | Spinner replacing left icon             | Spinner replacing left icon             | Spinner replacing left icon     |

### 9.2 Card Hover States

- **Translate**: `translateY(-2px)` on hover
- **Shadow**: Transition from `--shadow-card` to `--shadow-card-hover`
- **Border**: Subtle border color change on hover
- **Duration**: `200ms ease-out`

### 9.3 Scroll Indicators

- Hide native scrollbar: `scrollbar-width: none`
- Optional: Fade edges to indicate more content (CSS gradient mask)

### 9.4 Touch Interactions (Mobile)

| Interaction     | Element                    | Behavior                                      |
|-----------------|----------------------------|-----------------------------------------------|
| Tap             | Any button                 | `scale(0.98)` momentary feedback              |
| Swipe           | Card carousel              | Horizontal scroll with momentum               |
| Long press      | Event card                 | Open context menu / quick actions              |
| Pull to refresh | Page level                 | If implementing, use `overscroll-behavior`    |

### 9.5 Focus States

All interactive elements must have:
```css
:focus-visible {
  outline: 2px solid var(--kn-red-500);
  outline-offset: 2px;
}
```

---

## 10. Animation & Motion Specifications

### 10.1 Framer Motion Presets

| Animation            | Initial           | Animate           | Transition                          |
|----------------------|--------------------|--------------------|-------------------------------------|
| Page load fade-in    | `opacity: 0, y: 20` | `opacity: 1, y: 0` | `duration: 0.5, ease: easeOut`     |
| Stagger children     | (per item)         | `opacity: 1, y: 0` | `delay: index * 0.1`               |
| Scale in             | `scale: 0.95`      | `scale: 1`         | `duration: 0.3, ease: easeOut`     |
| Card hover lift      | `y: 0`             | `y: -4`            | `duration: 0.2, ease: easeOut`     |

### 10.2 CSS Animations

| Animation          | Keyframes                                              | Duration | Usage                   |
|--------------------|--------------------------------------------------------|----------|-------------------------|
| `pulse-live`       | `opacity: 1 → 0.4 → 1`                               | 1.5s     | Live badge dot          |
| `fade-in`          | `opacity: 0 → 1`                                      | 0.3s     | Lazy-loaded images      |
| `slide-up`         | `transform: translateY(10px) → translateY(0)`         | 0.3s     | Section entrance        |
| `shimmer`          | `background-position: -200% 0 → 200% 0`              | 1.5s     | Skeleton loading state  |

### 10.3 Reduced Motion

All animations must respect `prefers-reduced-motion: reduce`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Icon System

### 11.1 Library: Lucide React

**Installed**: `lucide-react@1.47.0`

### 11.2 Icon Inventory by Section

| Section          | Icons Used                                                              | Size  |
|------------------|-------------------------------------------------------------------------|-------|
| Navigation       | `Menu`, `X`, `Search`, `MapPin`, `User`, `Bell`, `Calendar`           | 20-24px |
| Hero             | `Star`, `ArrowRight`, `Navigation`                                      | 16-20px |
| Categories       | `Music`, `UtensilsCrossed`, `Palette`, `Moon`, `Trophy`, `Landmark`, `Rocket`, `Film` | 24px |
| Event Cards      | `Calendar`, `Clock`, `MapPin`, `Bookmark`, `Heart`, `Ticket`          | 14-16px |
| Buttons          | `ArrowRight`, `ChevronRight`, `ExternalLink`                           | 16-18px |
| Plans            | `Zap` (lightning for same-day), `CalendarClock` (advance), `PartyPopper` (weekend) | 16px |
| Deals            | `Star` (rating), `Flame` (discount badge)                              | 12-14px |
| Heritage         | `MapPin`, `Route`, `Compass`                                            | 14px   |
| Sports           | `Tv` (screenings), `Timer`                                              | 16px   |
| Footer           | `Facebook`, `Twitter`, `Instagram`, `Youtube`, `Apple`, `Play`         | 18-20px |
| General          | `ChevronLeft`, `ChevronRight` (carousel), `Bookmark`, `Share2`        | 18-20px |

### 11.3 Icon Styling

```css
/* Default icon style */
.icon { color: var(--kn-text-secondary); }

/* Active/accent icon */
.icon--accent { color: var(--kn-red-500); }

/* Icon in button */
.btn-icon { width: 18px; height: 18px; }

/* Icon in badge/chip */
.chip-icon { width: 24px; height: 24px; }

/* Social icon */
.social-icon { width: 20px; height: 20px; color: var(--kn-text-secondary); }
.social-icon:hover { color: var(--kn-text-primary); }
```

---

## 12. Mobile-Specific Patterns

### 12.1 Touch Target Sizes

All interactive elements must meet **44×44px minimum** touch target:
- Buttons: min height 44px (use `h-11` = 44px)
- Icon buttons: 44×44px minimum padding area
- Links in lists: Full row tap area with padding

### 12.2 Bottom Navigation Bar

**Fixed bottom, visible on mobile only (<768px)**:
- Height: 64px + safe-area-inset-bottom
- Background: `--kn-bg-base` with `backdrop-blur-lg`
- Top border: 1px `--kn-border`
- 4-5 items: Home, Events, Create (+), Profile
- Center "Create" button: Elevated circle, `--kn-red-500`, 56px diameter, -20px offset upward
- Active state: `--kn-red-500` icon color + dot indicator below

### 12.3 Horizontal Card Carousels

- **Scroll snap**: `scroll-snap-type: x mandatory`
- **Card snap**: `scroll-snap-align: start`
- **Padding**: 16px left, last card has 16px right padding (use `pr-4` on container or extra padding on last child)
- **Hidden scrollbar**: `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`
- **Momentum scroll**: `-webkit-overflow-scrolling: touch`

### 12.4 Safe Area Insets

```css
.safe-area-top { padding-top: env(safe-area-inset-top); }
.safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
```

### 12.5 Viewport Meta

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

### 12.6 Prevent Layout Shift

- All images must have explicit `width` and `height` attributes
- Use `aspect-ratio` for image containers (16/10 for cards, 16/9 for hero)
- Skeleton loading states for all async content

---

## 13. Image Assets

### 13.1 Required Images

| Asset                    | Dimensions      | Format   | Notes                              |
|--------------------------|-----------------|----------|------------------------------------|
| Hero background          | 1200×600px      | WebP/JPG | Kolkata nightlife scene, dark mood |
| Event card images        | 520×320px       | WebP/JPG | Concert/event photos, vibrant     |
| Spotlight images         | 520×320px       | WebP/JPG | Themed per event type              |
| Dining venue images      | 400×260px       | WebP/JPG | Restaurant/hotel interiors         |
| Heritage tour images     | 520×320px       | WebP/JPG | Kolkata landmarks                  |
| Team flags (sports)      | 64×64px         | SVG/PNG  | Country/team flags                 |
| App store badges         | 120×40px        | SVG/PNG  | App Store + Google Play            |
| Social media icons       | 20×20px         | SVG      | Via Lucide icons or custom SVGs    |
| Logo                     | 32×32px         | SVG      | "KN" monogram                      |

### 13.2 Image Treatment

- **Cards**: `border-radius: var(--radius-lg)`, `object-fit: cover`
- **Dark overlay on hero**: `linear-gradient(to bottom, rgba(10,10,15,0.3), rgba(10,10,15,0.9))`
- **Card image overlay**: `linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8))` at bottom for text readability
- **Loading**: Use skeleton shimmer placeholder before image loads

---

## 14. shadcn Component Mapping

### 14.1 Components to Use Directly

| shadcn Component | Usage in Design                                |
|------------------|------------------------------------------------|
| `Button`         | CTAs (Book Ticket, Reserve, Explore, etc.)     |
| `Badge`          | Category labels, live indicator, section tags   |
| `Card`           | Base for all card variants                      |
| `ScrollArea`     | Horizontal scroll containers                    |
| `Avatar`         | User profile image in nav                       |
| `Separator`      | Section dividers                                |
| `NavigationMenu` | Desktop nav links (optional)                    |
| `DropdownMenu`   | Location picker, user menu                      |
| `Sheet`          | Mobile menu overlay                             |
| `Tooltip`        | Icon tooltips                                   |

### 14.2 Components to Build Custom

| Component              | Rationale                                        |
|------------------------|--------------------------------------------------|
| `HeroSection`          | Unique layout, custom gradient, CTA arrangement  |
| `CategoryChips`        | Horizontal scroll with icon+label pills          |
| `PlanCard`             | Left-bordered cards with colored accents         |
| `EventCard`            | Image card with overlays, badges, pricing        |
| `SpotlightCard`        | Variant of EventCard with category tags          |
| `DiningCard`           | Deals card with discount badges                  |
| `HeritageCard`         | Tour card with type pills                        |
| `FeatureCard`          | Large feature promo cards                        |
| `MatchCard`            | Sports matchup with team flags                   |
| `LiveBadge`            | Animated pulsing live indicator                  |
| `SectionHeader`        | Overline + title + action link pattern           |
| `HorizontalCarousel`   | Reusable scroll container wrapper                |
| `BottomNav`            | Mobile bottom navigation bar                     |

### 14.3 Extended Button Variants

```tsx
// Add to Button component
const variantClasses = {
  // ... existing variants
  'accent':     'bg-[#F43F5E] text-white hover:bg-[#E11D48] active:bg-[#BE123C] shadow-[0_4px_12px_rgba(244,63,94,0.3)]',
  'accent-outline': 'border border-[#F43F5E] text-[#F43F5E] hover:bg-[#F43F5E]/10 active:bg-[#F43F5E]/20',
  'ghost-dark': 'text-white/70 hover:bg-white/10 hover:text-white active:bg-white/15',
}
```

---

## 15. Implementation Checklist

### Phase 1: Design Token Setup
- [ ] Update `globals.css` with Kolkata Nights color palette
- [ ] Define all CSS custom properties for dark theme
- [ ] Update font imports (Plus Jakarta Sans)
- [ ] Configure Tailwind theme extensions

### Phase 2: Base Components
- [ ] Extend `Button` with accent variants
- [ ] Create `LiveBadge` component with pulse animation
- [ ] Create `SectionHeader` component (overline + title + link)
- [ ] Create `HorizontalCarousel` wrapper component
- [ ] Create `BottomNav` mobile navigation component

### Phase 3: Card Components
- [ ] Build `EventCard` with image overlays and badges
- [ ] Build `PlanCard` with colored left border variants
- [ ] Build `DiningCard` with discount badge overlays
- [ ] Build `HeritageCard` with type pill overlays
- [ ] Build `SpotlightCard` extending EventCard
- [ ] Build `FeatureCard` for promotional sections
- [ ] Build `MatchCard` for sports section

### Phase 4: Layout Sections
- [ ] Build `HeroSection` with gradient overlay
- [ ] Build `CategoryChips` horizontal scroll
- [ ] Build `TrendingToday` section with carousel
- [ ] Build `Spotlight` section with carousel
- [ ] Build `HotDeals` section with carousel
- [ ] Build `HeritageTour` section with carousel
- [ ] Build `AfterOfficeHours` feature section
- [ ] Build `SportsMania` feature section
- [ ] Build `Footer` with 4-column layout

### Phase 5: Navigation
- [ ] Update `Header` for dark theme with full nav
- [ ] Update `MobileNav` with elevated create button
- [ ] Implement mobile sheet menu

### Phase 6: Animation & Polish
- [ ] Add Framer Motion entrance animations
- [ ] Implement scroll-triggered section reveals
- [ ] Add hover micro-interactions on cards
- [ ] Implement skeleton loading states
- [ ] Test and refine all mobile touch interactions
- [ ] Verify WCAG AA contrast ratios

---

## 16. Accessibility Requirements

### 16.1 WCAG AA Compliance

| Criterion          | Requirement                                   | Status |
|--------------------|-----------------------------------------------|--------|
| Color Contrast     | 4.5:1 for text, 3:1 for large text/UI        | Must verify |
| Keyboard Navigation | All interactive elements reachable via Tab   | Required |
| Screen Reader      | Semantic HTML, ARIA labels on all controls    | Required |
| Focus Indicators   | Visible 2px outline on `:focus-visible`       | Required |
| Touch Targets      | Minimum 44×44px                               | Required |
| Motion             | `prefers-reduced-motion` support              | Required |
| Alt Text           | All images have descriptive `alt` attributes  | Required |
| Heading Hierarchy  | Logical h1→h2→h3 nesting                      | Required |

### 16.2 ARIA Patterns

```html
<!-- Carousel -->
<div role="region" aria-label="Trending events" aria-roledescription="carousel">
  <div role="group" aria-label="Event 1 of 3">...</div>
</div>

<!-- Live indicator -->
<span aria-live="polite">
  <span aria-hidden="true" class="pulse-dot"></span>
  Live now
</span>

<!-- Section navigation -->
<nav aria-label="Category filters">...</nav>
```

---

## 17. Performance Considerations

- **Lazy load** all below-fold images with `loading="lazy"`
- **Use `aspect-ratio`** CSS to prevent layout shift
- **Optimize images**: WebP format, responsive `srcset`
- **Skeleton states**: Show shimmer placeholders while content loads
- **Virtual scrolling**: Consider for long lists (if implementing event listings)
- **Font loading**: Use `font-display: swap` for web fonts

---

**Designer**: UI Designer (Agent)
**Design Version**: 1.0.0
**Last Updated**: 2026-09-23
**Status**: Ready for Developer Implementation
