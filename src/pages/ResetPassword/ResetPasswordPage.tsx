import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Lock, AlertTriangle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/common/Input'
import { useForgotPasswordVerify, useForgotPasswordReset } from '@/hooks/useForgotPassword'
import { useAppContext } from '@/context'

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { addToast } = useAppContext()

  const [token, setToken] = useState<string | null>(null)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const verifyMutation = useForgotPasswordVerify()
  const resetMutation = useForgotPasswordReset()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const newPassword = watch('newPassword')

  // Extract and verify token on mount
  useEffect(() => {
    const tokenParam = searchParams.get('token')

    if (!tokenParam) {
      setTokenValid(false)
      return
    }

    setToken(tokenParam)

    // Verify token is valid
    verifyMutation.mutate({ token: tokenParam }, {
      onSuccess: (data) => {
        setTokenValid(data.valid)
        setEmail(data.email || null)
      },
      onError: () => {
        setTokenValid(false)
      },
    })
  }, [searchParams])

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) return

    resetMutation.mutate(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setResetSuccess(true)
          addToast({
            message: 'Password reset successful! You can now sign in with your new password.',
            type: 'success'
          })

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 3000)
        },
      }
    )
  }

  // Loading state while verifying token
  if (tokenValid === null && !verifyMutation.error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-[420px] mx-auto py-12 px-4 text-center"
      >
        <Loader2 className="h-12 w-12 animate-spin text-[#FF2E4D] mx-auto mb-4" />
        <p className="text-neutral-400">Verifying reset link...</p>
      </motion.div>
    )
  }

  // Success state
  if (resetSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[420px] mx-auto py-8 sm:py-12 px-4"
      >
        <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-5 sm:p-7 shadow-xl text-center">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
          <p className="text-neutral-400 text-sm mb-6">
            Your password has been updated. Redirecting you to the login page...
          </p>
          <Link to="/login">
            <Button className="w-full bg-[#FF2E4D] hover:bg-[#e02441] text-white">Go to Login</Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  // Invalid or expired token
  if (tokenValid === false || verifyMutation.error) {
    const errorMessage = verifyMutation.error?.errorCode === 'FORGOT_PASSWORD_TOKEN_EXPIRED'
      ? 'This password reset link has expired.'
      : verifyMutation.error?.errorCode === 'FORGOT_PASSWORD_TOKEN_ALREADY_USED'
      ? 'This password reset link has already been used.'
      : 'This password reset link is invalid or has expired.'

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[420px] mx-auto py-8 sm:py-12 px-4"
      >
        <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-5 sm:p-7 shadow-xl text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-error" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h2>
          <p className="text-neutral-400 text-sm mb-6">{errorMessage}</p>
          <p className="text-xs text-neutral-500 mb-6">
            Please request a new password reset link from the login page.
          </p>
          <Link to="/login">
            <Button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white">Back to Login</Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  // Reset form
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[420px] mx-auto py-8 sm:py-12 px-4"
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Reset Password</h1>
        {email ? (
          <p className="text-neutral-400 mt-1 text-xs sm:text-sm">
            for <span className="font-medium text-white">{email}</span>
          </p>
        ) : (
          <p className="text-neutral-400 mt-1 text-xs sm:text-sm">
            Create a new password for your account
          </p>
        )}
      </div>

      <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-5 sm:p-7 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password */}
          <div>
            <Input
              label="New Password"
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              leftIcon={<Lock size={18} />}
              {...register('newPassword')}
              error={errors.newPassword?.message}
              disabled={resetMutation.isPending}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-neutral-300 pointer-events-auto"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </div>

          {/* Confirm Password */}
          <div>
            <Input
              label="Confirm New Password"
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              leftIcon={<Lock size={18} />}
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              disabled={resetMutation.isPending}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="hover:text-neutral-300 pointer-events-auto"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </div>

          {/* Error display */}
          {resetMutation.error && (
            <div className="flex items-start gap-2 p-3 rounded-xl border border-error/30 bg-error/10" role="alert">
              <AlertTriangle size={16} className="text-error mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-neutral-200">{resetMutation.error.message}</p>
              </div>
            </div>
          )}

          {/* Password requirements */}
          <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800">
            <p className="text-xs font-medium text-neutral-300 mb-2">Password requirements:</p>
            <ul className="text-xs text-neutral-400 space-y-1">
              <li className={newPassword?.length >= 6 ? 'text-emerald-400' : ''}>
                • At least 6 characters
              </li>
            </ul>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={resetMutation.isPending || !newPassword}
            className="w-full mt-2 bg-[#FF2E4D] hover:bg-[#e02441] text-white"
          >
            {resetMutation.isPending ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>
      </div>

      <p className="text-center text-xs text-neutral-500 mt-6">
        <Link to="/login" className="text-neutral-400 hover:text-white transition-colors">
          Back to login
        </Link>
      </p>
    </motion.div>
  )
}
