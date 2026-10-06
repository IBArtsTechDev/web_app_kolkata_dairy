import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Bell, ShieldCheck } from 'lucide-react'
import { navigationItems } from '@/components/hero/data'
import { SearchOverlay } from './SearchOverlay'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  return (
    <>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {/* Mobile-only Header */}
      <header className="sm:hidden flex flex-col px-4 pt-4 pb-2 bg-[#0a0a0a] gap-4 safe-area-top sticky top-0 z-50">
        <div className="flex justify-end items-center w-full">
          
          {/* Notifications */}
          <button
            className="w-10 h-10 rounded-full bg-[#141414] border border-neutral-800 flex items-center justify-center relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-neutral-400" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-accent-red rounded-full border border-[#141414]"></span>
          </button>
        </div>

        {/* Mobile Search */}
        <button
          type="button"
          className="flex items-center bg-[#141414] rounded-xl px-4 py-3 border border-neutral-800 w-full cursor-text"
          onClick={() => setIsSearchOpen(true)}
          aria-label="Open search"
        >
          <Search className="w-4 h-4 text-neutral-500 mr-3" />
          <span className="bg-transparent border-none text-xs text-neutral-200 placeholder:text-neutral-500 w-full cursor-text pointer-events-none">
            Search here...
          </span>
        </button>
      </header>

      {/* Desktop Header */}
      <header className="hidden sm:block sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-neutral-800/50 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group pt-1">
              <img src="/logo.png" alt="KD Icon" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
              <img src="/logo_text.png" alt="Kolkata Diary" className="h-7 w-auto object-contain hidden sm:block" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                    item.isActive
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search Pill */}
              <button
                type="button"
                className="flex items-center bg-[#1a1a1a] rounded-full px-3 py-1.5 border border-neutral-800 cursor-text"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="w-3.5 h-3.5 text-neutral-400 mr-2" />
                <span className="bg-transparent border-none text-xs text-white placeholder:text-neutral-500 w-24 cursor-text pointer-events-none">
                  Search...
                </span>
              </button>

              {/* Admin / Sign in */}
              <Link
                to={isAuthenticated ? '/admin' : '/login'}
                className="flex items-center gap-1.5 bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors text-xs font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {isAuthenticated ? 'Admin' : 'Sign in'}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
