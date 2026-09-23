/* ============================================
   Event Management System - Type Definitions
   ============================================ */

/** Base entity with common fields */
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

/** Event status enumeration */
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'

/** Event category enumeration */
export type EventCategory =
  | 'conference'
  | 'workshop'
  | 'seminar'
  | 'webinar'
  | 'meetup'
  | 'social'
  | 'concert'
  | 'sports'
  | 'charity'
  | 'other'

/** Recurrence pattern for recurring events */
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'yearly'

/** Core Event entity */
export interface Event extends BaseEntity {
  title: string
  description: string
  shortDescription?: string
  category: EventCategory
  status: EventStatus
  startDate: string
  endDate: string
  timezone: string
  location: EventLocation
  organizer: Organizer
  coverImage?: string
  gallery?: string[]
  tags?: string[]
  capacity?: number
  attendeeCount: number
  isOnline: boolean
  meetingUrl?: string
  isFree: boolean
  ticketPrice?: number
  currency?: string
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
  coordinates?: {
    latitude: number
    longitude: number
  }
}

/** Event organizer */
export interface Organizer {
  id: string
  name: string
  email: string
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

/** Paginated API response wrapper */
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

/** Standard API response */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

/** API error response */
export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
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
  tags?: string[]
  page?: number
  limit?: number
  sortBy?: 'startDate' | 'createdAt' | 'title' | 'attendeeCount'
  sortOrder?: 'asc' | 'desc'
}

/** Create event payload */
export interface CreateEventPayload {
  title: string
  description: string
  shortDescription?: string
  category: EventCategory
  startDate: string
  endDate: string
  timezone: string
  location: EventLocation
  coverImage?: string
  tags?: string[]
  capacity?: number
  isOnline: boolean
  meetingUrl?: string
  isFree: boolean
  ticketPrice?: number
  currency?: string
}

/** Update event payload */
export type UpdateEventPayload = Partial<CreateEventPayload>
