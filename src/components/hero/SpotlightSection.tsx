import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { spotlightEvents } from './data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

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
  red: 'bg-accent-red/90 text-white',
  amber: 'bg-accent-amber/90 text-black',
  emerald: 'bg-accent-emerald/90 text-white',
  cyan: 'bg-accent-cyan/90 text-white',
  blue: 'bg-accent-blue/90 text-white',
}

export function SpotlightSection() {
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
            to="/spotlight"
            className="text-xs sm:text-sm font-medium text-accent-red hover:text-accent-red/80 transition-colors"
          >
            EXPLORE ALL SPOTLIGHT (18+) →
          </Link>
        </div>

        {/* Spotlight Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {spotlightEvents.map((event) => (
            <motion.article
              key={event.id}
              variants={cardVariants}
              className={cn(
                'rounded-2xl overflow-hidden',
                'bg-[#141414] border border-neutral-800/50 hover:border-neutral-700',
                'transition-all group cursor-pointer hover:shadow-xl'
              )}
              aria-label={`Spotlight: ${event.title}`}
            >
              {/* Event Image */}
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge */}
                {event.badge && (
                  <div className="absolute top-3 left-3">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                        badgeColors[event.badgeColor || 'red']
                      )}
                    >
                      {event.badge}
                    </span>
                  </div>
                )}

                {/* Save button */}
                <button
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  aria-label={`Save ${event.title}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Event Info */}
              <div className="p-4">
                <h3 className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-accent-red transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-1">
                  <span>{event.description}</span>
                  <span>•</span>
                  <span>{event.time}</span>
                  <span>•</span>
                  <span>{event.venue}</span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm font-bold text-white">
                    ₹{event.price.toLocaleString()}
                    <span className="text-[10px] text-neutral-500 font-normal ml-1">onwards</span>
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hidden sm:inline-flex border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 text-xs px-4 py-1.5 h-auto rounded-full"
                  >
                    Grab Passes
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
