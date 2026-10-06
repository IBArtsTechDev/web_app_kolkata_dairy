import type { EventStatus, EventCategory } from '@/types'

/** Pagination block returned inside `data` by list endpoints */
export interface PaginationDto {
  page: number
  limit: number
  total: number
  totalPages: number
}

/** `GET /api/v1/categories` + `GET /api/v1/admin/fetch-category` */
export interface CategoryDto {
  id: number
  categoryId: string
  categoryName: string
  categorySlug: string
  categoryIcon: string | null
  isActive: boolean | number
  description: string | null
  createdAt: string
}

/** `GET /api/v1/banners` + `GET /api/v1/admin/fetch-banner` */
export interface BannerDto {
  id: number
  bannerId: string
  title: string
  imageUrl: string
  link: string | null
  sortOrder: number
  isActive: boolean | number
  createdAt: string
}

/** `GET /api/v1/events` + `GET /api/v1/events/:eventId` */
export interface EventDto {
  id: number
  eventId: string
  title: string
  description: string | null
  startsAt: string
  endsAt: string | null
  venueName: string
  venueAddress: string | null
  city: string
  area: string | null
  latitude: string | number | null
  longitude: string | number | null
  category: EventCategory | null
  imageUrl: string | null
  sourceUrl: string | null
  ticketUrl: string | null
  priceMin: string | number
  currency: string
  isFree?: boolean | number
  status: EventStatus
  isActive: boolean | number
  createdAt: string
}

/** `data` of `GET /api/v1/events` and `GET /api/v1/admin/fetch-event` */
export interface EventListDto {
  events: EventDto[]
  pagination: PaginationDto
}
