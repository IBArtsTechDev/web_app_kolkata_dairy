import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { formatDateRange, getEventStatusLabel, getEventStatusColor, getInitials } from '@/utils'
import type { Event } from '@/types'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link to={`/events/${event.id}`} className="block group">
      <Card className="h-full bg-[#141414] border border-neutral-800/50 hover:border-neutral-700 ring-0 cursor-pointer transition-all hover:shadow-xl p-0 rounded-2xl overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-44 bg-gradient-to-br from-primary-400 to-secondary-500 overflow-hidden">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white/30">
                {getInitials(event.title)}
              </span>
            </div>
          )}

          {/* Status badge */}
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${getEventStatusColor(event.status)}`}
          >
            {getEventStatusLabel(event.status)}
          </span>

          {/* Free badge */}
          {event.isFree && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-primary-700">
              Free
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category tag */}
          <span className="inline-block px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-xs font-medium mb-2 capitalize">
            {event.category}
          </span>

          {/* Title */}
          <h3 className="font-semibold text-white leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {event.title}
          </h3>

          {/* Date & Location */}
          <div className="space-y-1.5 text-sm text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="shrink-0" />
              <span className="truncate">{formatDateRange(event.startDate, event.endDate)}</span>
            </div>

            {!event.isOnline && event.location.city && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="shrink-0" />
                <span className="truncate">
                  {event.location.venue || event.location.city}
                </span>
              </div>
            )}

            {event.isOnline && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🌐</span>
                <span>Online Event</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-800">
            {/* Organizer */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xs font-medium text-primary-700">
                  {getInitials(event.organizer.name)}
                </span>
              </div>
              <span className="text-sm text-neutral-400 truncate max-w-[120px]">
                {event.organizer.name}
              </span>
            </div>

            {/* Attendee count */}
            <div className="flex items-center gap-1 text-sm text-neutral-400">
              <Users size={14} />
              <span>{event.attendeeCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
