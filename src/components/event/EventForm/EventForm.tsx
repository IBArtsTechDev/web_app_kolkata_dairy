import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, MapPin, Tag, DollarSign, Globe, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/common/Input'
import { createEventSchema, type CreateEventFormData } from '@/utils/validators'
import type { EventCategory } from '@/types'

interface EventFormProps {
  onSubmit: (data: CreateEventFormData) => void
  isLoading?: boolean
  initialData?: Partial<CreateEventFormData>
}

const categories: EventCategory[] = [
  'conference', 'workshop', 'seminar', 'webinar', 'meetup',
  'social', 'concert', 'sports', 'charity', 'other',
]

const timezones = [
  'Asia/Kolkata',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
]

export function EventForm({ onSubmit, isLoading = false, initialData }: EventFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      isOnline: false,
      isFree: true,
      category: 'conference',
      timezone: 'Asia/Kolkata',
      location: { type: 'physical' },
      ...initialData,
    },
  })

  const isOnline = useWatch({ control, name: 'isOnline' })
  const isFree = useWatch({ control, name: 'isFree' })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Title */}
      <Input
        label="Event Title"
        placeholder="e.g. Annual Tech Summit 2026"
        error={errors.title?.message}
        {...register('title')}
      />

      {/* Short Description */}
      <Input
        label="Short Description"
        placeholder="A brief tagline for your event"
        error={errors.shortDescription?.message}
        {...register('shortDescription')}
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1.5">
          Description
        </label>
        <textarea
          rows={4}
          placeholder="Tell attendees what to expect..."
          className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-[#1a1a1e] text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error">{errors.description.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1.5">Category</label>
        <select
          className="w-full h-11 px-4 rounded-xl border border-neutral-700 bg-[#1a1a1e] text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          {...register('category')}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Date & Time Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Start Date & Time"
          type="datetime-local"
          leftIcon={<Calendar size={18} />}
          error={errors.startDate?.message}
          {...register('startDate')}
        />
        <Input
          label="End Date & Time"
          type="datetime-local"
          leftIcon={<Calendar size={18} />}
          error={errors.endDate?.message}
          {...register('endDate')}
        />
      </div>

      {/* Timezone */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1.5">Timezone</label>
        <select
          className="w-full h-11 px-4 rounded-xl border border-neutral-700 bg-[#1a1a1e] text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          {...register('timezone')}
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Online toggle */}
      <Controller
        name="isOnline"
        control={control}
        render={({ field }) => (
          <label className="flex items-center gap-3 p-4 rounded-xl border border-neutral-700 bg-[#1a1a1e] cursor-pointer">
            <Globe size={20} className="text-neutral-400" />
            <div className="flex-1">
              <span className="text-sm font-medium text-white">Online Event</span>
              <p className="text-xs text-neutral-400">This event will be held online</p>
            </div>
            <input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              className="w-5 h-5 rounded border-neutral-700 text-primary-600 focus:ring-primary-500"
            />
          </label>
        )}
      />

      {/* Meeting URL (conditional) */}
      {isOnline && (
        <Input
          label="Meeting URL"
          placeholder="https://meet.google.com/..."
          leftIcon={<Globe size={18} />}
          error={errors.meetingUrl?.message}
          {...register('meetingUrl')}
        />
      )}

      {/* Physical Location (conditional) */}
      {!isOnline && (
        <div className="space-y-4 p-4 rounded-xl border border-neutral-700 bg-[#1a1a1e]">
          <h4 className="text-sm font-medium text-white flex items-center gap-2">
            <MapPin size={16} /> Location Details
          </h4>
          <Input
            label="Venue"
            placeholder="Convention Center"
            {...register('location.venue')}
          />
          <Input
            label="Address"
            placeholder="123 Main Street"
            {...register('location.address')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" placeholder="Kolkata" {...register('location.city')} />
            <Input label="State" placeholder="West Bengal" {...register('location.state')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Country" placeholder="India" {...register('location.country')} />
            <Input label="Postal Code" placeholder="700001" {...register('location.postalCode')} />
          </div>
        </div>
      )}

      {/* Pricing */}
      <Controller
        name="isFree"
        control={control}
        render={({ field }) => (
          <label className="flex items-center gap-3 p-4 rounded-xl border border-neutral-700 bg-[#1a1a1e] cursor-pointer">
            <DollarSign size={20} className="text-neutral-400" />
            <div className="flex-1">
              <span className="text-sm font-medium text-white">Free Event</span>
              <p className="text-xs text-neutral-400">No ticket required</p>
            </div>
            <input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              className="w-5 h-5 rounded border-neutral-700 text-primary-600 focus:ring-primary-500"
            />
          </label>
        )}
      />

      {!isFree && (
        <Input
          label="Ticket Price (INR)"
          type="number"
          placeholder="999"
          min={0}
          leftIcon={<Tag size={18} />}
          error={errors.ticketPrice?.message}
          {...register('ticketPrice', { valueAsNumber: true })}
        />
      )}

      {/* Capacity */}
      <Input
        label="Capacity (optional)"
        type="number"
        placeholder="100"
        min={1}
        leftIcon={<Users size={18} />}
        error={errors.capacity?.message}
        {...register('capacity', { valueAsNumber: true })}
      />

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full bg-[#FF2E4D] hover:bg-[#e02441] text-white"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : null}
          Create Event
        </Button>
      </div>
    </form>
  )
}
