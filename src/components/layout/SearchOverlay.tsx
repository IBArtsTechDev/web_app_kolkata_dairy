import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Search } from 'lucide-react'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState('')

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
              
              {/* Popular Searches */}
              <div className="px-4 sm:px-0 mb-8">
                <h3 className="text-[15px] sm:text-base font-semibold text-white mb-4">Popular searches</h3>
                <div className="flex sm:flex-wrap gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
                  {[
                    { title: 'OPEN\nNOW', icon: '🟢' },
                    { title: 'NEAR\nME', icon: '📍' },
                    { title: 'BOOK\nTABLE', icon: '🗓️' },
                    { title: 'POPULAR\nAREAS', icon: '📌' },
                  ].map((item, idx) => (
                    <button key={idx} className="flex-shrink-0 flex flex-col items-center justify-between bg-[#1c1c1e] sm:bg-[#141414] border border-white/5 rounded-2xl p-3 w-[85px] h-[100px] sm:w-[100px] sm:h-[110px] hover:bg-[#242426] sm:hover:bg-[#1a1a1c] transition-all sm:hover:scale-105">
                      <span className="text-[10px] sm:text-[11px] font-bold text-center text-white leading-tight whitespace-pre-wrap">{item.title}</span>
                      <span className="text-3xl sm:text-4xl mt-1 drop-shadow-md">{item.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Venues you may like */}
              <div className="px-4 sm:px-0 mb-8">
                <h3 className="text-[15px] sm:text-base font-semibold text-white mb-4">Venues you may like</h3>
                <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
                  {[
                    { img: 'https://images.unsplash.com/photo-1540039155732-6761b54cb432?q=80&w=600', title: 'Mamba Band Fest', sub: 'Live music at Park Street' },
                    { img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600', title: 'Neon Beats Party', sub: 'Electronic night at Salt Lake' },
                    { img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600', title: 'Sunset Jazz Evening', sub: 'Acoustic lounge at Ballygunge' },
                  ].map((venue, idx) => (
                    <div key={idx} className={`relative flex-shrink-0 w-[240px] sm:w-full h-[130px] sm:h-[160px] rounded-xl overflow-hidden group cursor-pointer border border-white/10 ${idx === 2 ? 'sm:hidden lg:block' : ''}`}>
                      <img src={venue.img} alt={venue.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                        <p className="text-[13px] sm:text-[15px] font-semibold text-white leading-tight">{venue.title}</p>
                        <p className="text-[10px] sm:text-xs text-neutral-300">{venue.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid layout wrapper for Offers and Deals on Desktop */}
              <div className="sm:grid sm:grid-cols-2 sm:gap-8">
                {/* Offers Near You */}
                <div className="px-4 sm:px-0 mb-8 sm:mb-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] sm:text-base font-semibold text-white">Offers Near You</h3>
                    <button className="text-[11px] sm:text-xs text-neutral-400 hover:text-white">View all</button>
                  </div>
                  <div className="flex sm:grid sm:grid-cols-2 gap-4 overflow-x-auto sm:overflow-visible hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
                    {[
                      { img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400', discount: 'FLAT 10% OFF', title: 'Jai Hind Dhaba', sub: '0.5 km away' },
                      { img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=400', discount: 'FLAT 15% OFF', title: 'Chai Break - Newtown', sub: '1 km away' },
                    ].map((offer, idx) => (
                      <div key={idx} className="flex-shrink-0 w-[140px] sm:w-full cursor-pointer group">
                        <div className="relative w-full h-[140px] sm:h-[160px] rounded-xl overflow-hidden mb-2 border border-white/10">
                          <img src={offer.img} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2">
                            <span className="text-[9px] sm:text-[10px] font-bold text-white bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded uppercase">{offer.discount}</span>
                          </div>
                        </div>
                        <p className="text-[12px] sm:text-[13px] font-semibold text-white leading-tight">{offer.title}</p>
                        <p className="text-[10px] sm:text-[11px] text-neutral-400">{offer.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Deals */}
                <div className="px-4 sm:px-0 mb-8 sm:mb-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] sm:text-base font-semibold text-white">Featured Deals</h3>
                    <button className="text-[11px] sm:text-xs text-neutral-400 hover:text-white">View all</button>
                  </div>
                  <div className="flex sm:grid sm:grid-cols-2 gap-4 overflow-x-auto sm:overflow-visible hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
                    {[
                      { img: 'https://images.unsplash.com/photo-1525640788966-69bdb028aa73?q=80&w=400', discount: 'FLAT 15% OFF', title: 'Artisan Bistro', sub: 'New Town' },
                      { img: 'https://images.unsplash.com/photo-1466978913421-bac2e5e75e4d?q=80&w=400', discount: 'UPTO 40% OFF', title: 'Fine Tune Cafe', sub: 'Salt Lake' },
                    ].map((offer, idx) => (
                      <div key={idx} className="flex-shrink-0 w-[140px] sm:w-full cursor-pointer group">
                        <div className="relative w-full h-[140px] sm:h-[160px] rounded-xl overflow-hidden mb-2 border border-white/10">
                          <img src={offer.img} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2">
                            <span className="text-[9px] sm:text-[10px] font-bold text-white bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded uppercase">{offer.discount}</span>
                          </div>
                        </div>
                        <p className="text-[12px] sm:text-[13px] font-semibold text-white leading-tight">{offer.title}</p>
                        <p className="text-[10px] sm:text-[11px] text-neutral-400">{offer.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended For You */}
              <div className="px-4 sm:px-0 mb-8 sm:mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] sm:text-base font-semibold text-white">Recommended For You</h3>
                  <button className="text-[11px] sm:text-xs text-neutral-400 hover:text-white">View all</button>
                </div>
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { img: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=200', title: 'Sunset DJ Vibe', date: 'Wed, 27 May • 20:20', loc: 'Park Street', price: '₹499 Onwards' },
                    { img: 'https://images.unsplash.com/photo-1544785349-c4a5301826fd?q=80&w=200', title: 'EDM Night Fest', date: 'Wed, 27 May • 20:20', loc: 'Aquatica', price: '₹4799 Onwards' },
                  ].map((rec, idx) => (
                    <div key={idx} className="flex gap-3 sm:gap-4 bg-[#1c1c1e] sm:bg-[#141414] rounded-xl p-3 sm:p-4 cursor-pointer hover:bg-[#242426] sm:hover:bg-[#1a1a1c] transition-colors border border-white/5">
                      <div className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] rounded-lg overflow-hidden flex-shrink-0">
                        <img src={rec.img} alt={rec.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-[13px] sm:text-[14px] font-semibold text-white mb-1">{rec.title}</h4>
                        <p className="text-[10px] sm:text-[11px] text-neutral-400 mb-1">{rec.date} • {rec.loc}</p>
                        <p className="text-[11px] sm:text-[12px] font-bold text-[#FF2E4D]">{rec.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
