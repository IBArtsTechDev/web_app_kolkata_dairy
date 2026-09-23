import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronDown, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { navigationItems } from '@/components/hero/data'
import { SearchOverlay } from './SearchOverlay'
import { cn } from '@/lib/utils'

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {/* Mobile-only Header */}
      <header className="sm:hidden flex flex-col px-4 pt-4 pb-2 bg-[#0a0a0a] gap-4 safe-area-top sticky top-0 z-50">
        <div className="flex justify-between items-center w-full">
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <Avatar size="sm" className="w-10 h-10 border border-neutral-700">
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="John" />
              <AvatarFallback className="bg-neutral-800 text-white font-bold">
                JS
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <p className="text-[10px] text-neutral-400 leading-none mb-1">Hello John</p>
              <p className="text-sm font-semibold text-white leading-none">Welcome Back!</p>
            </div>
          </div>
          
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

              {/* Location Pill */}
              <button className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-neutral-800 text-neutral-300 hover:text-white transition-colors text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse"></span>
                <span>Kolkata</span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-2 pl-2">
                <div className="text-right hidden md:block">
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider leading-none mb-0.5">Welcome</p>
                  <p className="text-xs font-medium text-white leading-none">John Sen</p>
                </div>
                <Avatar size="sm" className="w-8 h-8 border border-neutral-700">
                  <AvatarFallback className="bg-neutral-800 text-white text-[10px] font-bold">
                    JS
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
