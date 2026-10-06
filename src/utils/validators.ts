import { z } from 'zod'
import type { EventCategory } from '@/types'

/** Categories accepted by the events API */
export const EVENT_CATEGORIES = [
  'Music',
  'Theatre',
  'Exhibition',
  'Nightlife',
  'Sports',
  'Food',
  'Workshop',
  'Festival',
  'Other',
] as const

/** Type guard for API category values */
export function isEventCategory(value: string): value is EventCategory {
  return (EVENT_CATEGORIES as readonly string[]).includes(value)
}

const optionalUrl = z
  .string()
  .trim()
  .url('Must be a valid URL')
  .optional()
  .or(z.literal(''))

/** Create event form validation schema (mirrors the API event contract) */
export const createEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Title must be at least 2 characters')
      .max(200, 'Title must be at most 200 characters'),
    description: z
      .string()
      .max(5000, 'Description must be at most 5000 characters')
      .optional()
      .or(z.literal('')),
    category: z.enum(EVENT_CATEGORIES),
    startsAt: z.string().min(1, 'Start date is required'),
    endsAt: z.string().optional().or(z.literal('')),
    venueName: z
      .string()
      .trim()
      .min(2, 'Venue name is required')
      .max(200, 'Venue name must be at most 200 characters'),
    venueAddress: z.string().optional().or(z.literal('')),
    city: z
      .string()
      .trim()
      .min(2, 'City is required')
      .max(100, 'City must be at most 100 characters'),
    area: z.string().optional().or(z.literal('')),
    isFree: z.boolean(),
    priceMin: z.number().min(0, 'Price must be positive').optional(),
    currency: z
      .string()
      .trim()
      .length(3, 'Currency must be a 3-letter code'),
    status: z.enum(['draft', 'active', 'hidden', 'past', 'cancelled']),
    isActive: z.boolean(),
    sourceUrl: optionalUrl,
    ticketUrl: optionalUrl,
  })
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return new Date(data.endsAt) > new Date(data.startsAt)
      }
      return true
    },
    { message: 'End date must be after start date', path: ['endsAt'] },
  )
  .refine(
    (data) => {
      if (data.isFree) return true
      return data.priceMin !== undefined && !Number.isNaN(data.priceMin)
    },
    { message: 'Ticket price is required for paid events', path: ['priceMin'] },
  )

export type CreateEventFormData = z.infer<typeof createEventSchema>

/** Admin login validation */
export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

/** Search validation */
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
})
