export type {
  AuthUser,
  AuthResponse,
  AuthResponse as LoginResponse,
  LoginPayload,
  LoginPayload as LoginCredentials,
  RegisterPayload,
  AdminLoginCredentials,
} from './auth'


/** Banner entity returned by the API (image resolved to a usable URL) */
export interface Banner {
  id: string
  bannerId: string
  title: string
  image: string
  link: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
}

/** Category entity returned by the API (icon resolved to a usable URL) */
export interface Category {
  id: string
  categoryId: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  isActive: boolean
  createdAt: string
}
