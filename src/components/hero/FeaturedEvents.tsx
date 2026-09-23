import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { trendingEvents } from './data'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function FeaturedEvents() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollContainer = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = direction === 'left' ? -320 : 320
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }, [])

  return (
    <section className="w-full bg-[#0a0a0a] py-6 sm:py-8" aria-label="Trending events today">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-accent-red uppercase mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-red" />
              Live Buzz
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-white">Trending Today</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollContainer('left')}
              className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollContainer('right')}
              className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Events Horizontal Scroll */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
        >
          {trendingEvents.map((event) => (
            <motion.article
              key={event.id}
              variants={cardVariants}
              className={cn(
                'flex-shrink-0 w-[240px] sm:w-[260px] rounded-2xl sm:rounded-[20px] overflow-hidden snap-start',
                'bg-[#1c1c1e] sm:bg-[#1c1c1e]',
                'transition-all group cursor-pointer hover:scale-[1.02]'
              )}
              aria-label={`Event: ${event.title}`}
            >
              {/* Event Image */}
              <div className="relative h-40 sm:h-44 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Bookmark Badge */}
                <button
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors"
                  aria-label={`Bookmark ${event.title}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                    <path fillRule="evenodd" d="M6 3a3 3 0 00-3 3v12.75a.75.75 0 001.25.55l5.25-4.68 5.25 4.68a.75.75 0 001.25-.55V6a3 3 0 00-3-3H6z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Event Info */}
              <div className="p-3 sm:p-4 flex flex-col gap-1 sm:gap-1.5">
                <h3 className="text-[15px] sm:text-base font-semibold text-white leading-tight">
                  {event.title}
                </h3>
                
                <p className="text-[12px] sm:text-[13px] text-neutral-400 font-medium">
                  {event.date} • {event.time} • {event.location}
                </p>

                <p className="text-[13px] sm:text-[14px] font-bold text-white mt-1">
                  ₹{event.price.toLocaleString()} <span className="font-semibold text-white">Onwards</span>
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
