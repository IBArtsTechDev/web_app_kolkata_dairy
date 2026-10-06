import { banners as fallbackBanners } from './data'
import type { Banner } from '@/types'

export interface BannerSlide {
  image: string
  title: string
  link: string | null
}

/**
 * Active banners come from the API; the local brand assets are used as a
 * graceful fallback when the API returns nothing.
 */
export function toBannerSlides(apiBanners?: Banner[]): BannerSlide[] {
  if (apiBanners?.length) {
    const slides = apiBanners
      .filter((banner) => banner.image)
      .map((banner) => ({ image: banner.image, title: banner.title, link: banner.link }))
    if (slides.length) return slides
  }

  return fallbackBanners.map((image) => ({
    image,
    title: 'Kolkata Night Event',
    link: null,
  }))
}
