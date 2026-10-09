import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

interface AppContextValue {
  /** Global loading overlay state */
  isLoading: boolean
  setLoading: (loading: boolean) => void

  /** Toast notification state */
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  /** Optional — invoked when the toast body is clicked (e.g. push deep links) */
  onClick?: () => void
}

const TOAST_DURATION = 5000

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  // Cleanup all timers on unmount
  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev, { ...toast, id }])

      const timer = setTimeout(() => {
        removeToast(id)
      }, TOAST_DURATION)
      timersRef.current.set(id, timer)
    },
    [removeToast],
  )

  const value = useMemo(
    () => ({ isLoading, setLoading, toasts, addToast, removeToast }),
    [isLoading, toasts, addToast, removeToast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
