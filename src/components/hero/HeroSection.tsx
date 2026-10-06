import { HeroBanner } from './HeroBanner'
import { EventCategories } from './EventCategories'
import { FeaturedEvents } from './FeaturedEvents'
import { SpotlightSection } from './SpotlightSection'

export function HeroSection() {
  return (
    <div className="w-full bg-[#0a0a0a]">
      <HeroBanner />
      <EventCategories />
      <FeaturedEvents />
      <SpotlightSection />
    </div>
  )
}
