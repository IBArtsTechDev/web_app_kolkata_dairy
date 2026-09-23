import { z } from 'zod'

/** Create event form validation schema */
export const createEventSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(120, 'Title must be at most 120 characters'),
    description: z
      .string()
      .min(20, 'Description must be at least 20 characters')
      .max(5000, 'Description must be at most 5000 characters'),
    shortDescription: z
      .string()
      .max(280, 'Short description must be at most 280 characters')
      .optional(),
    category: z.enum([
      'conference',
      'workshop',
      'seminar',
      'webinar',
      'meetup',
      'social',
      'concert',
      'sports',
      'charity',
      'other',
    ]),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    timezone: z.string().min(1, 'Timezone is required'),
    isOnline: z.boolean(),
    meetingUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    isFree: z.boolean(),
    ticketPrice: z.number().min(0, 'Price must be positive').optional(),
    capacity: z.number().min(1, 'Capacity must be at least 1').optional(),
    tags: z.array(z.string()).optional(),
    location: z.object({
      type: z.enum(['physical', 'virtual', 'hybrid']),
      venue: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional(),
    }),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate)
      }
      return true
    },
    { message: 'End date must be after start date', path: ['endDate'] },
  )
  .refine(
    (data) => {
      if (!data.isFree && data.ticketPrice === undefined) return false
      return true
    },
    { message: 'Ticket price is required for paid events', path: ['ticketPrice'] },
  )

export type CreateEventFormData = z.infer<typeof createEventSchema>

/** Search validation */
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
})
