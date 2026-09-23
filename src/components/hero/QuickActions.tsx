import { Link } from 'react-router-dom'
import { Zap, Calendar, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'

const planCardsData = [
  {
    id: 'today',
    tag: 'SAME DAY PASSES',
    title: 'PLANS FOR TODAY',
    description: '18 gigs happening right now',
    icon: <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />,
    tagColor: 'text-amber-400 border-amber-500/30',
    borderColor: 'border-amber-500/20 hover:border-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.05)] hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    href: '/events?when=today',
  },
  {
    id: 'tomorrow',
    tag: 'ADVANCE BOOKINGS',
    title: 'PLANS FOR TOMORROW',
    description: 'Pre-reserve best tables & entries',
    icon: <Calendar className="w-5 h-5 text-cyan-400" />,
    tagColor: 'text-cyan-400 border-cyan-500/30',
    borderColor: 'border-cyan-500/20 hover:border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.05)] hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    href: '/events?when=tomorrow',
  },
  {
    id: 'weekend',
    tag: 'FRI - SUN SPECIALS',
    title: 'PLANS FOR WEEKEND',
    description: 'Festivals, clubs & curated tours',
    icon: <PartyPopper className="w-5 h-5 text-emerald-400" />,
    tagColor: 'text-emerald-400 border-emerald-500/30',
    borderColor: 'border-emerald-500/20 hover:border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    href: '/events?when=weekend',
  },
]

export function QuickActions() {
  return (
    <section className="w-full bg-[#0a0a0a] py-3 sm:py-5" aria-label="Quick action plans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile View: 3 Square Image Cards */}
        <div className="sm:hidden grid grid-cols-3 gap-2 mt-4">
          <Link to="/events?when=today" className="relative aspect-square rounded-xl overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=300')] bg-cover bg-center opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/90 via-amber-500/40 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-white font-extrabold text-[10px] leading-tight text-center">
              PLANS FOR<br />TODAY
            </div>
          </Link>
          <Link to="/events?when=tomorrow" className="relative aspect-square rounded-xl overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571266028243-cb41f53e972f?q=80&w=300')] bg-cover bg-center opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/90 via-cyan-500/40 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-white font-extrabold text-[10px] leading-tight text-center">
              PLANS FOR<br />TOMORROW
            </div>
          </Link>
          <Link to="/events?when=weekend" className="relative aspect-square rounded-xl overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300')] bg-cover bg-center opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/90 via-emerald-500/40 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-white font-extrabold text-[10px] leading-tight text-center">
              PLANS FOR<br />WEEKEND
            </div>
          </Link>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:grid grid-cols-3 gap-4">
          {planCardsData.map((card) => (
            <Link
              key={card.id}
              to={card.href}
              className={cn(
                'relative p-6 transition-all group cursor-pointer rounded-2xl border',
                'bg-[#121317] hover:bg-[#16181f]',
                card.borderColor
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span
                    className={cn(
                      'inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 mb-2.5 border rounded-lg',
                      card.tagColor
                    )}
                  >
                    {card.tag}
                  </span>
                  <h3 className="text-lg font-extrabold text-white tracking-tight mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-neutral-400 truncate">
                    {card.description}
                  </p>
                </div>

                <div
                  className={cn(
                    'w-11 h-11 shrink-0 flex items-center justify-center border rounded-full transition-transform group-hover:scale-105',
                    card.iconBg
                  )}
                >
                  {card.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
