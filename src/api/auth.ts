import { apiClient } from './client'
import type { ApiResponse, LoginCredentials, LoginResponse } from '@/types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
      '/admin/admin-login',
      credentials,
    )
    if (!data.data?.accessToken) {
      throw new Error(data.message || 'Login failed')
    }
    return data.data
  },
}
