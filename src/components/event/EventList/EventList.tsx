import { EventCard } from '@/components/event/EventCard'
import { EventCardSkeleton } from '@/components/common/Skeleton'
import type { Event } from '@/types'

interface EventListProps {
  events: Event[]
  isLoading?: boolean
  emptyMessage?: string
}

export function EventList({ events, isLoading = false, emptyMessage }: EventListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
          <span className="text-2xl">📅</span>
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No events found</h3>
        <p className="text-sm text-neutral-400 max-w-[384px]">
          {emptyMessage || 'There are no events to display right now. Try adjusting your filters or check back later.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
