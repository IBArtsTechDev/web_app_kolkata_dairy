import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { profileApi } from '@/api/profile'
import { useAppStore } from '@/store'
import type { AuthUser, UpdateProfilePayload } from '@/types'

export const PROFILE_QUERY_KEY = ['profile'] as const

/** Hook to fetch current user's profile */
export function useProfile() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const updateUser = useAppStore((state) => state.updateUser)

  const query = useQuery<AuthUser, Error>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileApi.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })

  // Synchronize store with fresh server profile
  useEffect(() => {
    if (query.data) {
      updateUser(query.data)
    }
  }, [query.data, updateUser])

  return query
}

/** Hook to update current user's profile */
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const updateUser = useAppStore((state) => state.updateUser)

  return useMutation<AuthUser, Error, UpdateProfilePayload>({
    mutationFn: (payload) => profileApi.updateProfile(payload),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser)
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedUser)
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
    },
  })
}
