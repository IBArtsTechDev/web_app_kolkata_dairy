import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { useAppStore } from '@/store'
import type { LoginCredentials, LoginResponse } from '@/types'

/** Hook to sign an admin in and persist the session */
export function useLogin() {
  const login = useAppStore((state) => state.login)

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (session) => login(session),
  })
}
