# Kolkata Dairy — Event Management System (Mobile-First React Frontend)

> Production Architecture Plan — v1.0

---

## 1. Complete Folder Structure

```
src/
├── main.tsx                          # App entry — providers wired here
├── index.css                         # Global styles + Tailwind layers
├── vite-env.d.ts                     # Vite client types
│
├── assets/                           # Static assets (images, icons, fonts)
│   ├── images/
│   │   ├── logo.svg
│   │   ├── empty-events.svg
│   │   ├── 404.svg
│   │   └── onboarding/
│   │       ├── step-1.svg
│   │       ├── step-2.svg
│   │       └── step-3.svg
│   ├── fonts/
│   │   ├── Inter-Variable.woff2
│   │   └── Inter-Variable.woff
│   └── icons/
│       └── app-icon.svg
│
├── public/                           # Public static files
│   ├── favicon.svg
│   ├── manifest.json                 # PWA manifest
│   ├── sw.js                         # Service worker (offline caching)
│   └── robots.txt
│
├── index.html                        # Entry HTML (mobile viewport meta, theme-color)
│
│── ─── DOMAIN ──────────────────────────────────────────────
├── types/                            # Global TypeScript types & interfaces
│   ├── index.ts                      # Re-exports everything
│   ├── event.ts                      # Event, EventStatus, EventCategory, Venue, etc.
│   ├── user.ts                       # User, UserRole, AuthState
│   ├── api.ts                        # ApiResponse<T>, PaginatedResponse<T>, ApiError
│   ├── common.ts                     # ID, Timestamp, SortOrder, FilterParams
│   └── navigation.ts                 # RouteParam types, NavItem
│
├── constants/                        # App-wide constants
│   ├── index.ts
│   ├── routes.ts                     # All route path constants
│   ├── api.ts                        # API base URLs, endpoints
│   ├── events.ts                     # Event categories, status labels, date formats
│   ├── storage.ts                    # localStorage keys
│   └── validation.ts                 # Zod schema error messages
│
├── config/                           # App configuration
│   ├── index.ts
│   └── axios.ts                      # Axios instance with interceptors
│
│── ─── SERVICES (API Layer) ────────────────────────────────
├── services/                         # Pure API functions — no hooks, no React
│   ├── index.ts
│   ├── event.service.ts              # CRUD: getEvents, getEvent, createEvent, updateEvent, deleteEvent
│   ├── auth.service.ts               # login, logout, refreshToken, getProfile
│   ├── upload.service.ts             # Image/file upload helpers
│   └── storage.service.ts            # localStorage wrapper with type safety
│
│── ─── HOOKS ───────────────────────────────────────────────
├── hooks/                            # Custom React hooks
│   ├── index.ts
│   ├── useEvents.ts                  # TanStack Query hooks for event CRUD
│   ├── useEventFilters.ts            # Filter/search/sort state + debounced query
│   ├── useAuth.ts                    # Auth state + login/logout mutations
│   ├── useDebounce.ts                # Generic debounce hook
│   ├── useMediaQuery.ts              # Responsive breakpoint detection
│   ├── usePagination.ts              # Infinite scroll / page state
│   ├── useGeolocation.ts             # Device location (for venue proximity)
│   └── usePullToRefresh.ts           # Mobile pull-to-refresh gesture
│
│── ─── STATE (Zustand Stores) ──────────────────────────────
├── stores/                           # Zustand global state stores
│   ├── index.ts
│   ├── auth.store.ts                 # Auth token, user, login/logout actions
│   ├── ui.store.ts                   # Theme (light/dark/system), sidebar, modals
│   ├── events.store.ts               # Client-side event UI state (selected filters, view mode)
│   └── offline.store.ts              # Online/offline status, pending sync queue
│
│── ─── LIB (Utilities) ─────────────────────────────────────
├── lib/                              # Framework-agnostic utility functions
│   ├── index.ts
│   ├── cn.ts                         # clsx + tailwind-merge helper
│   ├── formatters.ts                 # Date, currency, relative time formatters
│   ├── validators.ts                 # Zod schemas (event, auth, common)
│   ├── errors.ts                     # Error classification & user-friendly messages
│   └── permissions.ts                # Role-based access helpers
│
│── ─── LAYOUT ──────────────────────────────────────────────
├── layouts/                          # Layout wrappers
│   ├── index.ts
│   ├── RootLayout.tsx                # App shell — <Outlet /> + providers
│   ├── AuthLayout.tsx                # Login/register wrapper (no nav)
│   ├── MobileShell.tsx               # Bottom nav bar + safe area insets
│   └── DesktopShell.tsx              # Sidebar + top bar (tablet/desktop)
│
│── ─── COMPONENTS (Shared / UI) ────────────────────────────
├── components/                       # Reusable, domain-agnostic UI components
│   ├── index.ts                      # Barrel exports
│   │
│   ├── ui/                           # Primitive UI building blocks
│   │   ├── Button.tsx                # Variants: primary, secondary, ghost, danger + sizes
│   │   ├── Input.tsx                 # Text input with label, error, icon slots
│   │   ├── Select.tsx               # Custom select (native on mobile for a11y)
│   │   ├── Textarea.tsx             # Auto-growing textarea
│   │   ├── Checkbox.tsx             # Accessible checkbox with label
│   │   ├── Switch.tsx               # Toggle switch
│   │   ├── Modal.tsx                 # Bottom sheet on mobile, centered on desktop
│   │   ├── Drawer.tsx                # Slide-in drawer (mobile menu)
│   │   ├── Toast.tsx                 # Notification toast (auto-dismiss)
│   │   ├── Spinner.tsx               # Loading spinner with size variants
│   │   ├── Skeleton.tsx              # Content placeholder skeleton
│   │   ├── Badge.tsx                 # Status/category badges
│   │   ├── Avatar.tsx                # User avatar with fallback initials
│   │   ├── Card.tsx                  # Elevated card container
│   │   ├── EmptyState.tsx            # Illustrated empty state
│   │   ├── ErrorBoundary.tsx         # React error boundary
│   │   ├── ConfirmDialog.tsx         # Destructive action confirmation
│   │   ├── SearchInput.tsx           # Search with debounce + clear button
│   │   ├── DatePicker.tsx            # Date picker (native input on mobile)
│   │   ├── TimePicker.tsx            # Time picker
│   │   └── FileUpload.tsx            # Drag-drop + tap-to-upload image picker
│   │
│   ├── layout/                       # Layout-specific components
│   │   ├── BottomNavBar.tsx          # Mobile bottom navigation (5 items max)
│   │   ├── TopBar.tsx                # App bar with back button, title, actions
│   │   ├── SideNav.tsx               # Desktop/tablet sidebar navigation
│   │   ├── PageHeader.tsx            # Page title + action buttons
│   │   └── TabBar.tsx                # Horizontal scrollable tabs
│   │
│   └── shared/                       # Domain-specific shared components
│       ├── EventCard.tsx             # Event list card (image, title, date, status badge)
│       ├── EventStatusBadge.tsx      # Color-coded status indicator
│       ├── EventDateBadge.tsx        # Day/month visual badge
│       ├── EventFilters.tsx          # Filter sheet (category, date range, status)
│       ├── VenueMap.tsx              # Embedded map for venue
│       ├── OrganizerInfo.tsx         # Organizer avatar + name + contact
│       ├── ShareButton.tsx           # Native share API / fallback copy link
│       └── CountdownTimer.tsx        # Live countdown to event start
│
│── ─── PAGES (Route-level) ─────────────────────────────────
├── pages/                            # Route components — one per route
│   ├── index.ts                      # Lazy-loaded route definitions
│   │
│   ├── home/
│   │   ├── HomePage.tsx              # Dashboard: upcoming events, quick actions
│   │   └── components/
│   │       ├── HeroSection.tsx       # Quick create CTA + search
│   │       ├── UpcomingEvents.tsx    # Horizontal scroll carousel
│   │       └── RecentActivity.tsx    # Recent event activity feed
│   │
│   ├── events/
│   │   ├── EventListPage.tsx         # All events — list/grid toggle, infinite scroll
│   │   ├── EventDetailPage.tsx       # Single event view with all details
│   │   ├── EventCreatePage.tsx       # Multi-step create event form
│   │   ├── EventEditPage.tsx         # Edit existing event (reuses create form)
│   │   └── components/
│   │       ├── EventListToolbar.tsx   # Sort, view mode, filter trigger
│   │       ├── EventGridItem.tsx     # Grid view card
│   │       ├── EventListItem.tsx     # List view row
│   │       ├── EventForm.tsx         # Shared form (create + edit)
│   │       ├── EventFormStep1.tsx    # Step 1: Basic info (title, description, category)
│   │       ├── EventFormStep2.tsx    # Step 2: Date, time, recurrence
│   │       ├── EventFormStep3.tsx    # Step 3: Venue / location
│   │       ├── EventFormStep4.tsx    # Step 4: Media (cover image, gallery)
│   │       ├── EventFormStep5.tsx    # Step 5: Settings (visibility, tickets, max attendees)
│   │       ├── EventActions.tsx      # Edit/Delete/Share action sheet
│   │       └── DeleteEventConfirm.tsx # Delete confirmation modal
│   │
│   ├── calendar/
│   │   ├── CalendarPage.tsx          # Month/week/day calendar view
│   │   └── components/
│   │       ├── MonthView.tsx         # Monthly calendar grid
│   │       ├── DayView.tsx           # Day timeline
│   │       ├── CalendarEventDot.tsx  # Event indicator on calendar dates
│   │       └── CalendarHeader.tsx    # Month navigation + view switcher
│   │
│   ├── search/
│   │   ├── SearchPage.tsx            # Full-text search with filters
│   │   └── components/
│   │       ├── SearchBar.tsx          # Prominent search input
│   │       ├── SearchResults.tsx      # Results list
│   │       └── RecentSearches.tsx     # Search history
│   │
│   ├── profile/
│   │   ├── ProfilePage.tsx           # User profile + settings
│   │   ├── EditProfilePage.tsx       # Edit profile form
│   │   └── components/
│   │       ├── ProfileHeader.tsx      # Avatar, name, stats
│   │       ├── MyEventsTab.tsx       # Events created by user
│   │       ├── AttendingTab.tsx      # Events user is attending
│   │       └── SettingsSection.tsx   # Preferences, notifications, theme
│   │
│   ├── auth/
│   │   ├── LoginPage.tsx             # Email/password login
│   │   ├── RegisterPage.tsx          # New account registration
│   │   ├── ForgotPasswordPage.tsx    # Password reset request
│   │   └── components/
│   │       ├── AuthForm.tsx          # Shared auth form wrapper
│   │       └── SocialLoginButtons.tsx # Google, Apple sign-in
│   │
│   ├── not-found/
│   │   └── NotFoundPage.tsx          # 404 page
│   │
│   └── settings/
│       ├── SettingsPage.tsx          # App settings
│       └── components/
│           ├── ThemeToggle.tsx       # Light/Dark/System switch
│           ├── NotificationPrefs.tsx # Push notification settings
│           ├── LanguageSelect.tsx    # i18n language picker
│           └── DangerZone.tsx        # Account deletion
│
│── ─── PROVIDERS ───────────────────────────────────────────
├── providers/                        # React context providers
│   ├── index.ts
│   ├── QueryProvider.tsx             # TanStack Query client provider
│   ├── ThemeProvider.tsx             # Light/dark/system theme + <html> class sync
│   ├── AuthProvider.tsx              # Auth context + token persistence
│   ├── OfflineProvider.tsx           # Network status listener + sync trigger
│   └── ToastProvider.tsx             # Toast notification manager
│
│── ─── ROUTER ──────────────────────────────────────────────
├── router/                           # Routing configuration
│   ├── index.tsx                     # createBrowserRouter with all routes
│   ├── guards.tsx                    # Auth guard, role guard wrappers
│   └── loaders.tsx                   # Route loaders (data prefetching)
│
│── ─── TESTS ───────────────────────────────────────────────
├── __tests__/                        # Test files mirroring src/ structure
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.test.tsx
│   │   │   ├── Input.test.tsx
│   │   │   ├── Modal.test.tsx
│   │   │   └── Toast.test.tsx
│   │   └── shared/
│   │       ├── EventCard.test.tsx
│   │       └── EventStatusBadge.test.tsx
│   ├── hooks/
│   │   ├── useEvents.test.ts
│   │   ├── useDebounce.test.ts
│   │   └── usePagination.test.ts
│   ├── services/
│   │   ├── event.service.test.ts
│   │   └── auth.service.test.ts
│   ├── lib/
│   │   ├── formatters.test.ts
│   │   └── validators.test.ts
│   ├── pages/
│   │   ├── EventListPage.test.tsx
│   │   ├── EventDetailPage.test.tsx
│   │   └── EventCreatePage.test.tsx
│   └── setup.ts                      # Test setup (msw handlers, jest-dom)
│
│── ─── MOCKS ───────────────────────────────────────────────
├── mocks/                            # API mocks for development & testing
│   ├── handlers/
│   │   ├── events.handler.ts
│   │   ├── auth.handler.ts
│   │   └── upload.handler.ts
│   ├── browsers.ts                   # MSW browser setup
│   └── server.ts                     # MSW server setup
│
└── ─── GENERATED ───────────────────────────────────────────
    └── api/                          # Auto-generated API types (optional: openapi-typescript)
        └── types.ts                  # Generated from OpenAPI spec
```

