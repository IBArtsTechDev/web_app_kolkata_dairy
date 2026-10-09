import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/common/Skeleton'
import { BookmarkButton, FavoriteButton } from '@/components/engagement'
import { useInfiniteEvents } from '@/hooks/useEvents'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const badgeColors: Record<string, string> = {
  Music: 'bg-accent-red/90 text-white',
  Nightlife: 'bg-accent-amber/90 text-black',
  Festival: 'bg-accent-emerald/90 text-white',
  Food: 'bg-accent-cyan/90 text-white',
  Sports: 'bg-accent-blue/90 text-white',
}

const fallbackBadgeColors = ['bg-accent-red/90 text-white', 'bg-accent-amber/90 text-black']

export function SpotlightSection() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteEvents({
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  })

  const events = data?.pages.flatMap((page) => page.data) ?? []

  if (!isLoading && !isError && events.length === 0) return null

  return (
    <section className="w-full bg-[#0a0a0a] py-6 sm:py-8" aria-label="Curated spotlight events">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-accent-amber uppercase mb-1 flex items-center gap-1.5">
              <span>🌟</span>
              Curated Headliners
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-white">In The Spotlight</h2>
          </div>
          <Link
            to="/events"
            className="text-xs sm:text-sm font-medium text-accent-red hover:text-accent-red/80 transition-colors"
          >
            EXPLORE ALL SPOTLIGHT →
          </Link>
        </div>

        {/* Spotlight Cards */}
        {/* Spotlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading &&
            Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="rounded-2xl overflow-hidden bg-[#141414]">
                <Skeleton variant="rectangular" className="w-full h-48 sm:h-52 rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton width="70%" height={16} />
                  <Skeleton width="50%" height={12} />
                </div>
              </div>
            ))}

          {isError && (
            <div className="col-span-full py-8 text-center">
              <p className="text-sm text-neutral-400">
                Spotlight picks are unavailable right now. Please try again shortly.
              </p>
            </div>
          )}

          {!isLoading &&
            events.map((event, index) => (
              <motion.article
                key={event.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className={cn(
                  'rounded-2xl overflow-hidden',
                  'bg-[#141414] border border-neutral-800/50 hover:border-neutral-700',
                  'transition-all group cursor-pointer hover:shadow-xl'
                )}
                aria-label={`Spotlight: ${event.title}`}
              >
                {/* Event Image */}
                <Link to={`/events/${event.id}`} className="relative block h-48 sm:h-52 overflow-hidden">
                  {event.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badge */}
                  {event.category && (
                    <div className="absolute top-3 left-3">
                      <span
                        className={cn(
                          'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                          badgeColors[event.category] ?? fallbackBadgeColors[index % fallbackBadgeColors.length],
                        )}
                      >
                        {event.category}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
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
                </Link>

                {/* Event Info */}
                <div className="p-4">
                  <h3 className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-accent-red transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-1">
                    <span className="truncate">{event.location.venue}</span>
                    <span>•</span>
                    <span>{format(parseISO(event.startDate), 'HH:mm')}</span>
                    <span>•</span>
                    <span className="truncate">{event.location.city}</span>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm font-bold text-white">
                      ₹{(event.ticketPrice ?? 0).toLocaleString('en-IN')}
                      <span className="text-[10px] text-neutral-500 font-normal ml-1">onwards</span>
                    </p>
                    <Link to={`/events/${event.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hidden sm:inline-flex border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 text-xs px-4 py-1.5 h-auto rounded-full"
                      >
                        Grab Passes
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
        </div>

        {/* Load More Button */}
        {hasNextPage && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 bg-[#141414] rounded-full px-8 flex items-center gap-2"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
