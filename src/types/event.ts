/* ============================================
   Event Management System - Type Definitions
   ============================================ */

/** Base entity with common fields */
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt?: string
}

/** Event status enumeration (mirrors API enum) */
export type EventStatus = 'draft' | 'active' | 'hidden' | 'past' | 'cancelled'

/** Event category enumeration (mirrors API enum) */
export type EventCategory =
  | 'Music'
  | 'Theatre'
  | 'Exhibition'
  | 'Nightlife'
  | 'Sports'
  | 'Food'
  | 'Workshop'
  | 'Festival'
  | 'Other'

/** Recurrence pattern for recurring events */
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'yearly'

/** Core Event entity */
export interface Event extends BaseEntity {
  title: string
  description: string | null
  shortDescription?: string
  category: EventCategory | null
  status: EventStatus
  isActive?: boolean
  startDate: string
  endDate: string
  timezone?: string
  location: EventLocation
  organizer?: Organizer
  coverImage?: string | null
  gallery?: string[]
  tags?: string[]
  capacity?: number
  attendeeCount?: number
  isOnline: boolean
  meetingUrl?: string
  isFree: boolean
  ticketPrice?: number
  currency?: string
  sourceUrl?: string | null
  ticketUrl?: string | null
  recurrence?: {
    pattern: RecurrencePattern
    interval: number
    endDate?: string
  }
}

/** Event location details */
export interface EventLocation {
  type: 'physical' | 'virtual' | 'hybrid'
  venue?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  area?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

/** Event organizer */
export interface Organizer {
  id: string
  name: string
  email?: string
  avatar?: string
  bio?: string
}

/** Event attendee */
export interface Attendee extends BaseEntity {
  eventId: string
  userId: string
  name: string
  email: string
  avatar?: string
  status: 'registered' | 'confirmed' | 'cancelled'
  registeredAt: string
}

/** Ticket type for paid events */
export interface TicketType {
  id: string
  eventId: string
  name: string
  description?: string
  price: number
  currency: string
  quantity: number
  soldCount: number
  saleStart: string
  saleEnd: string
}

/** Pagination metadata returned by the API */
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/** Paginated API response wrapper */
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/** Standard API response envelope */
export interface ApiResponse<T> {
  status: 'success' | 'error' | 'fail'
  message: string
  data?: T
  error?: unknown
  meta?: unknown
  timestamp?: string
}

/** Field level validation error */
export interface ApiFieldError {
  field: string
  message: string
}

/** API error response */
export interface ApiError {
  message: string
  statusCode: number
  errorCode?: string
  errors?: ApiFieldError[]
}

/** Filter options for querying events */
export interface EventFilters {
  search?: string
  category?: EventCategory
  status?: EventStatus
  startDate?: string
  endDate?: string
  isOnline?: boolean
  isFree?: boolean
  city?: string
  area?: string
  tags?: string[]
  page?: number
  limit?: number
  sortBy?: 'startsAt' | 'endsAt' | 'createdAt' | 'priceMin' | 'title'
  sortOrder?: 'ASC' | 'DESC'
}

/** Create event payload */
export interface CreateEventPayload {
  title: string
  description?: string | null
  startsAt: string
  endsAt?: string | null
  venueName: string
  venueAddress?: string | null
  city?: string
  area?: string | null
  latitude?: number | null
  longitude?: number | null
  category?: EventCategory | null
  imageUrl?: string | null
  sourceUrl?: string | null
  ticketUrl?: string | null
  priceMin?: number
  currency?: string
  status?: EventStatus
  isActive?: boolean
}

/** Update event payload */
export type UpdateEventPayload = Partial<CreateEventPayload>
