import { useMutation } from '@tanstack/react-query'
import { forgotPasswordApi } from '@/api/forgotPassword'
import type { ApiError } from '@/types'

export function useForgotPasswordRequest() {
  return useMutation<
    { email: string; expiresInSeconds: number },
    ApiError,
    { email: string }
  >({
    mutationFn: (payload) => forgotPasswordApi.requestReset(payload),
  })
}

export function useForgotPasswordVerify() {
  return useMutation<
    { valid: boolean; email?: string },
    ApiError,
    { token: string }
  >({
    mutationFn: (payload) => forgotPasswordApi.verifyToken(payload),
  })
}

export function useForgotPasswordReset() {
  return useMutation<
    { email: string; message: string },
    ApiError,
    { token: string; newPassword: string }
  >({
    mutationFn: (payload) => forgotPasswordApi.resetPassword(payload),
  })
}
