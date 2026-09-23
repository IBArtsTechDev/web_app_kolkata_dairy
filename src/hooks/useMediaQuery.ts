import { useCallback, useEffect, useState } from 'react'

/**
 * Hook that returns whether a CSS media query matches.
 * Mobile-first: pass a min-width query like '(min-width: 640px)'.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)

    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

/** Convenience hooks for common breakpoints */
export function useIsMobile(): boolean {
  return !useMediaQuery('(min-width: 640px)')
}

export function useIsTablet(): boolean {
  const isSmUp = useMediaQuery('(min-width: 640px)')
  const isLgUp = useMediaQuery('(min-width: 1024px)')
  return isSmUp && !isLgUp
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function usePrefersDark(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

/**
 * LocalStorage-backed state that syncs across tabs.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value
        window.localStorage.setItem(key, JSON.stringify(newValue))
        return newValue
      })
    },
    [key],
  )

  // Listen for changes in other tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue) as T)
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key])

  return [storedValue, setValue]
}
