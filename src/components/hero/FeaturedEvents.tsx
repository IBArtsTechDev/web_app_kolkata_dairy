import { useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/common/Skeleton'
import { BookmarkButton, FavoriteButton } from '@/components/engagement'
import { useEvents } from '@/hooks/useEvents'


const cardVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const EVENT_LIMIT = 8

export function FeaturedEvents() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { data, isLoading, isError } = useEvents({
    limit: EVENT_LIMIT,
    sortBy: 'startsAt',
    sortOrder: 'ASC',
  })

  const events = data?.data ?? []

  const scrollContainer = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = direction === 'left' ? -320 : 320
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }, [])

  if (!isLoading && !isError && events.length === 0) return null

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
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
        >
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[240px] sm:w-[260px] rounded-2xl overflow-hidden bg-[#1c1c1e] first:ml-4 sm:first:ml-0"
              >
                <Skeleton variant="rectangular" className="w-full h-40 sm:h-44 rounded-none" />
                <div className="p-3 sm:p-4 space-y-2">
                  <Skeleton width="75%" height={16} />
                  <Skeleton width="55%" height={12} />
                  <Skeleton width="40%" height={14} />
                </div>
              </div>
            ))}

          {isError && (
            <div className="w-full py-8 text-center">
              <p className="text-sm text-neutral-400">
                We couldn&apos;t load trending events right now. Please try again shortly.
              </p>
            </div>
          )}

          {!isLoading &&
            events.map((event) => (
              <motion.article
                key={event.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                onClick={() => navigate(`/events/${event.id}`)}
                className={cn(
                  'flex-shrink-0 w-[240px] sm:w-[260px] rounded-2xl sm:rounded-[20px] overflow-hidden snap-start',
                  'bg-[#1c1c1e] sm:bg-[#1c1c1e]',
                  'transition-all group cursor-pointer hover:scale-[1.02] first:ml-4 sm:first:ml-0'
                )}
                aria-label={`Event: ${event.title}`}
              >
                {/* Event Image */}
                <div className="relative h-40 sm:h-44 overflow-hidden bg-gradient-to-br from-primary-400 to-secondary-500">
                  {event.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white/30">{event.title.slice(0, 2)}</span>
                    </div>
                  )}

                  {/* Action Badges */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <FavoriteButton
                      entityType="event"
                      entityId={event.id}
                      entityTitle={event.title}
                      size={14}
                      className="w-7 h-7"
                    />
                    <BookmarkButton
                      entityType="event"
                      entityId={event.id}
                      entityTitle={event.title}
                      size={14}
                      className="w-7 h-7"
                    />
                  </div>
                </div>

                {/* Event Info */}
                <div className="p-3 sm:p-4 flex flex-col gap-1 sm:gap-1.5">
                  <h3 className="text-[15px] sm:text-base font-semibold text-white leading-tight">
                    {event.title}
                  </h3>

                  <p className="text-[12px] sm:text-[13px] text-neutral-400 font-medium">
                    {format(parseISO(event.startDate), 'EEE, d MMM')} •{' '}
                    {format(parseISO(event.startDate), 'HH:mm')} •{' '}
                    {event.location.city || event.location.venue}
                  </p>

                  <p className="text-[13px] sm:text-[14px] font-bold text-white mt-1">
                    ₹{(event.ticketPrice ?? 0).toLocaleString('en-IN')}{' '}
                    <span className="font-semibold text-white">Onwards</span>
                  </p>
                </div>
              </motion.article>
            ))}
        </div>
      </div>
    </section>
  )
}
