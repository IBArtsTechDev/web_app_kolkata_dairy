import { apiClient } from './client'
import type { ApiResponse, AuthUser, UpdateProfilePayload } from '@/types'

export const profileApi = {
  /** Fetch the current user's profile */
  getProfile: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get<ApiResponse<{ user: AuthUser }>>('/profile')
    if (!data.data?.user) {
      throw new Error(data.message || 'Failed to fetch profile')
    }
    return data.data.user
  },

  /** Update current user's profile (name, phone, country code, avatar) */
  updateProfile: async (payload: UpdateProfilePayload): Promise<AuthUser> => {
    let requestData: FormData | Record<string, unknown>
    let headers: Record<string, string> = {}

    if (payload.profilePicture instanceof File) {
      const formData = new FormData()
      formData.append('profilePicture', payload.profilePicture)
      if (payload.name !== undefined && payload.name !== '') {
        formData.append('name', payload.name.trim())
      }
      if (payload.phoneNumber !== undefined && payload.phoneNumber !== null && payload.phoneNumber !== '') {
        formData.append('phoneNumber', payload.phoneNumber.trim())
      }
      if (payload.countryCode !== undefined && payload.countryCode !== null && payload.countryCode !== '') {
        formData.append('countryCode', payload.countryCode.trim())
      }
      requestData = formData
      headers = { 'Content-Type': 'multipart/form-data' }
    } else {
      const jsonBody: Record<string, unknown> = {}
      if (payload.name !== undefined) {
        jsonBody.name = payload.name.trim()
      }
      if (payload.phoneNumber !== undefined) {
        jsonBody.phoneNumber = payload.phoneNumber ? payload.phoneNumber.trim() : null
      }
      if (payload.countryCode !== undefined) {
        jsonBody.countryCode = payload.countryCode ? payload.countryCode.trim() : null
      }
      if (payload.profilePicture === null) {
        jsonBody.profilePicture = null
      }
      requestData = jsonBody
    }

    const { data } = await apiClient.patch<ApiResponse<{ user: AuthUser }>>(
      '/profile',
      requestData,
      { headers }
    )

    if (!data.data?.user) {
      throw new Error(data.message || 'Failed to update profile')
    }
    return data.data.user
  },
}
