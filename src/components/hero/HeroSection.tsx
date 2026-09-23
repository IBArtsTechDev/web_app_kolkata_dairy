import { HeroBanner } from './HeroBanner'
import { EventCategories } from './EventCategories'
import { QuickActions } from './QuickActions'
import { FeaturedEvents } from './FeaturedEvents'
import { SpotlightSection } from './SpotlightSection'
import { LocalMotionPictures } from './LocalMotionPictures'
import { StatsBar } from './StatsBar'
import { CTASection } from './CTASection'
import { AfterOfficeHours } from './AfterOfficeHours'

export function HeroSection() {
  return (
    <div className="w-full bg-[#0a0a0a]">
      <HeroBanner />
      <EventCategories />
      <FeaturedEvents />
      <SpotlightSection />
      <LocalMotionPictures />
      <QuickActions />
      <StatsBar />
      <CTASection />
      <AfterOfficeHours />
      
      {/* Mobile-only additional curated deals */}
      <div className="sm:hidden pb-16">
        <StatsBar title="Curated for you" subtitle="Personalized Picks" subtitleIcon="✨" />
      </div>
    </div>
  )
}
