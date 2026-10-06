import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Image, LayoutGrid, LogOut, Shapes } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventsPanel } from './EventsPanel'
import { CategoriesPanel } from './CategoriesPanel'
import { BannersPanel } from './BannersPanel'
import { useAppStore } from '@/store'
import { useAppContext } from '@/context'

type TabId = 'events' | 'categories' | 'banners'

const tabs: { id: TabId; label: string; icon: typeof CalendarDays }[] = [
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'categories', label: 'Categories', icon: Shapes },
  { id: 'banners', label: 'Banners', icon: Image },
]

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('events')
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const user = useAppStore((state) => state.user)
  const logout = useAppStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    addToast({ message: 'Signed out successfully.', type: 'info' })
    navigate('/')
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <LayoutGrid size={22} className="text-primary-500" />
            Admin Console
          </h1>
          <p className="text-neutral-400 mt-1">
            {user ? `Signed in as ${user.email}` : 'Manage your listings'}
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut size={16} />
          Sign out
        </Button>
      </motion.div>

      {/* Segmented tabs */}
      <div className="inline-flex p-1 rounded-xl bg-[#141414] border border-neutral-800 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.span
                  layoutId="admin-tab-pill"
                  transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                  className="absolute inset-0 rounded-lg bg-[#FF2E4D]"
                />
              )}
              <Icon size={15} className="relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        {activeTab === 'events' && <EventsPanel />}
        {activeTab === 'categories' && <CategoriesPanel />}
        {activeTab === 'banners' && <BannersPanel />}
      </motion.div>
    </div>
  )
}
