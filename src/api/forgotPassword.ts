import { apiClient } from './client'
import type { ApiResponse } from '@/types'

export interface ForgotPasswordRequestPayload {
  email: string
}

export interface ForgotPasswordVerifyPayload {
  token: string
}

export interface ForgotPasswordVerifyResponse {
  valid: boolean
  email?: string
}

export interface ForgotPasswordResetPayload {
  token: string
  newPassword: string
}

export interface ForgotPasswordResetResponse {
  email: string
  message: string
}

export const forgotPasswordApi = {
  /**
   * Request a password reset link to be sent to the user's email
   * Returns generic success response to prevent user enumeration
   */
  requestReset: async (payload: ForgotPasswordRequestPayload): Promise<{ email: string; expiresInSeconds: number }> => {
    const { data } = await apiClient.post<ApiResponse<{ email: string; expiresInSeconds: number }>>(
      '/auth/forgot-password/request',
      payload,
    )
    if (!data.data) {
      throw new Error(data.message || 'Failed to request password reset')
    }
    return data.data
  },

  /**
   * Verify that a password reset token is valid
   * Does not consume the token
   */
  verifyToken: async (payload: ForgotPasswordVerifyPayload): Promise<ForgotPasswordVerifyResponse> => {
    const { data } = await apiClient.post<ApiResponse<ForgotPasswordVerifyResponse>>(
      '/auth/forgot-password/verify',
      payload,
    )
    if (!data.data) {
      throw new Error(data.message || 'Failed to verify token')
    }
    return data.data
  },

  /**
   * Reset the user's password with a valid token
   * Atomically consumes the token and updates the password
   */
  resetPassword: async (payload: ForgotPasswordResetPayload): Promise<ForgotPasswordResetResponse> => {
    const { data } = await apiClient.post<ApiResponse<ForgotPasswordResetResponse>>(
      '/auth/forgot-password/reset',
      payload,
    )
    if (!data.data) {
      throw new Error(data.message || 'Failed to reset password')
    }
    return data.data
  },
}
