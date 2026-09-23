import axios from 'axios'
import type { ApiError } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor – attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor – normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      statusCode: 500,
    }

    if (error.response) {
      apiError.message = error.response.data?.message || error.response.statusText
      apiError.statusCode = error.response.status
      apiError.errors = error.response.data?.errors
    } else if (error.request) {
      apiError.message = 'Network error – please check your connection'
      apiError.statusCode = 0
    }

    return Promise.reject(apiError)
  },
)

export default apiClient