---

## 2. Tech Stack — Choices & Justifications

### Core Framework
| Dependency | Version | Why |
|---|---|---|
| **React** | 19.x | Concurrent features, Actions, use() hook, server component prep |
| **TypeScript** | 6.x | Full type safety across the entire codebase |
| **Vite** | 8.x | Fastest HMR, native ESM, minimal config |

### Build & Tooling
| Dependency | Version | Why |
|---|---|---|
| **@vitejs/plugin-react** | 6.x | Official React plugin with automatic JSX transform |
| **tailwindcss** | 4.x | **MISSING — MUST ADD** — Utility-first CSS, mobile-first by default |
| **@tailwindcss/vite** | 4.x | Vite-native Tailwind integration (replaces PostCSS) |
| **oxlint** | 1.x | Ultra-fast Rust-based linter (already installed) |
| **prettier** | 3.x | **MISSING — MUST ADD** — Code formatting consistency |
| **prettier-plugin-tailwindcss** | 0.7.x | Auto-sort Tailwind classes |

### Routing & Navigation
| Dependency | Version | Why |
|---|---|---|
| **react-router-dom** | 7.x | **Already installed** — Nested routes, loaders, actions, data API |

### State Management
| Dependency | Version | Why |
|---|---|---|
| **zustand** | 5.x | **Already installed** — Minimal boilerplate, no providers, TS-first |
| **@tanstack/react-query** | 5.x | **Already installed** — Server state, caching, optimistic updates, background refetch |

