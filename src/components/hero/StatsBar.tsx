import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { hotDeals } from './data'
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

interface StatsBarProps {
  title?: string;
  subtitle?: string;
  subtitleIcon?: string;
}

export function StatsBar({ 
  title = "Hot Deals & Dining Perks", 
  subtitle = "Member Privileges",
  subtitleIcon = "🎁"
}: StatsBarProps) {
  return (
    <section className="w-full bg-[#0a0a0a] py-4 sm:py-8" aria-label={title}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-accent-emerald uppercase mb-1 flex items-center gap-1.5">
              <span>{subtitleIcon}</span>
              {subtitle}
            </p>
            <h2 className="text-base sm:text-xl font-bold text-white">
              {title}
            </h2>
          </div>
          <Link
            to="/deals"
            className="text-xs sm:text-sm font-medium text-accent-red hover:text-accent-red/80 transition-colors"
          >
            EXPLORE ALL DINING (48+) →
          </Link>
        </div>

        {/* Deals Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {hotDeals.map((deal) => (
            <motion.article
              key={deal.id}
              variants={cardVariants}
              className={cn(
                'rounded-2xl overflow-hidden',
                'bg-[#141414] border border-neutral-800/50 hover:border-neutral-700',
                'transition-all group cursor-pointer hover:shadow-xl'
              )}
              aria-label={`Deal: ${deal.title}`}
            >
              {/* Deal Image */}
              <div className="relative h-32 sm:h-36 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Discount Badge */}
                {deal.discount && (
                  <div className="absolute top-2 left-2 right-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-accent-red/90 text-white text-[9px] sm:text-[10px] font-bold leading-tight">
                      {deal.discount}
                    </span>
                  </div>
                )}
              </div>

              {/* Deal Info */}
              <div className="p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-accent-red transition-colors">
                  {deal.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-neutral-500 line-clamp-1 mb-3">
                  {deal.subtitle}
                </p>

                {/* Price & Reserve */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">AVERAGE</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-white">₹{deal.price}</span>
                      {deal.originalPrice && (
                        <span className="text-[10px] text-neutral-500 line-through">
                          ₹{deal.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 text-[10px] sm:text-xs px-3 py-1 h-auto rounded-full"
                  >
                    Reserve
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
