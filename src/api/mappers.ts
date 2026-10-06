import type { ApiResponse, Banner, Category, CreateEventPayload, Event, PaginationMeta } from '@/types'
import type { CreateEventFormData } from '@/utils/validators'
import type { BannerDto, CategoryDto, EventDto, EventListDto, PaginationDto } from './dto'
import { resolveAssetUrl } from './client'

const toBoolean = (
  value: boolean | number | string | undefined,
  fallback = false,
): boolean => {
  if (value === undefined) return fallback
  if (typeof value === 'boolean') return value
  return value === 'true' || value === '1' || value === 1
}

const toNumber = (value: string | number | null | undefined): number | undefined => {
  if (value === null || value === undefined || value === '') return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

export function toPaginationMeta(pagination?: PaginationDto): PaginationMeta {
  const page = pagination?.page ?? 1
  const limit = pagination?.limit ?? 10
  const total = pagination?.total ?? 0
  const totalPages = pagination?.totalPages ?? 0

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export function pick<T>(response: ApiResponse<unknown>, key: string): T | undefined {
  const payload = response.data as Record<string, T> | undefined
  if (!payload) return undefined
  return payload[key] as T | undefined
}

export function mapEvent(dto: EventDto): Event {
  const ticketPrice = toNumber(dto.priceMin) ?? 0
  const latitude = toNumber(dto.latitude)
  const longitude = toNumber(dto.longitude)

  return {
    id: dto.eventId,
    createdAt: dto.createdAt,
    title: dto.title,
    description: dto.description,
    category: dto.category ?? null,
    status: dto.status,
    isActive: toBoolean(dto.isActive, true),
    startDate: dto.startsAt,
    endDate: dto.endsAt ?? dto.startsAt,
    location: {
      type: 'physical',
      venue: dto.venueName,
      address: dto.venueAddress ?? undefined,
      city: dto.city,
      area: dto.area ?? undefined,
      coordinates:
        latitude !== undefined && longitude !== undefined
          ? { latitude, longitude }
          : undefined,
    },
    coverImage: resolveAssetUrl(dto.imageUrl),
    isOnline: false,
    isFree: dto.isFree !== undefined ? toBoolean(dto.isFree) : ticketPrice === 0,
    ticketPrice,
    currency: dto.currency,
    sourceUrl: dto.sourceUrl,
    ticketUrl: dto.ticketUrl,
  }
}

export function mapEventList(dto?: EventListDto): { data: Event[]; meta: PaginationMeta } {
  return {
    data: (dto?.events ?? []).map(mapEvent),
    meta: toPaginationMeta(dto?.pagination),
  }
}

export function mapBanner(dto: BannerDto): Banner {
  return {
    id: String(dto.id),
    bannerId: dto.bannerId,
    title: dto.title,
    image: resolveAssetUrl(dto.imageUrl) ?? '',
    link: dto.link,
    sortOrder: dto.sortOrder,
    isActive: toBoolean(dto.isActive),
    createdAt: dto.createdAt,
  }
}

export function mapCategory(dto: CategoryDto): Category {
  return {
    id: String(dto.id),
    categoryId: dto.categoryId,
    name: dto.categoryName,
    slug: dto.categorySlug,
    icon: resolveAssetUrl(dto.categoryIcon) ?? null,
    description: dto.description,
    isActive: toBoolean(dto.isActive),
    createdAt: dto.createdAt,
  }
}

/** Converts the create-event form values into the API payload contract. */
export function toEventPayload(data: CreateEventFormData): CreateEventPayload {
  return {
    title: data.title,
    description: data.description || null,
    startsAt: new Date(data.startsAt).toISOString(),
    endsAt: data.endsAt ? new Date(data.endsAt).toISOString() : null,
    venueName: data.venueName,
    venueAddress: data.venueAddress || null,
    city: data.city,
    area: data.area || null,
    category: data.category,
    priceMin: data.isFree ? 0 : (data.priceMin ?? 0),
    currency: data.currency,
    status: data.status,
    isActive: data.isActive,
    sourceUrl: data.sourceUrl || null,
    ticketUrl: data.ticketUrl || null,
  }
}

/** Converts a mapped event back into form values (admin edit mode). */
export function toEventFormValues(event: Event): Partial<CreateEventFormData> {
  return {
    title: event.title,
    description: event.description ?? '',
    category: event.category ?? 'Other',
    startsAt: toLocalInputValue(event.startDate),
    endsAt: event.endDate ? toLocalInputValue(event.endDate) : '',
    venueName: event.location.venue ?? '',
    venueAddress: event.location.address ?? '',
    city: event.location.city ?? 'Kolkata',
    area: event.location.area ?? '',
    isFree: event.isFree,
    priceMin: event.ticketPrice ?? 0,
    currency: event.currency ?? 'INR',
    status: event.status,
    isActive: event.isActive ?? true,
    sourceUrl: event.sourceUrl ?? '',
    ticketUrl: event.ticketUrl ?? '',
  }
}

function toLocalInputValue(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (unit: number) => String(unit).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
