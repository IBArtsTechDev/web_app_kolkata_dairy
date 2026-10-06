import { apiClient } from './client'
import { toFormData } from './form'
import { pick, mapBanner } from './mappers'
import type { ApiResponse, Banner } from '@/types'
import type { BannerDto } from './dto'

export interface BannerPayload {
  title?: string
  link?: string | null
  sortOrder?: number
  isActive?: boolean
  imageUrl?: string | null
}

const unwrapBanner = (payload: ApiResponse<unknown>): Banner => {
  const dto = pick<BannerDto>(payload, 'banner')
  if (!dto) throw new Error('Banner was not returned by the API')
  return mapBanner(dto)
}

const unwrapUpdatedBanner = (payload: ApiResponse<unknown>): Banner => {
  const dto = pick<BannerDto>(payload, 'updateBanner')
  if (!dto) throw new Error('Banner was not returned by the API')
  return mapBanner(dto)
}

export const bannersApi = {
  /** Public – active banners only */
  getActive: async (limit?: number): Promise<Banner[]> => {
    const { data } = await apiClient.get<ApiResponse<{ banner: BannerDto[] }>>('/banners', {
      params: limit ? { limit } : undefined,
    })
    const dto = pick<BannerDto[]>(data, 'banner') ?? []
    return dto.map(mapBanner)
  },

  /** Admin – every non deleted banner */
  adminList: async (): Promise<Banner[]> => {
    const { data } = await apiClient.get<ApiResponse<{ banner: BannerDto[] }>>(
      '/admin/fetch-banner',
    )
    const dto = pick<BannerDto[]>(data, 'banner') ?? []
    return dto.map(mapBanner)
  },

  adminGetById: async (bannerId: string): Promise<Banner> => {
    const { data } = await apiClient.get<ApiResponse<unknown>>(`/admin/fetch-banner/${bannerId}`)
    return unwrapBanner(data)
  },

  create: async (payload: BannerPayload, image?: File): Promise<Banner> => {
    const { data } = await apiClient.post<ApiResponse<unknown>>(
      '/admin/add-banner',
      toFormData({ ...payload, image, imageUrl: image ? undefined : payload.imageUrl }),
    )
    return unwrapBanner(data)
  },

  update: async (
    bannerId: string,
    payload: BannerPayload,
    image?: File,
  ): Promise<Banner> => {
    const { data } = await apiClient.put<ApiResponse<unknown>>(
      `/admin/update-banner/${bannerId}`,
      toFormData({ ...payload, image }),
    )
    return unwrapUpdatedBanner(data)
  },

  remove: async (bannerId: string): Promise<void> => {
    await apiClient.delete(`/admin/remove-banner/${bannerId}`)
  },
}