> **Why Zustand over Redux Toolkit?** Zustand is 1.1KB gzipped vs 11KB+ for RTK. For mobile, bundle size matters. Zustand requires no provider wrapping, has simpler mental model, and pairs perfectly with TanStack Query (Zustand = client state, TanStack = server state).

### Forms & Validation
| Dependency | Version | Why |
|---|---|---|
| **react-hook-form** | 7.x | **Already installed** — Performance-first (no re-renders), native mobile support |
| **zod** | 4.x | **Already installed** — First-class RHF integration, type inference |

### HTTP & Data
| Dependency | Version | Why |
|---|---|---|
| **axios** | 1.x | **Already installed** — Interceptors for auth tokens, error transformation |
| **date-fns** | 4.x | **Already installed** — Tree-shakeable, 20x smaller than moment.js |

### Animation & UI
| Dependency | Version | Why |
|---|---|---|
| **framer-motion** | 13.x | **Already installed** — Layout animations, gesture support, page transitions |
| **lucide-react** | 1.x | **Already installed** — Consistent icon set, tree-shakeable |
| **clsx** | 2.x | **Already installed** — Conditional class names |
| **tailwind-merge** | 3.x | **Already installed** — Merge Tailwind classes without conflicts |

### Testing (MISSING — MUST ADD)
| Dependency | Version | Why |
|---|---|---|
| **vitest** | 3.x | Native Vite integration, Jest-compatible API, ESM-first |
| **@testing-library/react** | 16.x | Accessibility-focused testing, user-centric queries |
| **@testing-library/jest-dom** | 6.x | DOM assertion matchers |
| **@testing-library/user-event** | 14.x | Realistic user interaction simulation |
| **msw** | 2.x | API mocking without touching source code |
| **happy-dom** | 15.x | Fast DOM implementation for tests |

