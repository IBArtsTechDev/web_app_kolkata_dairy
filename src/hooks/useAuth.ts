import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { syncPushToken, unregisterPushToken } from '@/lib/push'
import { useAppStore } from '@/store'
import type {
  AdminLoginCredentials,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '@/types'

/** Sign in standard user with email + password */
export function useLogin() {
  const login = useAppStore((state) => state.login)
  const queryClient = useQueryClient()

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (session) => {
      login(session)
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      // Link the (possibly anonymous) push device to the freshly signed-in user
      void syncPushToken()
    },
  })
}

/** Register new user */
export function useRegister() {
  const login = useAppStore((state) => state.login)
  const queryClient = useQueryClient()

  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: (payload) => authApi.register(payload),
    onSuccess: (session) => {
      login(session)
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      // Link the (possibly anonymous) push device to the new account
      void syncPushToken()
    },
  })
}

/** Admin login */
export function useAdminLogin() {
  const login = useAppStore((state) => state.login)
  const queryClient = useQueryClient()

  return useMutation<AuthResponse, Error, AdminLoginCredentials>({
    mutationFn: (credentials) => authApi.adminLogin(credentials),
    onSuccess: (session) => {
      login(session)
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

/** Log out current user */
export function useLogout() {
  const logout = useAppStore((state) => state.logout)
  const queryClient = useQueryClient()

  return () => {
    // Deactivate this device's push row FIRST (reason `logout`) while the auth
    // token is still available; the permission itself is left untouched.
    void unregisterPushToken()
    logout()
    queryClient.removeQueries({ queryKey: ['bookmarks'] })
    queryClient.removeQueries({ queryKey: ['favorites'] })
    queryClient.removeQueries({ queryKey: ['notifications'] })
  }
}
