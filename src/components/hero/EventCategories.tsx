import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  Film,
  Landmark,
  LandPlot,
  Mic2,
  Music2,
  Palette,
  Sparkles,
  UtensilsCrossed,
  Wine,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/common/Skeleton'
import { useCategories } from '@/hooks/useCategories'
import { isEventCategory } from '@/utils/validators'
import type { LucideIcon } from 'lucide-react'

const iconPatterns: { match: RegExp; icon: LucideIcon }[] = [
  { match: /music|song|concert|band/i, icon: Music2 },
  { match: /food|dining|culinary|cafe|restaurant/i, icon: UtensilsCrossed },
  { match: /art|exhibition|gallery|craft/i, icon: Palette },
  { match: /night|club|bar|party/i, icon: Wine },
  { match: /sport|fitness|cricket|football/i, icon: Activity },
  { match: /heritage|history|museum|tour/i, icon: Landmark },
  { match: /stand|comedy|talk|workshop|theatre/i, icon: Mic2 },
  { match: /film|screen|movie|cinema/i, icon: Film },
  { match: /festival|fair|mela/i, icon: LandPlot },
]

const colorClasses = [
  'text-white',
  'text-yellow-500',
  'text-purple-400',
  'text-pink-500',
  'text-green-400',
  'text-blue-400',
  'text-orange-400',
  'text-cyan-400',
]

function iconFor(label: string): LucideIcon {
  return iconPatterns.find((pattern) => pattern.match.test(label))?.icon ?? Sparkles
}

export function EventCategories() {
  const [selectedId, setSelectedId] = useState('')
  const navigate = useNavigate()
  const { data: categories, isLoading } = useCategories()

  if (isLoading) {
    return (
      <section className="w-full bg-[#0a0a0a] py-5 sm:py-6" aria-label="Browse by categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton width={220} height={20} className="mb-4" />
          <div className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                className="min-w-[70px] h-[72px] sm:min-w-[140px] sm:h-[104px] rounded-2xl"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!categories?.length) return null

  const items = categories.map((category, index) => ({
    id: category.categoryId,
    label: category.name,
    href: isEventCategory(category.name)
      ? `/events?category=${encodeURIComponent(category.name)}`
      : '/events',
    icon: iconFor(category.name),
    image: category.icon,
    colorClass: colorClasses[index % colorClasses.length],
  }))

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
            to="/events"
            className="text-[11px] font-bold text-[#FF2E4D] hover:underline uppercase tracking-wider"
          >
            VIEW ALL &gt;
          </Link>
        </div>

        {/* Categories Grid / Scroll */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory">
          {items.map((category) => {
            const isActive = selectedId === category.id
            const Icon = category.icon

            return (
              <div key={category.id} className="relative group snap-start shrink-0">
                <button
                  onClick={() => {
                    setSelectedId(category.id)
                    navigate(category.href)
                  }}
                  className={cn(
                    'flex flex-col items-center justify-center transition-all cursor-pointer rounded-2xl w-full',
                    // Mobile
                    'gap-2 py-2 px-2 min-w-[70px]',
                    // Desktop
                    'sm:gap-2.5 sm:w-[140px] sm:h-[104px] sm:py-0 sm:px-0 sm:min-w-0',
                    isActive
                      ? 'sm:bg-gradient-to-b sm:from-[#ff445d] sm:to-[#d61a32] sm:shadow-[0_0_25px_rgba(255,46,77,0.3)] text-[#FF2E4D] sm:text-white'
                      : 'sm:bg-[#111111] sm:border sm:border-[#1e1e1e] sm:hover:border-white/10 sm:hover:bg-[#161616]',
                  )}
                  aria-label={`Browse ${category.label} events`}
                >
                  <div
                    className={cn(
                      'w-12 h-12 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all',
                      isActive
                        ? 'bg-[#FF2E4D] sm:bg-white/20 shadow-[0_0_15px_rgba(255,46,77,0.5)] sm:shadow-none'
                        : 'bg-[#141414] sm:bg-[#1a1a1a] border border-neutral-800 sm:border-transparent',
                    )}
                  >
                    {category.image ? (
                      <img
                        src={category.image}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon
                        className={cn('w-5 h-5', isActive ? 'text-white' : category.colorClass)}
                      />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] sm:text-xs leading-none text-center whitespace-nowrap',
                      isActive
                        ? 'font-bold sm:text-white text-[#FF2E4D]'
                        : 'text-neutral-400 sm:text-neutral-300 font-medium',
                    )}
                  >
                    {category.label}
                  </span>
                </button>


              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
