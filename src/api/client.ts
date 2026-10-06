import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { ApiError, ApiFieldError } from '@/types'

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '')

export const AUTH_TOKEN_KEY = 'auth_token'
export const AUTH_USER_KEY = 'auth_user'

export const getAuthToken = (): string | null => localStorage.getItem(AUTH_TOKEN_KEY)

export const setAuthToken = (token: string): void => localStorage.setItem(AUTH_TOKEN_KEY, token)

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

/**
 * Uploaded files are stored by the API as relative paths (e.g. `uploads/banners/x.webp`).
 * This turns them into URLs that work with both the dev proxy and an absolute API origin.
 */
export function resolveAssetUrl(path?: string | null): string | undefined {
  if (!path) return undefined
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path

  const normalized = path.replace(/^\/+/, '')

  if (API_BASE_URL.startsWith('/')) {
    return `/${normalized}`
  }

  try {
    return new URL(normalized, API_BASE_URL).toString()
  } catch {
    return `/${normalized}`
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.data instanceof FormData) {
      config.headers.delete('Content-Type')
    }

    return config
  },
  (error) => Promise.reject(error),
)

function extractError(error: unknown): ApiError {
  const fallback: ApiError = {
    message: 'An unexpected error occurred',
    statusCode: 500,
  }

  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return { ...fallback, message: error.message }
    }
    return fallback
  }

  if (!error.response) {
    return { message: 'Network error – please check your connection', statusCode: 0 }
  }

  const payload = error.response.data as
    | { message?: string; errorCode?: string; errors?: ApiFieldError[] }
    | undefined

  const apiError: ApiError = {
    message: payload?.message || error.response.statusText || fallback.message,
    statusCode: error.response.status,
    errorCode: payload?.errorCode,
    errors: Array.isArray(payload?.errors) ? payload.errors : undefined,
  }

  return apiError
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = extractError(error)

    if (apiError.statusCode === 401) {
      clearAuthToken()
    }

    return Promise.reject(apiError)
  },
)

export default apiClient
