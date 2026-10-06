import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/common/Input'
import { useLogin } from '@/hooks/useAuth'
import { useAppStore } from '@/store'
import { loginSchema, type LoginFormData } from '@/utils/validators'

interface LocationState {
  from?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const loginMutation = useLogin()
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const state = location.state as LocationState | null
  const redirectTo = state?.from || '/admin'

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  const onSubmit = (data: LoginFormData) => {
    setSubmitted(true)
    loginMutation.mutate(data, {
      onSuccess: () => navigate(redirectTo, { replace: true }),
      onError: () => setSubmitted(false),
    })
  }

  const errorMessage =
    loginMutation.error?.message ||
    (submitted ? 'Unable to sign you in with those credentials.' : undefined)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[420px] mx-auto py-10"
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Sign In</h1>
        <p className="text-neutral-400 mt-1">Manage events, categories and banners</p>
      </div>

      <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-5 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            label="Email"
            type="email"
            placeholder="admin@example.com"
            leftIcon={<Mail size={18} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock size={18} />}
            error={errors.password?.message}
            {...register('password')}
          />

          {loginMutation.isError && (
            <div
              className="flex items-start gap-2 p-3 rounded-xl border border-error/30 bg-error/10"
              role="alert"
            >
              <AlertTriangle size={16} className="text-error mt-0.5 shrink-0" />
              <p className="text-sm text-neutral-200">{errorMessage}</p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={loginMutation.isPending}
            className="w-full bg-[#FF2E4D] hover:bg-[#e02441] text-white"
          >
            {loginMutation.isPending ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-neutral-500 mt-6">
        <Link to="/" className="text-neutral-400 hover:text-white transition-colors">
          Back to home
        </Link>
      </p>
    </motion.div>
  )
}
