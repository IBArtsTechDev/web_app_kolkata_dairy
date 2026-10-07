import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookmarksApi, favoritesApi } from '@/api/engagement'
import { useAppStore } from '@/store'
import { useAppContext } from '@/context'
import type { EntityType, EngagementListResponse } from '@/types'

/** Fetch user bookmarks (paginated) */
export function useBookmarks(page = 1, limit = 20) {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  return useQuery<EngagementListResponse, Error>({
    queryKey: ['bookmarks', page, limit],
    queryFn: () => bookmarksApi.list(page, limit),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  })
}

/** Fetch user favorites (paginated) */
export function useFavorites(page = 1, limit = 20) {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  return useQuery<EngagementListResponse, Error>({
    queryKey: ['favorites', page, limit],
    queryFn: () => favoritesApi.list(page, limit),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  })
}

/** Pre-fetched engagement cache for instant button states */
export function useEngagementLookup() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  const bookmarksQuery = useQuery<EngagementListResponse, Error>({
    queryKey: ['bookmarks', 'lookup'],
    queryFn: () => bookmarksApi.list(1, 50),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  })

  const favoritesQuery = useQuery<EngagementListResponse, Error>({
    queryKey: ['favorites', 'lookup'],
    queryFn: () => favoritesApi.list(1, 50),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  })

  const bookmarkedSet = new Set(
    (bookmarksQuery.data?.items ?? []).map((item) => `${item.entityType}:${item.entityId}`),
  )

  const favoritedSet = new Set(
    (favoritesQuery.data?.items ?? []).map((item) => `${item.entityType}:${item.entityId}`),
  )

  return {
    isBookmarked: (entityType: EntityType, entityId: string): boolean => {
      if (!isAuthenticated) return false
      return bookmarkedSet.has(`${entityType}:${entityId}`)
    },
    isFavorited: (entityType: EntityType, entityId: string): boolean => {
      if (!isAuthenticated) return false
      return favoritedSet.has(`${entityType}:${entityId}`)
    },
    isLoading: bookmarksQuery.isLoading || favoritesQuery.isLoading,
  }
}

/** Toggle bookmark mutation with guest-gating and toast feedback */
export function useToggleBookmark() {
  const queryClient = useQueryClient()
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const openAuthModal = useAppStore((state) => state.openAuthModal)
  const { addToast } = useAppContext()
  const { isBookmarked } = useEngagementLookup()

  return useMutation({
    mutationFn: async ({
      entityType,
      entityId,
    }: {
      entityType: EntityType
      entityId: string
      entityTitle?: string
    }) => {
      if (!isAuthenticated) {
        openAuthModal()
        addToast({
          message: 'Please sign in to save bookmarks.',
          type: 'info',
        })
        throw new Error('Authentication required')
      }

      const currentlyBookmarked = isBookmarked(entityType, entityId)

      if (currentlyBookmarked) {
        await bookmarksApi.remove(entityType, entityId)
        return { action: 'removed' as const, entityType, entityId }
      } else {
        await bookmarksApi.add(entityType, entityId)
        return { action: 'added' as const, entityType, entityId }
      }
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      const title = variables.entityTitle ? `"${variables.entityTitle}"` : 'Item'
      if (result.action === 'added') {
        addToast({
          message: `${title} saved to bookmarks!`,
          type: 'success',
        })
      } else {
        addToast({
          message: `${title} removed from bookmarks.`,
          type: 'info',
        })
      }
    },
    onError: (err) => {
      if (err.message !== 'Authentication required') {
        addToast({
          message: err.message || 'Could not update bookmark.',
          type: 'error',
        })
      }
    },
  })
}

/** Toggle favorite mutation with guest-gating and toast feedback */
export function useToggleFavorite() {
  const queryClient = useQueryClient()
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const openAuthModal = useAppStore((state) => state.openAuthModal)
  const { addToast } = useAppContext()
  const { isFavorited } = useEngagementLookup()

  return useMutation({
    mutationFn: async ({
      entityType,
      entityId,
    }: {
      entityType: EntityType
      entityId: string
      entityTitle?: string
    }) => {
      if (!isAuthenticated) {
        openAuthModal()
        addToast({
          message: 'Please sign in to add items to favorites.',
          type: 'info',
        })
        throw new Error('Authentication required')
      }

      const currentlyFavorited = isFavorited(entityType, entityId)

      if (currentlyFavorited) {
        await favoritesApi.remove(entityType, entityId)
        return { action: 'removed' as const, entityType, entityId }
      } else {
        await favoritesApi.add(entityType, entityId)
        return { action: 'added' as const, entityType, entityId }
      }
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      const title = variables.entityTitle ? `"${variables.entityTitle}"` : 'Item'
      if (result.action === 'added') {
        addToast({
          message: `${title} added to favorites!`,
          type: 'success',
        })
      } else {
        addToast({
          message: `${title} removed from favorites.`,
          type: 'info',
        })
      }
    },
    onError: (err) => {
      if (err.message !== 'Authentication required') {
        addToast({
          message: err.message || 'Could not update favorites.',
          type: 'error',
        })
      }
    },
  })
}
