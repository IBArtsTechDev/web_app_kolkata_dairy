import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { heritageTours } from './data'
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

export function CTASection() {
  return (
    <section className="w-full bg-[#0a0a0a] py-6 sm:py-8" aria-label="Kolkata heritage tours">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-accent-amber uppercase mb-1 flex items-center gap-1.5">
              <span>🏛️</span>
              Cultural & Architectural Legacies
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Kolkata Heritage Tour
            </h2>
          </div>
          <Link
            to="/heritage"
            className="text-xs sm:text-sm font-medium text-accent-red hover:text-accent-red/80 transition-colors"
          >
            Explore Heritage Map
          </Link>
        </div>

        {/* Heritage Tour Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {heritageTours.map((tour) => (
            <motion.article
              key={tour.id}
              variants={cardVariants}
              className={cn(
                'rounded-2xl overflow-hidden',
                'bg-[#141414] border border-neutral-800/50 hover:border-neutral-700',
                'transition-all group cursor-pointer hover:shadow-xl'
              )}
              aria-label={`Heritage tour: ${tour.title}`}
            >
              {/* Tour Image */}
              <div className="relative h-44 sm:h-48 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Location */}
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-medium">
                    📍 {tour.location}
                  </span>
                </div>
              </div>

              {/* Tour Info */}
              <div className="p-4">
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 group-hover:text-accent-red transition-colors">
                  {tour.title}
                </h3>
                <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                  {tour.description}
                </p>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white">
                    {tour.price}
                    <span className="text-[10px] text-neutral-500 font-normal ml-1">onwards</span>
                  </p>
                  <Button
                    size="sm"
                    className="bg-accent-red hover:bg-accent-red/90 text-white text-xs px-4 py-1.5 h-auto rounded-full font-semibold"
                  >
                    Book Tour
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
