import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoriesApi, type CategoryPayload } from '@/api/categories'

const QUERY_KEYS = {
  categories: ['categories'] as const,
  adminCategories: ['admin', 'categories'] as const,
}

/** Hook to fetch the active public categories */
export function useCategories(limit?: number) {
  return useQuery({
    queryKey: [...QUERY_KEYS.categories, limit ?? 'all'],
    queryFn: () => categoriesApi.getActive(limit),
    staleTime: 5 * 60 * 1000,
  })
}

/** Hook to fetch every category (admin) */
export function useAdminCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.adminCategories,
    queryFn: () => categoriesApi.adminList(),
  })
}

/** Hook to create a category (admin) */
export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ payload, icon }: { payload: CategoryPayload; icon?: File }) =>
      categoriesApi.create(payload, icon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminCategories })
    },
  })
}

/** Hook to update a category (admin) */
export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
      icon,
    }: {
      categoryId: string
      payload: CategoryPayload
      icon?: File
    }) => categoriesApi.update(categoryId, payload, icon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminCategories })
    },
  })
}

/** Hook to delete a category (admin) */
export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryId: string) => categoriesApi.remove(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminCategories })
    },
  })
}
