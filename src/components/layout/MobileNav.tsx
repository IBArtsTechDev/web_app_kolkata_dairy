import { Home, Compass, Ticket, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/events', icon: Compass, label: 'Explore' },
  { to: '/create', icon: Ticket, label: 'Create' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function MobileNav() {
  const location = useLocation()

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-neutral-800/50 safe-area-bottom"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-[512px] mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || (item.to === '/' && location.pathname === '')
          const Icon = item.icon

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors min-w-[44px] min-h-[44px]',
                isActive ? 'text-accent-red' : 'text-neutral-500 hover:text-neutral-300'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
