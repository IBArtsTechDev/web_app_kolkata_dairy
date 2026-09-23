/* ============================================
   Hero Section Types
   ============================================ */

export interface HeroEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  location: string
  price: number
  originalPrice?: number
  image: string
  badge?: string
  badgeColor?: 'red' | 'amber' | 'emerald' | 'cyan' | 'blue'
  category: string
  isLive?: boolean
}

export interface CategoryItem {
  id: string
  label: string
  icon: string
  color: string
  href: string
}

export interface PlanCard {
  id: string
  label: string
  title: string
  description: string
  icon: string
  accentColor: string
  href: string
}

export interface DealItem {
  id: string
  title: string
  subtitle: string
  image: string
  discount?: string
  price: string
  originalPrice?: string
  rating?: number
  category: string
  href: string
}

export interface HeritageTour {
  id: string
  title: string
  description: string
  image: string
  duration: string
  price: string
  location: string
  href: string
}

export interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

export interface QuickActionItem {
  id: string
  label: string
  icon: string
  color: string
  href: string
}
