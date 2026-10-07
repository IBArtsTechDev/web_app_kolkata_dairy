import { apiClient, resolveAssetUrl } from './client'
import type {
  ApiResponse,
  EntityType,
  EngagementListResponse,
  EngagementRecord,
  EngagementRemoveResponse,
  HydratedCategory,
  HydratedEvent,
} from '@/types'

function sanitizeEngagementList(data?: EngagementListResponse): EngagementListResponse {
  if (!data?.items) {
    return {
      items: [],
      pagination: data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
    }
  }

  const items = data.items.map((item) => {
    if (!item.entity) return item

    if (item.entityType === 'event') {
      const eventEntity = item.entity as HydratedEvent
      return {
        ...item,
        entity: {
          ...eventEntity,
          imageUrl: resolveAssetUrl(eventEntity.imageUrl) ?? null,
        },
      }
    }

    if (item.entityType === 'category') {
      const categoryEntity = item.entity as HydratedCategory
      return {
        ...item,
        entity: {
          ...categoryEntity,
          categoryIcon: resolveAssetUrl(categoryEntity.categoryIcon) ?? null,
        },
      }
    }

    return item
  })

  return {
    items,
    pagination: data.pagination,
  }
}

export const bookmarksApi = {
  /** Add a bookmark (idempotent, returns 201) */
  add: async (entityType: EntityType, entityId: string): Promise<EngagementRecord> => {
    const { data } = await apiClient.post<ApiResponse<{ bookmark: EngagementRecord }>>(
      '/bookmarks',
      { entityType, entityId },
    )
    if (!data.data?.bookmark) {
      throw new Error(data.message || 'Failed to add bookmark')
    }
    return data.data.bookmark
  },

  /** List user bookmarks with hydrated entities (page, limit) */
  list: async (page = 1, limit = 20): Promise<EngagementListResponse> => {
    const { data } = await apiClient.get<ApiResponse<EngagementListResponse>>('/bookmarks', {
      params: { page, limit },
    })
    return sanitizeEngagementList(data.data)
  },

  /** Remove a bookmark by entityType and public entityId */
  remove: async (
    entityType: EntityType,
    entityId: string,
  ): Promise<EngagementRemoveResponse> => {
    const { data } = await apiClient.delete<ApiResponse<EngagementRemoveResponse>>(
      `/bookmarks/${entityType}/${encodeURIComponent(entityId)}`,
    )
    return data.data ?? { removed: true, entityType, entityId }
  },
}

export const favoritesApi = {
  /** Add a favorite (idempotent, returns 201) */
  add: async (entityType: EntityType, entityId: string): Promise<EngagementRecord> => {
    const { data } = await apiClient.post<ApiResponse<{ favorite: EngagementRecord }>>(
      '/favorites',
      { entityType, entityId },
    )
    if (!data.data?.favorite) {
      throw new Error(data.message || 'Failed to add favorite')
    }
    return data.data.favorite
  },

  /** List user favorites with hydrated entities (page, limit) */
  list: async (page = 1, limit = 20): Promise<EngagementListResponse> => {
    const { data } = await apiClient.get<ApiResponse<EngagementListResponse>>('/favorites', {
      params: { page, limit },
    })
    return sanitizeEngagementList(data.data)
  },

  /** Remove a favorite by entityType and public entityId */
  remove: async (
    entityType: EntityType,
    entityId: string,
  ): Promise<EngagementRemoveResponse> => {
    const { data } = await apiClient.delete<ApiResponse<EngagementRemoveResponse>>(
      `/favorites/${entityType}/${encodeURIComponent(entityId)}`,
    )
    return data.data ?? { removed: true, entityType, entityId }
  },
}
