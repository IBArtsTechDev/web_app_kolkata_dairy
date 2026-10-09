import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/common/Input'
import { useForgotPasswordRequest } from '@/hooks/useForgotPassword'

const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address').max(150),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordRequestProps {
  onSuccess?: () => void
  onBack?: () => void
}

export function ForgotPasswordRequest({ onSuccess, onBack }: ForgotPasswordRequestProps) {
  const [submitted, setSubmitted] = useState(false)
  const mutation = useForgotPasswordRequest()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const email = watch('email')

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        setSubmitted(true)
        reset()
        setTimeout(() => {
          onSuccess?.()
        }, 2000)
      },
    })
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold text-white">Check your email</h3>
        <p className="text-sm text-neutral-400">
          If an account exists with this email, you will receive a password reset link shortly.
        </p>
        <p className="text-xs text-neutral-500">The link will expire in 15 minutes.</p>
        <Button
          type="button"
          onClick={onBack}
          className="w-full mt-6 bg-neutral-800 hover:bg-neutral-700 text-white"
        >
          Back to Login
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        leftIcon={<Mail size={18} />}
        error={errors.email?.message}
        {...register('email')}
        disabled={mutation.isPending}
      />

      {mutation.error && (
        <div className="flex items-start gap-2 p-3 rounded-xl border border-error/30 bg-error/10" role="alert">
          <AlertTriangle size={16} className="text-error mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-neutral-200">{mutation.error.message}</p>
            {mutation.error.errorCode === 'FORGOT_PASSWORD_RATE_LIMITED' && (
              <p className="text-xs text-error/80 mt-1">
                Please wait a while before requesting another reset link.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          onClick={onBack}
          disabled={mutation.isPending}
          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending || !email}
          className="flex-1 bg-[#FF2E4D] hover:bg-[#e02441] text-white flex items-center justify-center gap-2"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending</span>
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </div>
    </form>
  )
}
