import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

import drinksImg from '@/assets/images/drinks.jpg'

export function AfterOfficeHours() {
  return (
    <section className="w-full bg-[#0a0a0a] py-6 sm:py-8" aria-label="After office hours and sports screenings">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* After Office Hours Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden bg-[#141414] border border-neutral-800/50 p-6 sm:p-8 flex flex-col justify-between"
          >
            {/* Background Image & Gradient */}
            <div className="absolute right-0 bottom-0 w-2/3 h-full pointer-events-none">
              <img src={drinksImg} alt="" className="w-full h-full object-cover opacity-40 mix-blend-lighten" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent opacity-80" />
            </div>
            
            {/* Red Edge Accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-red shadow-[0_0_15px_rgba(255,46,77,0.8)]" />
            
            <div className="relative z-10 pl-4">
              <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-accent-red uppercase mb-2 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-accent-red/20 text-accent-red flex items-center justify-center text-[8px]">★</span>
                Kolkata Diary Feature
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                After Office<br />Hours
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6 max-w-[384px]">
                Check out the best chill hangout spots, speakeasy tavern hops, and rooftop terraces the city has to offer after 8 PM.
              </p>
              <Button className="bg-accent-red hover:bg-accent-red/90 text-white text-xs font-semibold px-5 py-2.5 h-auto rounded-full shadow-[0_0_15px_rgba(255,46,77,0.4)] transition-all hover:shadow-[0_0_25px_rgba(255,46,77,0.6)]">
                EXPLORE HANGOUTS
              </Button>
            </div>
          </motion.div>

          {/* Sports Mania Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl overflow-hidden bg-[#141414] border border-neutral-800/50 p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
                Live Arena Screenings
              </p>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-5">
              Sports Mania
            </h2>

            {/* Match Card 1 */}
            <div className="bg-[#1a1a1e] rounded-lg border border-neutral-800/50 p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇧🇪</span>
                    <div>
                      <p className="text-sm font-bold text-white">Belgium</p>
                      <p className="text-[10px] text-neutral-500">National Team</p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-600 font-bold">VS</span>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">Japan</p>
                      <p className="text-[10px] text-neutral-500">National Team</p>
                    </div>
                    <span className="text-lg">🇯🇵</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-neutral-500">15 May • 19:30</p>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-white">₹899<span className="text-[10px] text-neutral-500 font-normal ml-0.5">onwards</span></p>
                  <Button size="sm" className="bg-accent-red hover:bg-accent-red/90 text-white text-[10px] px-3 py-1 h-auto rounded-full font-semibold">
                    Reserve Seat
                  </Button>
                </div>
              </div>
            </div>

            {/* Match Card 2 */}
            <div className="flex items-center justify-between py-3 border-t border-neutral-800/50">
              <div className="flex items-center gap-2">
                <span className="text-sm">🇨🇷</span>
                <span className="text-xs font-medium text-neutral-300">Costa Rica vs Germany</span>
                <span className="text-sm">🇩🇪</span>
              </div>
              <p className="text-xs text-neutral-500">₹799 Onwards - Passes</p>
            </div>

            <div className="pt-3 border-t border-neutral-800/50">
              <p className="text-[11px] text-neutral-500 mb-2">
                Official live screenings for parts across South & Eastern Avenue
              </p>
              <Link to="/sports/schedule" className="text-xs font-semibold text-accent-red hover:underline">
                Full Schedule →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
