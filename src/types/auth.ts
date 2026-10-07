/** User profile returned by the auth endpoints */
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
  countryCode: string | null
  phoneNumber: string | null
}

/** Standard authentication response envelope (flat user + token attributes) */
export interface AuthResponse extends AuthUser {
  accessToken: string
  refreshToken: string
}

/** Sign in credentials */
export interface LoginPayload {
  email: string
  password: string
}

/** Registration payload */
export interface RegisterPayload {
  name: string
  email: string
  password: string
  profilePicture?: File | string | null
  phoneNumber?: string | null
  userName?: string | null
  gender?: string | null
  age?: number | null
}


/** Admin login credentials (legacy / admin endpoint) */
export interface AdminLoginCredentials {
  email: string
  password: string
}
