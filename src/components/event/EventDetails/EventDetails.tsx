import { Calendar, MapPin, Users, Globe, Clock, ArrowLeft, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BookmarkButton, FavoriteButton } from '@/components/engagement'
import {
  formatDateRange,
  getEventStatusLabel,
  getEventStatusColor,
  getInitials,
  formatCurrency,
  getRelativeTime,
} from '@/utils'
import type { Event } from '@/types'

interface EventDetailsProps {
  event: Event
  onRegister?: () => void
  isRegistering?: boolean
}

export function EventDetails({ event, onRegister, isRegistering = false }: EventDetailsProps) {
  const navigate = useNavigate()

  return (
    <div className="max-w-[768px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to events
      </button>

      {/* Hero image */}
      <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-400 to-secondary-500">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-bold text-white/20">{getInitials(event.title)}</span>
          </div>
        )}
        <span
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${getEventStatusColor(event.status)}`}
        >
          {getEventStatusLabel(event.status)}
        </span>

        {/* Favorite and Bookmark buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <FavoriteButton
            entityType="event"
            entityId={event.id}
            entityTitle={event.title}
            size={18}
            className="w-10 h-10"
          />
          <BookmarkButton
            entityType="event"
            entityId={event.id}
            entityTitle={event.title}
            size={18}
            className="w-10 h-10"
          />
        </div>
      </div>

      {/* Title & meta */}
      <div>
        {event.category && (
          <span className="inline-block px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 text-xs font-medium mb-2 capitalize">
            {event.category}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
          {event.title}
        </h1>
        {event.shortDescription && (
          <p className="mt-2 text-neutral-400 text-lg">{event.shortDescription}</p>
        )}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="p-4 sm:p-5 bg-[#141414] border border-neutral-800/50 ring-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
              <Calendar size={20} className="text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Date & Time</p>
              <p className="text-sm text-neutral-400">
                {formatDateRange(event.startDate, event.endDate)}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                <Clock size={12} /> Starts {getRelativeTime(event.startDate)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-[#141414] border border-neutral-800/50 ring-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-500/10 flex items-center justify-center shrink-0">
              {event.isOnline ? (
                <Globe size={20} className="text-secondary-400" />
              ) : (
                <MapPin size={20} className="text-secondary-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {event.isOnline ? 'Online Event' : 'Location'}
              </p>
              <p className="text-sm text-neutral-400">
                {event.isOnline
                  ? 'Join from anywhere'
                  : event.location.venue || event.location.city || 'TBA'}
              </p>
              {!event.isOnline && event.location.address && (
                <p className="text-xs text-neutral-500 mt-0.5">{event.location.address}</p>
              )}
            </div>
          </div>
        </Card>

        {event.attendeeCount !== undefined && (
          <Card className="p-4 sm:p-5 bg-[#141414] border border-neutral-800/50 ring-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                <Users size={20} className="text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Attendees</p>
                <p className="text-sm text-neutral-400">
                  {event.attendeeCount} registered
                  {event.capacity && ` / ${event.capacity} spots`}
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-4 sm:p-5 bg-[#141414] border border-neutral-800/50 ring-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
              <span className="text-lg">{event.isFree ? '🎉' : '💰'}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Price</p>
              <p className="text-sm text-neutral-400">
                {event.isFree ? 'Free' : formatCurrency(event.ticketPrice || 0, event.currency)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Organizer */}
      {event.organizer && (
        <Card className="p-4 sm:p-5 bg-[#141414] border border-neutral-800/50 ring-0">
          <h3 className="text-sm font-medium text-neutral-400 mb-3">Organized by</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
              <span className="text-lg font-semibold text-primary-400">
                {getInitials(event.organizer.name)}
              </span>
            </div>
            <div>
              <p className="font-medium text-white">{event.organizer.name}</p>
              {event.organizer.email && (
                <p className="text-sm text-neutral-400">{event.organizer.email}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Description */}
      {event.description && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">About this event</h2>
          <div className="prose prose-surface max-w-none text-neutral-400 leading-relaxed whitespace-pre-line">
            {event.description}
          </div>
        </div>
      )}

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Register CTA (sticky bottom on mobile) */}
      <div className="sticky bottom-0 bg-[#0a0a0a]/80 backdrop-blur-sm p-4 -mx-4 sm:mx-0 sm:rounded-2xl sm:border sm:border-neutral-800 safe-area-bottom">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white">
              {event.isFree ? 'Free' : formatCurrency(event.ticketPrice || 0, event.currency)}
            </p>
            <p className="text-xs text-neutral-400">
              {event.capacity && event.attendeeCount !== undefined
                ? `${Math.max(event.capacity - event.attendeeCount, 0)} spots left`
                : 'First come, first served'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton
              entityType="event"
              entityId={event.id}
              entityTitle={event.title}
              variant="button"
              className="hidden sm:inline-flex"
            />
            <BookmarkButton
              entityType="event"
              entityId={event.id}
              entityTitle={event.title}
              variant="button"
              className="hidden sm:inline-flex"
            />
            <Button
              onClick={onRegister}
              disabled={isRegistering}
              size="lg"
              className="bg-[#FF2E4D] hover:bg-[#e02441] text-white"
            >
              {isRegistering ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <UserPlus size={18} />
              )}
              {event.ticketUrl || event.sourceUrl ? 'Get Tickets' : 'Register Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
