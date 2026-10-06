import { useState } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, ImagePlus, MapPin, Tag, Link2, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/common/Input'
import { createEventSchema, EVENT_CATEGORIES, type CreateEventFormData } from '@/utils/validators'
import { resolveAssetUrl } from '@/api/client'

interface EventFormProps {
  onSubmit: (data: CreateEventFormData, image?: File) => void
  isLoading?: boolean
  initialData?: Partial<CreateEventFormData>
  initialImage?: string | null
  submitLabel?: string
}

const statuses: { value: CreateEventFormData['status']; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'past', label: 'Past' },
  { value: 'cancelled', label: 'Cancelled' },
]

const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AED']

const fieldClass =
  'w-full h-11 px-4 rounded-xl border border-neutral-700 bg-[#1a1a1e] text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all'

export function EventForm({
  onSubmit,
  isLoading = false,
  initialData,
  initialImage,
  submitLabel = 'Create Event',
}: EventFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Music',
      startsAt: '',
      endsAt: '',
      venueName: '',
      venueAddress: '',
      city: 'Kolkata',
      area: '',
      isFree: true,
      currency: 'INR',
      status: 'active',
      isActive: true,
      sourceUrl: '',
      ticketUrl: '',
      ...initialData,
    },
  })

  const isFree = useWatch({ control, name: 'isFree' })

  const submit = handleSubmit((data) => {
    onSubmit(data, imageFile ?? undefined)
  })

  const imagePreview = resolveAssetUrl(initialImage)

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      {/* Title */}
      <Input
        label="Event Title"
        placeholder="e.g. Durga Puja Night Carnival"
        error={errors.title?.message}
        {...register('title')}
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
        <select className={fieldClass} {...register('category')}>
          {EVENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-error">{errors.category.message}</p>
        )}
      </div>

      {/* Date & Time Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Start Date & Time"
          type="datetime-local"
          leftIcon={<Calendar size={18} />}
          error={errors.startsAt?.message}
          {...register('startsAt')}
        />
        <Input
          label="End Date & Time"
          type="datetime-local"
          error={errors.endsAt?.message}
          {...register('endsAt')}
        />
      </div>

      {/* Location */}
      <div className="space-y-4 p-4 rounded-xl border border-neutral-700 bg-[#1a1a1e]">
        <h4 className="text-sm font-medium text-white flex items-center gap-2">
          <MapPin size={16} /> Location Details
        </h4>
        <Input
          label="Venue"
          placeholder="Netaji Indoor Stadium"
          error={errors.venueName?.message}
          {...register('venueName')}
        />
        <Input
          label="Address"
          placeholder="4/2, Dacres Lane"
          error={errors.venueAddress?.message}
          {...register('venueAddress')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="City" placeholder="Kolkata" error={errors.city?.message} {...register('city')} />
          <Input label="Area" placeholder="B.B.D. Bagh" error={errors.area?.message} {...register('area')} />
        </div>
      </div>

      {/* Pricing */}
      <Controller
        name="isFree"
        control={control}
        render={({ field }) => (
          <label className="flex items-center gap-3 p-4 rounded-xl border border-neutral-700 bg-[#1a1a1e] cursor-pointer">
            <Tag size={20} className="text-neutral-400" />
            <div className="flex-1">
              <span className="text-sm font-medium text-white">Free Event</span>
              <p className="text-xs text-neutral-400">No ticket required</p>
            </div>
            <input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              className="w-5 h-5 rounded border-neutral-700 text-primary-600 focus:ring-primary-500"
            />
          </label>
        )}
      />

      {!isFree && (
        <Input
          label="Ticket Price"
          type="number"
          placeholder="999"
          min={0}
          leftIcon={<Tag size={18} />}
          error={errors.priceMin?.message}
          {...register('priceMin', { valueAsNumber: true })}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">Currency</label>
          <select className={fieldClass} {...register('currency')}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          {errors.currency && (
            <p className="mt-1 text-sm text-error">{errors.currency.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">Status</label>
          <select className={fieldClass} {...register('status')}>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          {errors.status && <p className="mt-1 text-sm text-error">{errors.status.message}</p>}
        </div>
      </div>

      {/* Ticket / source links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Ticket URL (optional)"
          placeholder="https://tickets.example.com/..."
          leftIcon={<Link2 size={18} />}
          error={errors.ticketUrl?.message}
          {...register('ticketUrl')}
        />
        <Input
          label="Source URL (optional)"
          placeholder="https://example.com/event"
          leftIcon={<Link2 size={18} />}
          error={errors.sourceUrl?.message}
          {...register('sourceUrl')}
        />
      </div>

      {/* Cover image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-300 mb-1.5">
          Cover Image {initialImage || imageFile ? '' : '(optional)'}
        </label>
        <div className="flex items-center gap-4">
          {imageFile ? (
            <span className="px-3 py-2 rounded-lg border border-neutral-700 bg-[#1a1a1e] text-xs text-neutral-300">
              {imageFile.name}
            </span>
          ) : (
            imagePreview && (
              <img
                src={imagePreview}
                alt="Event cover preview"
                className="w-24 h-16 rounded-lg object-cover border border-neutral-700"
              />
            )
          )}
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-neutral-700 bg-[#1a1a1e] text-sm text-neutral-300 hover:border-neutral-500 cursor-pointer transition-colors">
            <ImagePlus size={16} />
            {imageFile ? imageFile.name : 'Choose image'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) setImageFile(file)
              }}
            />
          </label>
        </div>
      </div>

      {/* Active toggle */}
      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <label className="flex items-center gap-3 p-4 rounded-xl border border-neutral-700 bg-[#1a1a1e] cursor-pointer">
            <Radio size={20} className="text-neutral-400" />
            <div className="flex-1">
              <span className="text-sm font-medium text-white">Visible on the site</span>
              <p className="text-xs text-neutral-400">Inactive events are hidden from listings</p>
            </div>
            <input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              className="w-5 h-5 rounded border-neutral-700 text-primary-600 focus:ring-primary-500"
            />
          </label>
        )}
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
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