### Mobile-Specific
| Dependency | Version | Why |
|---|---|---|
| **@tanstack/react-virtual** | 3.x | **MUST ADD** — Virtualized lists for large event lists |
| **react-intersection-observer** | 9.x | **MUST ADD** — Infinite scroll + lazy loading |
| **vite-plugin-pwa** | 0.21.x | **MUST ADD** — PWA manifest, service worker, offline support |

---

## 3. Component Hierarchy

```
<App>
├── <QueryProvider>                         # TanStack Query context
│   ├── <ThemeProvider>                     # Theme class on <html>
│   │   ├── <AuthProvider>                  # Auth token + user state
│   │   │   ├── <OfflineProvider>           # Network status
│   │   │   │   ├── <ToastProvider>         # Global toast notifications
│   │   │   │   │   └── <RouterProvider>    # React Router
│   │   │   │   │       ├── <RootLayout>    # App shell
│   │   │   │   │       │   ├── <MobileShell> (≤768px)
│   │   │   │   │       │   │   ├── <TopBar>
│   │   │   │   │       │   │   ├── <Outlet /> ← Page content
│   │   │   │   │       │   │   └── <BottomNavBar>
│   │   │   │   │       │   │
│   │   │   │   │       │   └── <DesktopShell> (>768px)
│   │   │   │   │       │       ├── <SideNav>
│   │   │   │   │       │       ├── <TopBar>
│   │   │   │   │       │       └── <Outlet />
│   │   │   │   │       │
│   │   │   │   │       ├── <AuthLayout>    # Login/Register
│   │   │   │   │       └── ...
```

