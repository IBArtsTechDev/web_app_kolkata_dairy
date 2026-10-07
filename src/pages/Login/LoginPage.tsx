import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertTriangle, Lock, Mail, User as UserIcon, ShieldCheck, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/common/Input'
import { useLogin, useRegister, useAdminLogin } from '@/hooks/useAuth'
import { AvatarPicker } from '@/components/auth'
import { useAppStore } from '@/store'
import { useAppContext } from '@/context'

interface LocationState {
  from?: string
}

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Enter a valid email address').max(150),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().trim().max(20).optional().or(z.literal('')),
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

type AuthMode = 'login' | 'register'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const { addToast } = useAppContext()

  const [mode, setMode] = useState<AuthMode>('login')
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const adminLoginMutation = useAdminLogin()

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', phoneNumber: '' },
  })

  const state = location.state as LocationState | null
  const redirectTo = state?.from || (isAdminMode ? '/admin' : '/')

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  const onLoginSubmit = (data: LoginFormData) => {
    if (isAdminMode) {
      adminLoginMutation.mutate(data, {
        onSuccess: () => {
          addToast({ message: 'Signed in to Admin Portal', type: 'success' })
          navigate('/admin', { replace: true })
        },
      })
    } else {
      loginMutation.mutate(data, {
        onSuccess: () => {
          addToast({ message: 'Welcome back!', type: 'success' })
          navigate(redirectTo, { replace: true })
        },
      })
    }
  }

  const onRegisterSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber ? data.phoneNumber : undefined,
        profilePicture: avatarFile,
      },
      {
        onSuccess: () => {
          addToast({ message: 'Account created! Welcome to Kolkata Diary.', type: 'success' })
          navigate(redirectTo, { replace: true })
        },
      }
    )
  }

  const isPending =
    loginMutation.isPending ||
    adminLoginMutation.isPending ||
    registerMutation.isPending

  const errorMessage =
    (isAdminMode ? adminLoginMutation.error?.message : loginMutation.error?.message) ||
    registerMutation.error?.message

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[420px] mx-auto py-8 sm:py-12 px-4"
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {mode === 'register'
            ? 'Create an Account'
            : isAdminMode
              ? 'Admin Portal'
              : 'Welcome Back'}
        </h1>
        <p className="text-neutral-400 mt-1 text-xs sm:text-sm">
          {mode === 'register'
            ? 'Join to bookmark events, save favorites and more'
            : isAdminMode
              ? 'Sign in with your administrative credentials'
              : 'Sign in to access your bookmarks and saved favorites'}
        </p>
      </div>

      <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-5 sm:p-7 shadow-xl">
        {/* Top tab selector */}
        {!isAdminMode && (
          <div className="flex rounded-xl bg-neutral-900 p-1 border border-neutral-800 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'login'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'register'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div
            className="flex items-start gap-2 p-3 rounded-xl border border-error/30 bg-error/10 mb-5"
            role="alert"
          >
            <AlertTriangle size={16} className="text-error mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-neutral-200">{errorMessage}</p>
          </div>
        )}

        {/* Form: Login */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={18} />}
              error={loginErrors.email?.message}
              {...loginRegister('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              error={loginErrors.password?.message}
              {...loginRegister('password')}
            />

            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="w-full bg-[#FF2E4D] hover:bg-[#e02441] text-white mt-2"
            >
              {isPending ? 'Signing in…' : isAdminMode ? 'Sign In as Admin' : 'Sign In'}
            </Button>
          </form>
        )}

        {/* Form: Register */}
        {mode === 'register' && !isAdminMode && (
          <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4" noValidate>
            <AvatarPicker
              file={avatarFile}
              previewUrl={avatarPreview}
              onChange={(file, preview) => {
                setAvatarFile(file)
                setAvatarPreview(preview)
              }}
              disabled={isPending}
            />

            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              leftIcon={<UserIcon size={18} />}
              error={registerErrors.name?.message}
              {...registerRegister('name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={18} />}
              error={registerErrors.email?.message}
              {...registerRegister('email')}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+91 98765 43210"
              leftIcon={<Phone size={18} />}
              error={registerErrors.phoneNumber?.message}
              {...registerRegister('phoneNumber')}
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              error={registerErrors.password?.message}
              {...registerRegister('password')}
            />

            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="w-full bg-[#FF2E4D] hover:bg-[#e02441] text-white mt-2"
            >
              {isPending ? 'Creating Account…' : 'Create Account'}
            </Button>
          </form>
        )}

        {/* Admin toggle */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
          <span>{isAdminMode ? 'Regular user?' : 'Are you an administrator?'}</span>
          <button
            type="button"
            onClick={() => {
              setIsAdminMode((prev) => !prev)
              setMode('login')
            }}
            className="text-neutral-300 hover:text-white font-medium flex items-center gap-1 transition-colors"
          >
            <ShieldCheck size={14} className={isAdminMode ? 'text-emerald-400' : ''} />
            {isAdminMode ? 'Switch to User Login' : 'Admin Login'}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-neutral-500 mt-6">
        <Link to="/" className="text-neutral-400 hover:text-white transition-colors">
          Back to home
        </Link>
      </p>
    </motion.div>
  )
}
