import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, ChevronLeft, MapPin, Search } from 'lucide-react'
import { useEvents } from '@/hooks'
import { useCategories } from '@/hooks/useCategories'
import { formatCurrency, formatDate, getInitials } from '@/utils'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 350)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const query = debouncedTerm.length >= 2 ? debouncedTerm : ''
  const { data, isLoading } = useEvents({ search: query, limit: 6 }, query.length > 0 && isOpen)
  const { data: recommendedData } = useEvents({ limit: 4, sortBy: 'startsAt', sortOrder: 'ASC' }, query.length === 0 && isOpen)
  const { data: apiCategories } = useCategories(4)
  const results = data?.data ?? []
  const recommendedEvents = recommendedData?.data ?? []

  const goToEvent = (eventId: string) => {
    navigate(`/events/${eventId}`)
    onClose()
  }

  const browseAll = () => {
    navigate('/events')
    onClose()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto sm:overflow-hidden flex flex-col sm:items-center sm:justify-start sm:pt-[5vh] sm:bg-black/80 sm:backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          {/* Desktop Wrapper to constrain width on large screens */}
          <div className="w-full sm:max-w-3xl lg:max-w-5xl sm:bg-[#0f0f11] sm:h-[90vh] sm:rounded-[2rem] sm:border sm:border-neutral-800 sm:shadow-2xl flex flex-col overflow-hidden relative pb-10 sm:pb-0">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-12 pb-4 sm:pt-6 sm:px-8">
              <button 
                onClick={onClose}
                className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors sm:hidden"
                aria-label="Go back"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <h2 className="text-[13px] sm:text-base font-medium text-neutral-200 sm:font-semibold sm:text-white">
                Search for events, venues or places
              </h2>
              <button 
                onClick={onClose}
                className="hidden sm:block p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors text-neutral-400 hover:text-white text-xs font-medium"
              >
                Esc / Close
              </button>
              <div className="w-8 sm:hidden"></div> {/* Spacer for mobile alignment */}
            </div>

            {/* Search Input Container */}
            <div className="px-4 sm:px-8 pb-6 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search here..."
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1c1c1e] sm:bg-[#141414] text-white placeholder:text-neutral-500 text-[15px] sm:text-base rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-14 pr-4 outline-none border border-transparent sm:border-white/5 focus:border-neutral-700 transition-colors shadow-inner"
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto hide-scrollbar sm:p-8">

              {/* Live search results */}
              {query && (
                <div className="px-4 sm:px-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] sm:text-base font-semibold text-white">
                      Results for &ldquo;{query}&rdquo;
                    </h3>
                    <span className="text-[11px] text-neutral-500">
                      {isLoading ? 'Searching…' : `${data?.meta.total ?? 0} found`}
                    </span>
                  </div>

                  {isLoading ? (
                    <div className="flex flex-col gap-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-[88px] rounded-xl bg-[#1c1c1e] animate-pulse"
                        />
                      ))}
                    </div>
                  ) : results.length === 0 ? (
                    <div className="rounded-xl border border-white/5 bg-[#141414] p-6 text-center">
                      <p className="text-sm font-medium text-neutral-200">
                        No events match &ldquo;{query}&rdquo;
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Try a different keyword, or browse everything happening in the city.
                      </p>
                      <button
                        onClick={browseAll}
                        className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#FF2E4D] hover:underline"
                      >
                        Browse all events
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {results.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => goToEvent(event.id)}
                          className="flex gap-3 sm:gap-4 rounded-xl border border-white/5 bg-[#1c1c1e] p-3 text-left transition-colors hover:bg-[#242426] sm:bg-[#141414] sm:p-4 sm:hover:bg-[#1a1a1c]"
                        >
                          <div className="h-[70px] w-[70px] flex-shrink-0 overflow-hidden rounded-lg bg-neutral-900 sm:h-[80px] sm:w-[80px]">
                            {event.coverImage ? (
                              <img
                                src={event.coverImage}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-lg">
                                🎟️
                              </div>
                            )}
                          </div>
                          <div className="flex min-w-0 flex-col justify-center">
                            <h4 className="mb-1 truncate text-[13px] font-semibold text-white sm:text-[14px]">
                              {event.title}
                            </h4>
                            <p className="mb-1 flex items-center gap-1.5 text-[10px] text-neutral-400 sm:text-[11px]">
                              <CalendarDays size={11} className="shrink-0" />
                              {formatDate(event.startDate, 'EEE, MMM d')}
                              <span className="hidden text-neutral-600 sm:inline">•</span>
                              <MapPin size={11} className="hidden shrink-0 sm:inline" />
                              <span className="truncate">
                                {event.location.venue || event.location.city}
                              </span>
                            </p>
                            <p className="text-[11px] font-bold text-[#FF2E4D] sm:text-[12px]">
                              {event.isFree
                                ? 'Free'
                                : formatCurrency(event.ticketPrice ?? 0, event.currency)}
                            </p>
                          </div>
                        </button>
                      ))}

                      {data && data.meta.total > results.length && (
                        <button
                          onClick={browseAll}
                          className="mt-1 self-start text-[11px] font-bold uppercase tracking-wider text-[#FF2E4D] hover:underline"
                        >
                          View all {data.meta.total} results
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Browse discover content (hidden while a search is active) */}
              {!query && (
                <>

              {/* Popular Searches (Categories) */}
              <div className="px-4 sm:px-0 mb-8">
                <h3 className="text-[15px] sm:text-base font-semibold text-white mb-4">Popular Categories</h3>
                <div className="flex sm:flex-wrap gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
                  {apiCategories?.slice(0, 4).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigate(`/events?category=${encodeURIComponent(cat.name)}`)
                        onClose()
                      }}
                      className="flex-shrink-0 flex flex-col items-center justify-between bg-[#1c1c1e] sm:bg-[#141414] border border-white/5 rounded-2xl p-3 w-[85px] h-[100px] sm:w-[100px] sm:h-[110px] hover:bg-[#242426] sm:hover:bg-[#1a1a1c] transition-all sm:hover:scale-105"
                    >
                      <span className="text-[10px] sm:text-[11px] font-bold text-center text-white leading-tight whitespace-pre-wrap">{cat.name.toUpperCase().replace(' & ', '\n&\n')}</span>
                      <div className="mt-1 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                        {cat.icon ? (
                          <img src={cat.icon} alt="" className="w-full h-full object-contain drop-shadow-md" />
                        ) : (
                          <span className="text-xl sm:text-2xl font-bold text-neutral-500">{cat.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Events you may like */}
              {recommendedEvents.length > 0 && (
                <div className="px-4 sm:px-0 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] sm:text-base font-semibold text-white">Events you may like</h3>
                    <button onClick={browseAll} className="text-[11px] sm:text-xs text-neutral-400 hover:text-white">View all</button>
                  </div>
                  <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
                    {recommendedEvents.slice(0, 3).map((event, idx) => (
                      <div
                        key={event.id}
                        onClick={() => goToEvent(event.id)}
                        className={`relative flex-shrink-0 w-[240px] sm:w-full h-[130px] sm:h-[160px] rounded-xl overflow-hidden group cursor-pointer border border-white/10 ${idx === 2 ? 'sm:hidden lg:block' : ''}`}
                      >
                        {event.coverImage ? (
                          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-900">
                            <span className="text-2xl font-bold text-white/30">{getInitials(event.title)}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 pr-3">
                          <p className="text-[13px] sm:text-[15px] font-semibold text-white leading-tight line-clamp-1">{event.title}</p>
                          <p className="text-[10px] sm:text-xs text-neutral-300 truncate mt-1">
                            {formatDate(event.startDate)} • {event.location.venue || event.location.city}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                </>
              )}

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
