import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { EventDetails } from '@/components/event/EventDetails'
import { useEvent } from '@/hooks/useEvents'
import { useAppContext } from '@/context'
import { Skeleton } from '@/components/common/Skeleton'

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToast } = useAppContext()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const { data: event, isLoading, error } = useEvent(id || '')

  const handleRegister = () => {
    const ticketUrl = event?.ticketUrl || event?.sourceUrl
    if (ticketUrl) {
      window.open(ticketUrl, '_blank', 'noopener,noreferrer')
      return
    }
    addToast({
      message: 'Online registration for this event is not available yet.',
      type: 'info',
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-[768px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <Skeleton width={100} height={16} />
        <Skeleton variant="rectangular" className="w-full h-56 sm:h-72 rounded-2xl" />
        <Skeleton width="60%" height={32} />
        <Skeleton lines={3} />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
          <span className="text-2xl">😔</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Event not found</h2>
        <p className="text-neutral-400 mb-6">
          The event you&apos;re looking for doesn&apos;t exist, has ended, or has been removed.
        </p>
        <button
          onClick={() => navigate('/events')}
          className="text-primary-600 font-medium hover:underline"
        >
          Browse all events
        </button>
      </div>
    )
  }

  return <EventDetails event={event} onRegister={handleRegister} />
}