### Component Composition Pattern (Mobile-First)

```
EventCard (shared)
├── <div> wrapper with touch-friendly tap target (min 44px)
│   ├── <img> cover (lazy loaded, aspect-ratio: 16/9)
│   ├── <EventDateBadge> (positioned absolute over image)
│   ├── <div> content
│   │   ├── <EventStatusBadge>
│   │   ├── <h3> title (line-clamp-2)
│   │   ├── <p> description (line-clamp-2)
│   │   └── <div> meta row
│   │       ├── <CalendarIcon> + formatted date
│   │       ├── <MapPinIcon> + venue name
│   │       └── <UsersIcon> + attendee count
│   └── <ShareButton> (overflow menu on mobile)
```

---

## 4. Routing Strategy

### Route Definitions

```typescript
// src/constants/routes.ts

export const ROUTES = {
  // Public
  HOME:            '/',
  LOGIN:           '/login',
  REGISTER:        '/register',
  FORGOT_PASSWORD: '/forgot-password',
  NOT_FOUND:       '/404',

  // Events
  EVENTS:          '/events',
  EVENT_CREATE:    '/events/create',
  EVENT_DETAIL:    '/events/:eventId',
  EVENT_EDIT:      '/events/:eventId/edit',

  // Calendar
  CALENDAR:        '/calendar',

  // Search
  SEARCH:          '/search',

  // Profile
  PROFILE:         '/profile',
  PROFILE_EDIT:    '/profile/edit',

  // Settings
  SETTINGS:        '/settings',
} as const;
```

### Route Table (src/router/index.tsx)

```
/                       → HomePage        (auth required)
/login                  → LoginPage        (guest only)
/register               → RegisterPage     (guest only)
/forgot-password        → ForgotPasswordPage (guest only)
/events                 → EventListPage    (auth required)
/events/create          → EventCreatePage  (auth required)
/events/:eventId        → EventDetailPage  (auth required)
/events/:eventId/edit   → EventEditPage    (auth required, owner only)
/calendar               → CalendarPage     (auth required)
/search                 → SearchPage       (auth required)
/profile                → ProfilePage      (auth required)
/profile/edit           → EditProfilePage  (auth required)
/settings               → SettingsPage     (auth required)
/404                    → NotFoundPage     (always accessible)
```

### Route Guards

```typescript
// src/router/guards.tsx

// <AuthGuard> — Redirects to /login if no token
// <GuestGuard> — Redirects to / if already authenticated
// <OwnerGuard> — Checks if current user owns the resource
// <RoleGuard> — Checks user role (admin, organizer, attendee)
```

### Code Splitting Strategy

Every page component is lazy-loaded:

```typescript
const HomePage = lazy(() => import('@/pages/home/HomePage'));
const EventListPage = lazy(() => import('@/pages/events/EventListPage'));
const EventDetailPage = lazy(() => import('@/pages/events/EventDetailPage'));
const EventCreatePage = lazy(() => import('@/pages/events/EventCreatePage'));
const CalendarPage = lazy(() => import('@/pages/calendar/CalendarPage'));
const SearchPage = lazy(() => import('@/pages/search/SearchPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
```

### Navigation Flow

