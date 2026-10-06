import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  formatDateRange,
  getEventStatusLabel,
  getEventStatusColor,
  getInitials,
  formatCurrency,
} from '@/utils'
import type { Event } from '@/types'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link to={`/events/${event.id}`} className="block group">
      <Card className="h-full bg-[#1c1c1e] border-none ring-0 cursor-pointer transition-transform duration-300 hover:scale-[1.02] p-0 rounded-2xl overflow-hidden">
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
        <div className="p-4 flex flex-col gap-2">
          {/* Category tag */}
          {event.category && (
            <div>
              <span className="inline-block px-2 py-0.5 rounded bg-white text-black text-[10px] font-semibold mb-1">
                {event.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">
            {event.title}
          </h3>

          {/* Date & Location */}
          <div className="space-y-1 mt-1 text-[11px] text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="shrink-0" />
              <span className="truncate">{formatDateRange(event.startDate, event.endDate)}</span>
            </div>

            {!event.isOnline && (event.location.venue || event.location.city) && (
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="shrink-0" />
                <span className="truncate">
                  {event.location.venue || event.location.city}
                </span>
              </div>
            )}

            {event.isOnline && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">🌐</span>
                <span>Online Event</span>
              </div>
            )}
          </div>

          {/* Footer (Price) */}
          <div className="mt-3">
            <span className="text-xs font-bold text-white">
              {event.isFree ? 'Free' : formatCurrency(event.ticketPrice ?? 0, event.currency)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
