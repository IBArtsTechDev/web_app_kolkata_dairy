import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAppStore } from '@/store'

/** Redirects guests to the login screen, preserving the requested path. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: (location.pathname + location.search) || '/' }}
      />
    )
  }

  return <>{children}</>
}