```
                    ┌─────────────┐
                    │   Splash    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
               ┌────│   Auth?     │────┐
               │ NO │             │ YES│
               │    └─────────────┘    │
          ┌────▼────┐           ┌──────▼──────┐
          │  Login  │           │   Home Tab   │
          └────┬────┘           └──────┬──────┘
               │                       │
          ┌────▼────┐     ┌────────────┼────────────┐
          │Register │     │            │            │
          └─────────┘  ┌──▼──┐    ┌───▼───┐   ┌───▼───┐
                       │Event│    │Calendar│   │Profile│
                       │ List│    └───┬───┘   └───┬───┘
                       └──┬──┘        │           │
                     ┌────┼────┐      │           │
                     │    │    │      │           │
                  ┌──▼┐ ┌─▼─┐┌▼──┐   │        ┌──▼──┐
                  │Det│ │Crt││Edt│   │        │ Edit│
                  └───┘ └───┘└───┘   │        └─────┘
```

---

## 5. State Management Approach

### Two-Layer Architecture

```
┌─────────────────────────────────────────────┐
│           SERVER STATE (TanStack Query)      │
│  ─────────────────────────────────────────  │
│  • Event CRUD data                          │
│  • User profile data                        │
│  • Search results                           │
│  • Paginated lists                          │
│  • Background refetching                    │
│  • Optimistic updates                       │
│  • Cache invalidation                       │
│  • Stale-while-revalidate                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│           CLIENT STATE (Zustand)             │
│  ─────────────────────────────────────────  │
│  • Auth tokens + user (persisted)           │
│  • Theme preference (persisted)             │
│  • Offline sync queue (persisted)           │
│  • UI state: modals, drawers, active tab    │
│  • Event filters/sort (session)             │
│  • Recent searches (persisted)              │
└─────────────────────────────────────────────┘
```

### Zustand Store Pattern

```typescript
// src/stores/auth.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) =>
        set({ token, user, isAuthenticated: true }),

      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: 'auth-storage',        // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
```

### TanStack Query Pattern

```typescript
// src/hooks/useEvents.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services/event.service';

export function useEvents(filters: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventService.getEvents(filters),
    staleTime: 5 * 60 * 1000,     // 5 minutes
    placeholderData: (prev) => prev, // Keep previous data while loading
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    // Optimistic update
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: ['events'] });
      const previous = queryClient.getQueryData(['events']);
      queryClient.setQueryData(['events'], (old) => [newEvent, ...(old ?? [])]);
      return { previous };
    },
    onError: (_err, _newEvent, context) => {
      queryClient.setQueryData(['events'], context?.previous);
    },
  });
}
```

---

## 6. API Layer Architecture

### Axios Configuration

```typescript
// src/config/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle errors globally
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? 'Unknown error';

    if (status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    return Promise.reject({ status, message, original: error });
  }
);
```

### Service Layer

```typescript
// src/services/event.service.ts
import { apiClient } from '@/config/axios';
import type {
  Event,
  EventCreatePayload,
  EventUpdatePayload,
  EventFilters,
  PaginatedResponse,
} from '@/types';

export const eventService = {
  getEvents: async (filters: EventFilters): Promise<PaginatedResponse<Event>> => {
    return apiClient.get('/events', { params: filters });
  },

  getEvent: async (id: string): Promise<Event> => {
    return apiClient.get(`/events/${id}`);
  },

  createEvent: async (payload: EventCreatePayload): Promise<Event> => {
    return apiClient.post('/events', payload);
  },

  updateEvent: async (id: string, payload: EventUpdatePayload): Promise<Event> => {
    return apiClient.put(`/events/${id}`, payload);
  },

  deleteEvent: async (id: string): Promise<void> => {
    return apiClient.delete(`/events/${id}`);
  },

  getEventAttendees: async (id: string): Promise<User[]> => {
    return apiClient.get(`/events/${id}/attendees`);
  },

  RSVP: async (id: string): Promise<void> => {
    return apiClient.post(`/events/${id}/rsvp`);
  },

  cancelRSVP: async (id: string): Promise<void> => {
    return apiClient.delete(`/events/${id}/rsvp`);
  },
};
```

### Type Definitions

