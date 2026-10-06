import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bannersApi, type BannerPayload } from '@/api/banners'

const QUERY_KEYS = {
  banners: ['banners'] as const,
  adminBanners: ['admin', 'banners'] as const,
}

/** Hook to fetch the active public banners */
export function useBanners(limit?: number) {
  return useQuery({
    queryKey: [...QUERY_KEYS.banners, limit ?? 'all'],
    queryFn: () => bannersApi.getActive(limit),
    staleTime: 5 * 60 * 1000,
  })
}

/** Hook to fetch every banner (admin) */
export function useAdminBanners() {
  return useQuery({
    queryKey: QUERY_KEYS.adminBanners,
    queryFn: () => bannersApi.adminList(),
  })
}

/** Hook to create a banner (admin) */
export function useCreateBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ payload, image }: { payload: BannerPayload; image?: File }) =>
      bannersApi.create(payload, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.banners })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminBanners })
    },
  })
}

/** Hook to update a banner (admin) */
export function useUpdateBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      bannerId,
      payload,
      image,
    }: {
      bannerId: string
      payload: BannerPayload
      image?: File
    }) => bannersApi.update(bannerId, payload, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.banners })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminBanners })
    },
  })
}

/** Hook to delete a banner (admin) */
export function useDeleteBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bannerId: string) => bannersApi.remove(bannerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.banners })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminBanners })
    },
  })
}
