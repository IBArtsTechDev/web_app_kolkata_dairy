import type {
  CategoryItem,
  PlanCard,
  DealItem,
  HeritageTour,
  NavigationItem,
} from './types'
import heroConcertStage from '@/assets/images/hero-concert-stage.jpg'

export const banners = [
  '/banner.png',
  heroConcertStage,
  '/banner2.png',
  'https://images.unsplash.com/photo-1540039155732-6761b54cb432?q=80&w=2000&auto=format&fit=crop',
]

export const navigationItems: NavigationItem[] = [
  { label: 'Explore Events', href: '/events', isActive: true },
  { label: 'Categories', href: '/categories' },
  { label: 'Dining & Deals', href: '/deals' },
  { label: 'Heritage', href: '/heritage' },
  { label: 'Sports Mania', href: '/sports' },
  { label: 'My Bookings', href: '/bookings' },
]

export const categories: CategoryItem[] = [
  { id: '1', label: 'Music', icon: '🎵', color: '#dc2626', href: '/category/music' },
  { id: '2', label: 'Dining', icon: '🍽️', color: '#f59e0b', href: '/category/dining' },
  { id: '3', label: 'Art & Visuals', icon: '🎨', color: '#8b5cf6', href: '/category/art' },
  { id: '4', label: 'Nightlife', icon: '🌙', color: '#ec4899', href: '/category/nightlife' },
  { id: '5', label: 'Heritage', icon: '🏛️', color: '#10b981', href: '/category/heritage' },
  { id: '6', label: 'Sports', icon: '⚽', color: '#3b82f6', href: '/category/sports' },
  { id: '7', label: 'Startup', icon: '🚀', color: '#06b6d4', href: '/category/startup' },
  { id: '8', label: 'Screenings', icon: '🎬', color: '#f97316', href: '/category/screenings' },
]

export const planCards: PlanCard[] = [
  {
    id: 'today',
    label: 'SAME DAY PASSES',
    title: 'PLANS FOR TODAY',
    description: '15 live shows happening right now',
    icon: '⚡',
    accentColor: '#dc2626',
    href: '/events?when=today',
  },
  {
    id: 'tomorrow',
    label: 'ADVANCE BOOKINGS',
    title: 'PLANS FOR TOMORROW',
    description: 'Pre-reserve hot tables & seats',
    icon: '📅',
    accentColor: '#06b6d4',
    href: '/events?when=tomorrow',
  },
  {
    id: 'weekend',
    label: 'FRI - SUN SPECIALS',
    title: 'PLANS FOR WEEKEND',
    description: 'Festivals, clubs & curated walks',
    icon: '🎉',
    accentColor: '#3b82f6',
    href: '/events?when=weekend',
  },
]

export const hotDeals: DealItem[] = [
  {
    id: 'd1',
    title: 'JW Marriott Hotel Kolkata',
    subtitle: 'Bengali Cuisine • 4.8 ★ • Premium Dining',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
    discount: 'Flat 20% on all Buffets + Flat 10% off',
    price: '2999',
    originalPrice: '3999',
    category: 'Hotel',
    href: '/deals/jw-marriott',
  },
  {
    id: 'd2',
    title: 'Hyatt Waterside Cafe',
    subtitle: 'Continental • 4.5 ★ • Café & Lounge',
    image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=400&fit=crop',
    discount: 'Flat 25% Off for Buffet + Free Dessert',
    price: '1299',
    originalPrice: '1899',
    category: 'Cafe',
    href: '/deals/hyatt',
  },
  {
    id: 'd3',
    title: 'The Westin Seasonal Tastes',
    subtitle: 'Asian, North Indian • 4.6 ★ • Restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    discount: 'Flat 15% off a la carte + Flat 10% off',
    price: '1999',
    originalPrice: '2499',
    category: 'Restaurant',
    href: '/deals/westin',
  },
  {
    id: 'd4',
    title: 'Aqua Java Cafe & Shah',
    subtitle: 'Italian, Continental • 4.4 ★ • Café & Lounge',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop',
    discount: 'Flat 20% Off on Breakfast + Flat 15% Off',
    price: '899',
    originalPrice: '1299',
    category: 'Cafe',
    href: '/deals/aqua-java',
  },
]

export const heritageTours: HeritageTour[] = [
  {
    id: 'h1',
    title: 'Victoria Memorial',
    description: 'Guided tour through marble marvel & royal gardens',
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&h=400&fit=crop',
    duration: '2-3 Hours',
    price: '₹1,500',
    location: 'Outdoors • Venue • 16.4 KM',
    href: '/heritage/victoria-memorial',
  },
  {
    id: 'h2',
    title: 'Howrah Bridge & River Ferry',
    description: 'Heritage walk & sunset ferry ride',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop',
    duration: '3-4 Hours',
    price: '₹850',
    location: 'Outdoors • Venue • Ghats Trail',
    href: '/heritage/howrah-bridge',
  },
  {
    id: 'h3',
    title: 'Kumortuli Clay & Artisan Walk',
    description: 'Guided tour of North Kolkata',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop',
    duration: '2 Hours',
    price: '₹450',
    location: 'Guided Tour • North Kolkata',
    href: '/heritage/kumortuli',
  },
]
