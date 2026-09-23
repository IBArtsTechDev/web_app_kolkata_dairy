import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { DesktopHeroBanner } from './DesktopHeroBanner'
import { banners } from './data'

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* Mobile-only Hero Banner */}
      <section className="sm:hidden px-4 py-4 bg-[#0a0a0a]">
        <div className="relative rounded-2xl bg-black overflow-hidden p-5 min-h-[160px] border border-white/5">
          
          {/* Animated Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={currentIndex}
                src={banners[currentIndex]}
                alt="Kolkata Night Event"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              />
            </AnimatePresence>
          </div>

          {/* Gradient Overlay for Text Readability & Brand Tint */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF2E4D]/30 to-[#cc1a35]/10 mix-blend-color pointer-events-none" />
          
          <div className="relative z-10 max-w-[75%]">
            <h1 className="text-xl font-extrabold text-white leading-tight tracking-tight mb-2 drop-shadow-md">
              Discover the best<br />events in <span className="font-englebert text-3xl font-normal tracking-wide text-[#FF2E4D]">Kolkata</span>
            </h1>
            <p className="text-[10px] text-white/90 leading-snug mb-4 max-w-[160px] drop-shadow-sm font-medium">
              Check out the best attractions the city of joy has to offer
            </p>
            <Button
              className="bg-[#FF2E4D] border border-transparent text-white hover:bg-white/10 px-4 py-1.5 h-auto text-[10px] font-semibold rounded-full shadow-[0_0_10px_rgba(255,46,77,0.4)]"
            >
              Explore
            </Button>
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4" role="tablist" aria-label="Banner slides">
          {banners.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                idx === currentIndex ? 'w-4 bg-[#FF2E4D]' : 'w-1.5 bg-neutral-600'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Desktop-only Hero Banner */}
      <DesktopHeroBanner />
    </>
  )
}
