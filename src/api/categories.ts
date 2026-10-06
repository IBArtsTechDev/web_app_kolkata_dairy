import { apiClient } from './client'
import { toFormData } from './form'
import { pick, mapCategory } from './mappers'
import type { ApiResponse, Category } from '@/types'
import type { CategoryDto } from './dto'

export interface CategoryPayload {
  categoryName?: string
  categorySlug?: string
  description?: string | null
  isActive?: boolean
  categoryIcon?: string | null
}

const unwrapCategory = (payload: ApiResponse<unknown>): Category => {
  const dto = pick<CategoryDto>(payload, 'category')
  if (!dto) throw new Error('Category was not returned by the API')
  return mapCategory(dto)
}

const unwrapUpdatedCategory = (payload: ApiResponse<unknown>): Category => {
  const dto = pick<CategoryDto>(payload, 'updateCategory')
  if (!dto) throw new Error('Category was not returned by the API')
  return mapCategory(dto)
}

export const categoriesApi = {
  /** Public – active categories only */
  getActive: async (limit?: number): Promise<Category[]> => {
    const { data } = await apiClient.get<ApiResponse<{ category: CategoryDto[] }>>(
      '/categories',
      { params: limit ? { limit } : undefined },
    )
    const dto = pick<CategoryDto[]>(data, 'category') ?? []
    return dto.map(mapCategory)
  },

  /** Admin – every non deleted category */
  adminList: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<ApiResponse<{ category: CategoryDto[] }>>(
      '/admin/fetch-category',
    )
    const dto = pick<CategoryDto[]>(data, 'category') ?? []
    return dto.map(mapCategory)
  },

  adminGetById: async (categoryId: string): Promise<Category> => {
    const { data } = await apiClient.get<ApiResponse<unknown>>(
      `/admin/fetch-category/${categoryId}`,
    )
    return unwrapCategory(data)
  },

  create: async (payload: CategoryPayload, icon?: File): Promise<Category> => {
    const formData = toFormData({ ...payload, categoryIcon: undefined })
    formData.set('categoryIcon', icon ?? payload.categoryIcon ?? '')
    const { data } = await apiClient.post<ApiResponse<unknown>>(
      '/admin/add-category',
      formData,
    )
    return unwrapCategory(data)
  },

  update: async (
    categoryId: string,
    payload: CategoryPayload,
    icon?: File,
  ): Promise<Category> => {
    const formData = toFormData({ ...payload, categoryIcon: undefined })
    formData.set('categoryIcon', icon ?? '')
    const { data } = await apiClient.put<ApiResponse<unknown>>(
      `/admin/update-category/${categoryId}`,
      formData,
    )
    return unwrapUpdatedCategory(data)
  },

  remove: async (categoryId: string): Promise<void> => {
    await apiClient.delete(`/admin/remove-category/${categoryId}`)
  },
}