```typescript
// src/types/event.ts
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type EventCategory =
  | 'conference'
  | 'workshop'
  | 'meetup'
  | 'social'
  | 'sports'
  | 'arts'
  | 'charity'
  | 'other';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  startDate: string;          // ISO 8601
  endDate: string;
  venue: Venue;
  organizer: User;
  coverImage: string | null;
  galleryImages: string[];
  maxAttendees: number | null;
  currentAttendees: number;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface EventCreatePayload {
  title: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  venueId?: string;
  venue?: Omit<Venue, 'id'>;
  coverImage?: File;
  maxAttendees?: number;
  isPublic: boolean;
  tags: string[];
}

export interface EventUpdatePayload extends Partial<EventCreatePayload> {}

export interface EventFilters {
  search?: string;
  category?: EventCategory;
  status?: EventStatus;
  startDateFrom?: string;
  startDateTo?: string;
  sortBy?: 'date' | 'created' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// src/types/api.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
```

---

## 7. Testing Strategy

### Testing Pyramid

```
          ┌───────────┐
          │  E2E (5%) │     Playwright / Cypress (future)
          │           │     Critical user flows only
         ┌┴───────────┴┐
         │Integration   │    20%
         │ (20%)        │   Full component trees + MSW
         │              │   Page render, form submit, navigation
        ┌┴──────────────┴┐
        │  Unit Tests     │   75%
        │  (75%)          │  Services, hooks, utilities, validators
        │                 │  Pure functions, isolated logic
        └─────────────────┘
```

### Test Categories

| Category | Tools | What to Test | Priority |
|---|---|---|---|
| **Unit — Utilities** | Vitest | formatters, validators, cn(), permissions | P0 |
| **Unit — Services** | Vitest + MSW | API service functions, error handling | P0 |
| **Unit — Hooks** | Vitest + RHTL | Custom hooks (useDebounce, usePagination) | P1 |
| **Unit — Stores** | Vitest | Zustand store actions + state transitions | P1 |
| **Integration — Components** | Vitest + RHTL | Component render + user interaction | P1 |
| **Integration — Pages** | Vitest + RHTL + MSW | Full page flows (create event, RSVP) | P1 |
| **E2E — Critical Flows** | Playwright | Login → Create Event → View → RSVP | P2 |

### Test Setup

```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/__tests__/'],
    },
  },
});
```

### MSW Mock Service Worker

```typescript
// src/mocks/handlers/events.handler.ts
import { http, HttpResponse } from 'msw';
import { mockEvents } from '../fixtures/events';

export const eventHandlers = [
  http.get('/api/events', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    return HttpResponse.json({
      data: mockEvents.slice((page - 1) * 10, page * 10),
      meta: { currentPage: page, totalPages: 3, totalItems: 25 },
    });
  }),

  http.get('/api/events/:id', ({ params }) => {
    const event = mockEvents.find((e) => e.id === params.id);
    if (!event) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ data: event });
  }),
];
```

---

## 8. Required Dependencies — Complete List

### Already Installed (keep as-is)
```json
{
  "@tanstack/react-query": "^5.103.2",
  "axios": "^1.20.0",
  "clsx": "^2.1.1",
  "date-fns": "^4.4.0",
  "framer-motion": "^13.4.1",
  "lucide-react": "^1.47.0",
  "react": "^19.2.8",
  "react-dom": "^19.2.8",
  "react-hook-form": "^7.88.0",
  "react-router-dom": "^7.18.4",
  "tailwind-merge": "^3.7.0",
  "zod": "^4.6.5",
  "zustand": "^5.0.15"
}
```

### New Dependencies — Must Install

#### Production Dependencies
```bash
npm install @tanstack/react-virtual react-intersection-observer vite-plugin-pwa
```

#### Dev Dependencies
```bash
npm install -D tailwindcss @tailwindcss/vite prettier prettier-plugin-tailwindcss vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw happy-dom vite-tsconfig-paths
```

#### Complete New Dependencies Table

| Package | Type | Purpose |
|---|---|---|
| `tailwindcss` | dep | Utility-first CSS framework |
| `@tailwindcss/vite` | dep | Vite-native Tailwind plugin |
| `@tanstack/react-virtual` | dep | Virtualized lists for performance |
| `react-intersection-observer` | dep | Infinite scroll + lazy loading |
| `vite-plugin-pwa` | dev | PWA support (manifest, service worker) |
| `prettier` | dev | Code formatting |
| `prettier-plugin-tailwindcss` | dev | Tailwind class sorting |
| `vitest` | dev | Test runner (Vite-native) |
| `@testing-library/react` | dev | Component testing |
| `@testing-library/jest-dom` | dev | DOM matchers |
| `@testing-library/user-event` | dev | User interaction simulation |
| `msw` | dev | API mocking |
| `happy-dom` | dev | Lightweight DOM for tests |
| `vite-tsconfig-paths` | dev | Path alias resolution in tests |

