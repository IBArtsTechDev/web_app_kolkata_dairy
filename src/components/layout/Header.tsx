import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Search,
  ShieldCheck,
  Bookmark,
  Heart,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from 'lucide-react'
import { navigationItems } from '@/components/hero/data'
import { SearchOverlay } from './SearchOverlay'
import { NotificationBell } from '@/components/notifications'
import { useAppStore } from '@/store'
import { useLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { getInitials } from '@/utils'
import { resolveAssetUrl } from '@/api'

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const desktopMenuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const user = useAppStore((state) => state.user)
  const openAuthModal = useAppStore((state) => state.openAuthModal)
  const logout = useLogout()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      const isOutsideMobile = mobileMenuRef.current && !mobileMenuRef.current.contains(target)
      const isOutsideDesktop = desktopMenuRef.current && !desktopMenuRef.current.contains(target)
      
      // If the click is outside BOTH menus (the ones that exist), close the menu.
      // If we only check one, clicking inside mobile menu might be considered "outside" desktop menu.
      if (
        (!mobileMenuRef.current || isOutsideMobile) && 
        (!desktopMenuRef.current || isOutsideDesktop)
      ) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on route change during render (React recommended pattern)
  const [prevPath, setPrevPath] = useState(location.pathname)
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setIsUserMenuOpen(false)
  }

  const isAdmin = user?.role === 'ADMIN'

  const userDropdownMenu = isUserMenuOpen && (
    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#141414] border border-neutral-800 shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
      <div className="px-4 py-2 border-b border-neutral-800/80 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#FF2E4D] text-white flex items-center justify-center text-xs font-bold uppercase shrink-0 border border-neutral-700">
          {user?.profilePicture ? (
            <img
              src={resolveAssetUrl(user.profilePicture)}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(user?.name || user?.email || 'U')
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white truncate">{user?.name || 'User'}</p>
          <p className="text-[11px] text-neutral-400 truncate">{user?.email}</p>
          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-neutral-800 text-neutral-300">
            {user?.role || 'USER'}
          </span>
        </div>
      </div>

      <div className="py-1">
        <Link
          to="/bookmarks"
          className="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
        >
          <Bookmark size={15} className="text-amber-400" />
          <span>My Bookmarks</span>
        </Link>

        <Link
          to="/favorites"
          className="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
        >
          <Heart size={15} className="text-rose-400" />
          <span>My Favorites</span>
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
          >
            <ShieldCheck size={15} className="text-emerald-400" />
            <span>Admin Portal</span>
          </Link>
        )}
      </div>

      <div className="border-t border-neutral-800/80 pt-1">
        <button
          type="button"
          onClick={() => {
            setIsUserMenuOpen(false)
            logout()
          }}
          className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile-only Header */}
      <header className="sm:hidden flex flex-col px-4 pt-4 pb-2 bg-[#0a0a0a] gap-3 safe-area-top sticky top-0 z-50 border-b border-neutral-900">
        <div className="flex justify-between items-center w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="KD Icon" className="h-8 w-auto object-contain" />
            <img src="/logo_text.png" alt="Kolkata Diary" className="h-6 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <NotificationBell />

            {/* Auth button on mobile */}
            {isAuthenticated ? (
              <div className="relative" ref={mobileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-white uppercase"
                  aria-label="User account"
                >
                  {user?.profilePicture ? (
                    <img
                      src={resolveAssetUrl(user.profilePicture)}
                      alt={user.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    getInitials(user?.name || user?.email || 'U')
                  )}
                </button>
                {userDropdownMenu}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="px-3 py-1.5 rounded-full bg-[#FF2E4D] text-white text-xs font-semibold hover:bg-[#e02441] transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <button
          type="button"
          className="flex items-center bg-[#141414] rounded-xl px-4 py-2.5 border border-neutral-800 w-full cursor-text"
          onClick={() => setIsSearchOpen(true)}
          aria-label="Open search"
        >
          <Search className="w-4 h-4 text-neutral-500 mr-3" />
          <span className="bg-transparent border-none text-xs text-neutral-400 w-full cursor-text text-left pointer-events-none">
            Search events, categories...
          </span>
        </button>
      </header>

      {/* Desktop Header */}
      <header className="hidden sm:block sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-neutral-800/50 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group pt-1">
              <img
                src="/logo.png"
                alt="KD Icon"
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <img src="/logo_text.png" alt="Kolkata Diary" className="h-7 w-auto object-contain" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50',
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search Pill */}
              <button
                type="button"
                className="flex items-center bg-[#1a1a1a] rounded-full px-3 py-1.5 border border-neutral-800 cursor-text hover:border-neutral-700 transition-colors"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="w-3.5 h-3.5 text-neutral-400 mr-2" />
                <span className="bg-transparent border-none text-xs text-neutral-400 w-24 text-left pointer-events-none">
                  Search...
                </span>
              </button>

              {/* Notifications (desktop) */}
              <NotificationBell />

              {/* User Account / Sign In */}
              {isAuthenticated ? (
                <div className="relative" ref={desktopMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 bg-[#1a1a1a] pl-2 pr-3 py-1.5 rounded-full border border-neutral-800 text-neutral-200 hover:text-white hover:border-neutral-700 transition-all text-xs font-medium"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[#FF2E4D] text-white flex items-center justify-center text-[10px] font-bold uppercase shrink-0 border border-neutral-700">
                      {user?.profilePicture ? (
                        <img
                          src={resolveAssetUrl(user.profilePicture)}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(user?.name || user?.email || 'U')
                      )}
                    </div>
                    <span className="max-w-[100px] truncate">{user?.name || user?.email}</span>
                    <ChevronDown size={14} className="text-neutral-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownMenu}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openAuthModal()}
                    className="flex items-center gap-1.5 bg-[#FF2E4D] hover:bg-[#e02441] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
                  >
                    <UserIcon size={14} />
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
