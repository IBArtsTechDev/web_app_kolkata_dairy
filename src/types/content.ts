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

/** Authenticated admin session user */
export interface AuthUser {
  id: number
  publicId: string
  name: string
  email: string
  username: string | null
  role: string
  profilePicture: string | null
  age: number | null
  gender: string | null
  phoneNumber: string
}

/** Credentials posted to the admin login endpoint */
export interface LoginCredentials {
  email: string
  password: string
}

/** Login response payload (user + tokens) */
export interface LoginResponse extends AuthUser {
  accessToken: string
  refreshToken: string
}
