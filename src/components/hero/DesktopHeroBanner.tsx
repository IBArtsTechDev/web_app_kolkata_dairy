import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBanners } from '@/hooks/useBanners'
import { toBannerSlides } from './bannerSlides'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const },
  }),
}

export function DesktopHeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()
  const { data: apiBanners } = useBanners()

  const slides = toBannerSlides(apiBanners)
  const activeIndex = slides.length ? currentIndex % slides.length : 0
  const activeSlide = slides[activeIndex]

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section
      className="hidden sm:block relative w-full bg-[#0a0a0a] pt-4 pb-8 px-4"
      aria-label="Hero banner"
    >
      <div className="max-w-[1400px] mx-auto rounded-[2rem] border border-neutral-800/60 overflow-hidden relative">
        {/* Background Banners Carousel */}
        <div className="absolute inset-0 w-full h-full bg-[#050505]">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={activeIndex}
              src={activeSlide.image}
              alt={activeSlide.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full object-cover object-[center_right] sm:object-center pointer-events-none mix-blend-lighten"
            />
          </AnimatePresence>

          {/* Dark Contrast Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/10 to-[#0a0a0a]/80 pointer-events-none" />
          
          {/* Vibrant Red Gradients */}
          <div className="absolute top-0 right-[15%] w-[500px] h-[500px] bg-[#FF2E4D]/20 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-[#FF2E4D]/15 blur-[100px] pointer-events-none rounded-full" />
        </div>

        <div className="relative z-10 px-8 sm:px-12 lg:px-16 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-28 lg:pb-20 flex flex-col justify-between min-h-[600px]">
          
          {/* Main Hero Content */}
          <div className="max-w-[800px]">

            {/* Main Heading */}
            <motion.h1
              custom={1}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight"
            >
              Discover the best
              <br />
              events &amp; nightlife in
              <br />
              <span className="text-[#FF2E4D] font-englebert font-normal tracking-wide text-7xl lg:text-8xl block mt-2">Kolkata</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              custom={2}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mt-8 text-base sm:text-md text-neutral-300 max-w-[640px] leading-relaxed"
            >
              From high-octane Park Street electronic beats to intimate Kalighat
              heritage photowalks and JW Marriott gourmet buffets. Curated for the
              true connoisseur.
            </motion.p>
          </div>

          {/* Bottom Row: CTA and Status */}
          <motion.div
            custom={3}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-12 sm:mt-16 w-full"
          >
            {/* CTA Buttons - Left Aligned */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                size="lg"
                className="bg-[#FF2E4D] hover:bg-[#e02441] text-white px-6 py-4 rounded-xl h-auto text-[15px] font-bold transition-all active:scale-[0.99]"
                onClick={() =>
                  activeSlide.link
                    ? window.open(activeSlide.link, '_blank', 'noopener,noreferrer')
                    : navigate('/events')
                }
              >
                Explore Top Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>


            </div>

            {/* Status Pill and Dots - Right Aligned */}
            <div className="flex flex-col items-end gap-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-neutral-800 bg-black/50 text-[11px] text-neutral-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Over 120+ live gigs happening this weekend</span>
              </div>

              {/* Carousel Indicator Dots */}
              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 transition-all rounded-full ${
                      idx === currentIndex ? 'w-8 bg-[#FF2E4D]' : 'w-1.5 bg-neutral-600 hover:bg-neutral-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
