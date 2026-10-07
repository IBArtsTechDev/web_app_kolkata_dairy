export type EntityType = 'event' | 'category'

/** Hydrated event projection returned in bookmark & favorite lists (13 fields) */
export interface HydratedEvent {
  eventId: string
  title: string
  imageUrl: string | null
  startsAt: string
  endsAt: string | null
  venueName: string
  city: string
  area: string | null
  category: string | null
  priceMin: number
  currency: string
  isFree: boolean
  status: string
}

/** Hydrated category projection returned in bookmark & favorite lists (5 fields) */
export interface HydratedCategory {
  categoryId: string
  categoryName: string
  categorySlug: string
  categoryIcon: string | null
  isActive: boolean
}

/** Engagement row in database */
export interface EngagementRecord {
  id: number
  userId: number
  entityType: EntityType
  entityId: string
  createdAt: string
  updatedAt: string
}

/** Engagement item in list responses (entity is null if the target was soft-deleted) */
export interface EngagementItem extends EngagementRecord {
  entity: HydratedEvent | HydratedCategory | null
}

/** Engagement pagination meta */
export interface EngagementPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

/** Engagement list response data */
export interface EngagementListResponse {
  items: EngagementItem[]
  pagination: EngagementPagination
}

/** Remove engagement response */
export interface EngagementRemoveResponse {
  removed: boolean
  entityType: EntityType
  entityId: string
}
