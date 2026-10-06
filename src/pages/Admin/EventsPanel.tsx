import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CalendarDays, Edit3, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/common/Modal'
import { Skeleton } from '@/components/common/Skeleton'
import { EventForm } from '@/components/event/EventForm'
import { ConfirmDialog } from './ConfirmDialog'
import { useAdminEvents, useCreateEvent, useDeleteEvent, useUpdateEvent } from '@/hooks'
import { useAppContext } from '@/context'
import { toEventFormValues, toEventPayload } from '@/api/mappers'
import { formatDate, getEventStatusColor, getEventStatusLabel } from '@/utils'
import type { Event } from '@/types'
import type { CreateEventFormData } from '@/utils/validators'

const PAGE_SIZE = 10

export function EventsPanel() {
  const { addToast } = useAppContext()
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [deleting, setDeleting] = useState<Event | null>(null)

  const { data, isLoading, isError, error, refetch } = useAdminEvents({
    page,
    limit: PAGE_SIZE,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  })
  const createMutation = useCreateEvent()
  const updateMutation = useUpdateEvent()
  const deleteMutation = useDeleteEvent()

  const events = data?.data || []
  const meta = data?.meta
  const modalOpen = creating || !!editing
  const saving = createMutation.isPending || updateMutation.isPending

  const closeForm = () => {
    if (saving) return
    setCreating(false)
    setEditing(null)
  }

  const handleCreate = (values: CreateEventFormData, image?: File) => {
    createMutation.mutate(
      { payload: toEventPayload(values), image },
      {
        onSuccess: () => {
          addToast({ message: 'Event created', type: 'success' })
          setCreating(false)
          setPage(1)
        },
        onError: (err) => addToast({ message: err.message || 'Failed to create event', type: 'error' }),
      },
    )
  }

  const handleUpdate = (values: CreateEventFormData, image?: File) => {
    if (!editing) return
    updateMutation.mutate(
      { id: editing.id, payload: toEventPayload(values), image },
      {
        onSuccess: () => {
          addToast({ message: 'Event updated', type: 'success' })
          setEditing(null)
        },
        onError: (err) => addToast({ message: err.message || 'Failed to update event', type: 'error' }),
      },
    )
  }

  const handleDelete = () => {
    if (!deleting) return
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        addToast({ message: 'Event deleted', type: 'success' })
        setDeleting(null)
      },
      onError: (err) => addToast({ message: err.message || 'Failed to delete event', type: 'error' }),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-400">
          {meta ? `${meta.total} events` : 'All events'}
        </p>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus size={16} />
          New Event
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} variant="rectangular" className="w-full h-20" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-error/30 bg-error/10">
          <AlertTriangle size={18} className="text-error" />
          <p className="flex-1 text-sm text-neutral-200">
            {error?.message || 'Could not load events.'}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && events.length === 0 && (
        <div className="p-8 text-center rounded-xl border border-dashed border-neutral-800">
          <p className="text-sm text-neutral-400">No events yet.</p>
          <p className="text-xs text-neutral-500 mt-1">Create your first event to get started.</p>
        </div>
      )}

      {events.length > 0 && (
        <ul className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 bg-[#141414] overflow-hidden">
          {events.map((event) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-white truncate">{event.title}</p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getEventStatusColor(
                      event.status,
                    )}`}
                  >
                    {getEventStatusLabel(event.status)}
                  </span>
                  {!event.isActive && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-800 text-neutral-400">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  {formatDate(event.startDate, 'MMM d, yyyy')}
                  {event.category ? ` · ${event.category}` : ''}
                  {event.location.city ? ` · ${event.location.city}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Edit event"
                  onClick={() => setEditing(event)}
                >
                  <Edit3 size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete event"
                  onClick={() => setDeleting(event)}
                >
                  <Trash2 size={16} className="text-error" />
                </Button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasPrevPage}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <span className="text-xs text-neutral-500">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasNextPage}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeForm}
        title={editing ? 'Edit Event' : 'Create Event'}
        size="lg"
      >
        <EventForm
          onSubmit={editing ? handleUpdate : handleCreate}
          isLoading={saving}
          submitLabel={editing ? 'Save Changes' : 'Create Event'}
          initialData={editing ? toEventFormValues(editing) : undefined}
          initialImage={editing?.coverImage ?? undefined}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleting}
        title="Delete event"
        description={`"${deleting?.title}" will be removed from listings.`}
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
