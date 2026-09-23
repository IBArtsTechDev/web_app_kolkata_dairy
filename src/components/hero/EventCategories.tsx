import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Music2,
  UtensilsCrossed,
  Palette,
  Wine,
  Activity,
  Landmark,
  Mic2,
  Film,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const categoriesList = [
  { id: '1', label: 'Music', href: '/category/music', icon: Music2, colorClass: 'text-white' },
  { id: '2', label: 'Dining', href: '/category/dining', icon: UtensilsCrossed, colorClass: 'text-yellow-500' },
  { id: '3', label: 'Art & Visuals', href: '/category/art', icon: Palette, colorClass: 'text-purple-400' },
  { id: '4', label: 'Nightlife', href: '/category/nightlife', icon: Wine, colorClass: 'text-pink-500' },
  { id: '5', label: 'Sports', href: '/category/sports', icon: Activity, colorClass: 'text-green-500' },
  { id: '6', label: 'Heritage', href: '/category/heritage', icon: Landmark, colorClass: 'text-yellow-200' },
  { id: '7', label: 'Standup', href: '/category/standup', icon: Mic2, colorClass: 'text-blue-400' },
  { id: '8', label: 'Screenings', href: '/category/screenings', icon: Film, colorClass: 'text-red-400' },
]

export function EventCategories() {
  const [selectedId, setSelectedId] = useState('1')

  return (
    <section className="w-full bg-[#0a0a0a] py-5 sm:py-6" aria-label="Browse by categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Browse By Categories
            </h2>
            <span className="text-xs text-neutral-500 hidden sm:inline font-medium">
              (Selected for You)
            </span>
          </div>
          <Link
            to="/categories"
            className="text-[11px] font-bold text-[#FF2E4D] hover:underline uppercase tracking-wider"
          >
            VIEW ALL &gt;
          </Link>
        </div>

        {/* Categories Grid / Scroll */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory">
          {categoriesList.map((category) => {
            const isActive = selectedId === category.id
            const Icon = category.icon

            return (
              <button
                key={category.id}
                onClick={() => setSelectedId(category.id)}
                className={cn(
                  'flex flex-col items-center justify-center transition-all cursor-pointer rounded-2xl snap-start',
                  // Mobile
                  'gap-2 py-2 px-2 min-w-[70px]',
                  // Desktop
                  'sm:gap-2.5 sm:w-[140px] sm:h-[104px] sm:py-0 sm:px-0 sm:min-w-0',
                  isActive
                    ? 'sm:bg-gradient-to-b sm:from-[#ff445d] sm:to-[#d61a32] sm:shadow-[0_0_25px_rgba(255,46,77,0.3)] text-[#FF2E4D] sm:text-white'
                    : 'sm:bg-[#111111] sm:border sm:border-[#1e1e1e] sm:hover:border-white/10 sm:hover:bg-[#161616]'
                )}
                aria-label={`Browse ${category.label} events`}
              >
                <div
                  className={cn(
                    'w-12 h-12 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all',
                    isActive 
                      ? 'bg-[#FF2E4D] sm:bg-white/20 shadow-[0_0_15px_rgba(255,46,77,0.5)] sm:shadow-none' 
                      : 'bg-[#141414] sm:bg-[#1a1a1a] border border-neutral-800 sm:border-transparent'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive ? 'text-white' : category.colorClass)} />
                </div>
                <span
                  className={cn(
                    'text-[10px] sm:text-xs leading-none text-center whitespace-nowrap',
                    isActive ? 'font-bold sm:text-white text-[#FF2E4D]' : 'text-neutral-400 sm:text-neutral-300 font-medium'
                  )}
                >
                  {category.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
