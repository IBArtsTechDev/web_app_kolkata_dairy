import { apiClient } from './client'
import type {
  ApiResponse,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  AdminLoginCredentials,
} from '@/types'

export const authApi = {
  /** User registration with name, email, password, and optional avatar / profile fields */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    let requestData: FormData | RegisterPayload = payload
    let headers: Record<string, string> = {}

    if (payload.profilePicture instanceof File) {
      const formData = new FormData()
      formData.append('name', payload.name)
      formData.append('email', payload.email)
      formData.append('password', payload.password)
      formData.append('profilePicture', payload.profilePicture)
      if (payload.phoneNumber) formData.append('phoneNumber', payload.phoneNumber)
      if (payload.userName) formData.append('userName', payload.userName)
      if (payload.gender) formData.append('gender', payload.gender)
      if (payload.age != null) formData.append('age', String(payload.age))
      requestData = formData
      headers = { 'Content-Type': 'multipart/form-data' }
    }

    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      requestData,
      { headers }
    )
    if (!data.data?.accessToken) {
      throw new Error(data.message || 'Registration failed')
    }
    return data.data
  },

  /** Standard user login with email and password */
  login: async (credentials: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    if (!data.data?.accessToken) {
      throw new Error(data.message || 'Login failed')
    }
    return data.data
  },

  /** Admin login for administrative portal access */
  adminLogin: async (credentials: AdminLoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/admin/admin-login',
      credentials,
    )
    if (!data.data?.accessToken) {
      throw new Error(data.message || 'Admin login failed')
    }
    return data.data
  },
}

