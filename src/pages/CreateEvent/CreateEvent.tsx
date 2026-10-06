import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EventForm } from '@/components/event/EventForm'
import { useCreateEvent } from '@/hooks/useEvents'
import { useAppContext } from '@/context'
import { toEventPayload } from '@/api/mappers'
import type { CreateEventFormData } from '@/utils/validators'

export function CreateEvent() {
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const createEventMutation = useCreateEvent()

  const handleSubmit = (data: CreateEventFormData, image?: File) => {
    createEventMutation.mutate(
      { payload: toEventPayload(data), image },
      {
        onSuccess: (event) => {
          addToast({ message: 'Event created successfully!', type: 'success' })
          navigate(`/events/${event.id}`)
        },
        onError: (error) => {
          addToast({ message: error.message || 'Failed to create event.', type: 'error' })
        },
      },
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[672px] mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Create Event</h1>
        <p className="text-neutral-400 mt-1">Fill in the details to create your event</p>
      </div>

      <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-5 sm:p-8 shadow-sm">
        <EventForm
          onSubmit={handleSubmit}
          isLoading={createEventMutation.isPending}
        />
      </div>
    </motion.div>
  )
}
