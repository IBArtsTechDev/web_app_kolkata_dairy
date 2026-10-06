import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertTriangle, Search, SlidersHorizontal, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { EventList } from '@/components/event/EventList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/common/Input'
import { useEvents } from '@/hooks/useEvents'
import { useAppStore } from '@/store'
import { EVENT_CATEGORIES, isEventCategory } from '@/utils/validators'
import type { EventCategory } from '@/types'

const categories: { value: EventCategory | ''; label: string }[] = [
  { value: '', label: 'All' },
  ...EVENT_CATEGORIES.map((category) => ({ value: category, label: category })),
]

const DEBOUNCE_DELAY = 400

export function Events() {
  const { eventFilters, setEventFilters } = useAppStore()
  const [searchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(eventFilters.search || '')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data, isLoading, isError, error, refetch } = useEvents(eventFilters)

  // Deep link support: /events?category=Music
  useEffect(() => {
    const category = searchParams.get('category')
    if (category && isEventCategory(category)) {
      setEventFilters({ category, page: 1 })
    }
  }, [searchParams, setEventFilters])

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchInput(value)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setEventFilters({ search: value || undefined, page: 1 })
    }, DEBOUNCE_DELAY)
  }

  const clearSearch = () => {
    setSearchInput('')
    setEventFilters({ search: undefined, page: 1 })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Events</h1>
        <p className="text-neutral-400 mt-1">Browse and discover events</p>
      </motion.div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search events..."
            value={searchInput}
            onChange={handleSearchChange}
            leftIcon={<Search size={18} />}
            rightIcon={
              searchInput ? (
                <button
                  onClick={clearSearch}
                  className="text-neutral-500 hover:text-neutral-300"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              ) : undefined
            }
          />
        </div>
        <Button variant="outline" className="shrink-0 hidden sm:inline-flex">
          <SlidersHorizontal size={18} />
          Filters
        </Button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setEventFilters({ category: cat.value || undefined, page: 1 })}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              (eventFilters.category || '') === cat.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#141414] text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {isError && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border border-error/30 bg-error/10">
          <AlertTriangle size={18} className="text-error shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">We couldn&apos;t load events</p>
            <p className="text-xs text-neutral-400 mt-0.5">
              {error?.message || 'Something went wrong. Please try again.'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Results */}
      <EventList
        events={data?.data || []}
        isLoading={isLoading}
        emptyMessage="No events match your search. Try adjusting your filters."
      />

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={!data.meta.hasPrevPage}
            onClick={() => setEventFilters({ page: data.meta.page - 1 })}
          >
            Previous
          </Button>
          <span className="text-sm text-neutral-400 px-3">
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!data.meta.hasNextPage}
            onClick={() => setEventFilters({ page: data.meta.page + 1 })}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