---

## 9. Mobile-First Design Patterns

### Viewport & Touch

```html
<!-- index.html — enhanced -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="theme-color" content="#4f46e5" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#1e1b4b" media="(prefers-color-scheme: dark)" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### Touch Targets (minimum 44x44px)

```css
/* Mobile-optimized hit areas */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Safe Area Insets (Notch Devices)

```css
.safe-area-top { padding-top: env(safe-area-inset-top); }
.safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
```

### Bottom Sheet (Mobile Modal Pattern)

```tsx
// Modals render as bottom sheets on mobile, centered dialogs on desktop
<Modal>
  {/* Uses framer-motion for slide-up + drag-to-dismiss on mobile */}
</Modal>
```

### Pull-to-Refresh

```tsx
// Custom hook for native-feel pull-to-refresh
const { isRefreshing, pullDownProps } = usePullToRefresh({
  onRefresh: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
});
```

### Infinite Scroll

```tsx
// Events list with infinite scroll
<div ref={observerRef}>
  {events.map((event) => <EventCard key={event.id} event={event} />)}
  {hasNextPage && <Spinner />}
</div>
```

---

## 10. Configuration Files to Create/Modify

| File | Action | Purpose |
|---|---|---|
| `src/index.css` | **Rewrite** | Tailwind directives + global styles |
| `index.html` | **Update** | Mobile meta tags, PWA tags |
| `vite.config.ts` | **Update** | Add Tailwind, path aliases, PWA plugin |
| `tsconfig.app.json` | **Update** | Add path aliases (`@/*`) |
| `package.json` | **Update** | Add missing dependencies |
| `.prettierrc` | **Create** | Prettier configuration |
| `.prettierignore` | **Create** | Ignore build artifacts |
| `vitest.config.ts` | **Create** | Vitest configuration |
| `src/lib/cn.ts` | **Create** | clsx + tailwind-merge utility |
| `src/types/index.ts` | **Create** | All TypeScript interfaces |
| `src/constants/routes.ts` | **Create** | Route path constants |
| `src/config/axios.ts` | **Create** | Axios instance configuration |
| `src/router/index.tsx` | **Create** | Route definitions |
| `src/main.tsx` | **Rewire** | Wrap with providers |
| `src/App.tsx` | **Rewrite** | Router outlet |

---

## 11. Vite Configuration (Target State)

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Kolkata Dairy Events',
        short_name: 'KDEvents',
        theme_color: '#4f46e5',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## 12. Execution Order

### Phase 1 — Foundation (Days 1-2)
1. Install all missing dependencies
2. Configure Tailwind CSS 4
3. Set up path aliases (`@/*`)
4. Create `src/lib/cn.ts` utility
5. Create all type definitions in `src/types/`
6. Create route constants in `src/constants/`
7. Configure Prettier + Prettier plugin
8. Set up Axios instance in `src/config/`

### Phase 2 — Infrastructure (Days 2-3)
9. Create Zustand stores (auth, ui, offline)
10. Set up TanStack Query + providers
11. Create auth service + hooks
12. Build router configuration with guards
13. Create RootLayout + MobileShell + DesktopShell
14. Build BottomNavBar + TopBar components

### Phase 3 — UI Component Library (Days 3-5)
15. Build all `ui/` components (Button, Input, Modal, etc.)
16. Build `layout/` components
17. Build `shared/` components (EventCard, StatusBadge, etc.)

### Phase 4 — Pages (Days 5-8)
18. HomePage with dashboard
19. EventListPage with infinite scroll
20. EventDetailPage
21. EventCreatePage (multi-step form)
22. EventEditPage
23. CalendarPage
24. SearchPage
25. ProfilePage
26. SettingsPage
27. Auth pages (Login, Register, ForgotPassword)
28. NotFoundPage

### Phase 5 — Testing & Polish (Days 8-10)
29. Set up Vitest + MSW
30. Write unit tests for services + hooks + utilities
31. Write integration tests for critical pages
32. Performance audit (Lighthouse mobile score > 90)
33. Accessibility audit (WCAG 2.1 AA)
34. Final responsive testing on real devices
