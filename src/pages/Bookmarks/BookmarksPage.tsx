import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import {
  Bookmark,
  Calendar,
  MapPin,
  Trash2,
  AlertCircle,
  Tag,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { useBookmarks } from '@/hooks/useEngagement'
import { bookmarksApi } from '@/api/engagement'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/common/Skeleton'
import { useAppContext } from '@/context'
import type { EngagementItem, HydratedEvent, HydratedCategory } from '@/types'

export function BookmarksPage() {
  const [filterType] = useState<'all' | 'event' | 'category'>('all')
  const [page, setPage] = useState(1)
  const limit = 20
  const queryClient = useQueryClient()
  const { addToast } = useAppContext()

  const { data, isLoading, isError, error } = useBookmarks(page, limit)

  const handleRemove = async (item: EngagementItem) => {
    try {
      await bookmarksApi.remove(item.entityType, item.entityId)
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      addToast({
        message: 'Bookmark removed.',
        type: 'info',
      })
    } catch {
      addToast({
        message: 'Failed to remove bookmark.',
        type: 'error',
      })
    }
  }

  const items = data?.items ?? []
  const filteredItems = items.filter((item) =>
    filterType === 'all' ? true : item.entityType === filterType,
  )

  const pagination = data?.pagination

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Bookmark size={18} className="fill-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              My Bookmarks
            </h1>
          </div>
          <p className="text-neutral-400 mt-1 text-xs sm:text-sm">
            Saved events and categories you want to keep handy
          </p>
        </div>

      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant="rectangular" className="h-64 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <h3 className="text-base font-semibold text-white">Failed to Load Bookmarks</h3>
          <p className="text-xs text-neutral-400">{error?.message || 'Please try again later.'}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && filteredItems.length === 0 && (
        <div className="text-center py-20 px-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-500 mx-auto flex items-center justify-center">
            <Bookmark size={28} />
          </div>
          <h3 className="text-lg font-semibold text-white">No Bookmarks Found</h3>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto">
            {filterType === 'all'
              ? 'You have not bookmarked any events or categories yet. Save items by tapping the bookmark button.'
              : `You don't have any bookmarked ${filterType}s right now.`}
          </p>
          <Link
            to="/events"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-[#FF2E4D] hover:bg-[#e02441] text-white mt-2 transition-colors"
          >
            Explore Events <ArrowRight size={16} className="ml-1.5" />
          </Link>
        </div>
      )}

      {/* Bookmarks Grid */}
      {!isLoading && !isError && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={`${item.entityType}-${item.entityId}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {/* 1. Event Entity */}
                {item.entityType === 'event' && item.entity && (
                  <EventBookmarkCard
                    event={item.entity as HydratedEvent}
                    onRemove={() => handleRemove(item)}
                  />
                )}

                {/* 2. Category Entity */}
                {item.entityType === 'category' && item.entity && (
                  <CategoryBookmarkCard
                    category={item.entity as HydratedCategory}
                    onRemove={() => handleRemove(item)}
                  />
                )}

                {/* 3. Deleted / Orphan Target */}
                {item.entity === null && (
                  <OrphanBookmarkCard item={item} onRemove={() => handleRemove(item)} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </Button>
          <span className="text-xs text-neutral-400 px-3">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

function EventBookmarkCard({
  event,
  onRemove,
}: {
  event: HydratedEvent
  onRemove: () => void
}) {
  return (
    <Card className="h-full bg-[#1c1c1e] border border-neutral-800/80 ring-0 p-0 rounded-2xl overflow-hidden flex flex-col group hover:border-neutral-700 transition-all">
      <div className="relative h-40 bg-neutral-900 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
            <span className="text-3xl font-bold text-white/20">{event.title.slice(0, 2)}</span>
          </div>
        )}

        {/* Remove button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            onRemove()
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-red-600/80 text-white backdrop-blur-md flex items-center justify-center transition-colors"
          title="Remove bookmark"
          aria-label={`Remove bookmark for ${event.title}`}
        >
          <Trash2 size={14} />
        </button>

        {/* Category tag */}
        {event.category && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-white text-black">
            {event.category}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <Link
            to={`/events/${event.eventId}`}
            className="text-sm font-semibold text-white leading-tight line-clamp-2 hover:text-[#FF2E4D] transition-colors"
          >
            {event.title}
          </Link>

          <div className="mt-2 space-y-1 text-[11px] text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="shrink-0" />
              <span>{format(parseISO(event.startsAt), 'EEE, d MMM yyyy • HH:mm')}</span>
            </div>
            {(event.venueName || event.city) && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin size={12} className="shrink-0" />
                <span className="truncate">
                  {event.venueName}
                  {event.city ? `, ${event.city}` : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
          <span className="text-xs font-bold text-white">
            {event.isFree ? 'Free' : `₹${event.priceMin.toLocaleString('en-IN')}`}
          </span>

          <Link
            to={`/events/${event.eventId}`}
            className="text-[11px] font-semibold text-[#FF2E4D] hover:underline flex items-center gap-1"
          >
            View Event <ExternalLink size={11} />
          </Link>
        </div>
      </div>
    </Card>
  )
}

function CategoryBookmarkCard({
  category,
  onRemove,
}: {
  category: HydratedCategory
  onRemove: () => void
}) {
  return (
    <Card className="h-full bg-[#1c1c1e] border border-neutral-800/80 ring-0 p-5 rounded-2xl flex flex-col justify-between gap-4 hover:border-neutral-700 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden">
            {category.categoryIcon ? (
              <img
                src={category.categoryIcon}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <Tag size={20} className="text-neutral-400" />
            )}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Category
            </span>
            <h3 className="text-sm font-bold text-white">{category.categoryName}</h3>
          </div>
        </div>

        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
          title="Remove bookmark"
          aria-label={`Remove bookmark for ${category.categoryName}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-neutral-800/60">
        <span className="text-[11px] text-neutral-400">
          Slug: <code className="text-neutral-300">{category.categorySlug}</code>
        </span>
        <Link
          to={`/events?category=${encodeURIComponent(category.categoryName)}`}
          className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-semibold border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          Explore Events
        </Link>
      </div>
    </Card>
  )
}

function OrphanBookmarkCard({
  item,
  onRemove,
}: {
  item: EngagementItem
  onRemove: () => void
}) {
  return (
    <Card className="h-full bg-[#141414] border border-dashed border-neutral-800 p-5 rounded-2xl flex flex-col justify-between gap-3 text-neutral-400">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-semibold text-neutral-400">
            {item.entityType} (Removed)
          </span>
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
            title="Clean up bookmark"
            aria-label="Clean up removed item"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <p className="text-xs text-neutral-300 mt-2 font-medium">
          This item is no longer available on Kolkata Diary.
        </p>
        <p className="text-[11px] text-neutral-400 mt-1">ID: {item.entityId}</p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onRemove}
        className="w-full text-xs text-neutral-300 hover:text-red-300"
      >
        <Trash2 size={12} className="mr-1.5" /> Remove from Bookmarks
      </Button>
    </Card>
  )
}
