import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User as UserIcon, AlertTriangle, Phone, Eye, EyeOff } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'
import { useLogin, useRegister } from '@/hooks/useAuth'
import { AvatarPicker } from './AvatarPicker'
import { useAppContext } from '@/context'

const loginSchema = z.object({
  email: z.string().trim().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Valid email required').max(150),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().trim().max(20).optional().or(z.literal('')),
})

type LoginData = z.infer<typeof loginSchema>
type RegisterData = z.infer<typeof registerSchema>

type AuthTab = 'login' | 'register'

export function AuthModal() {
  const isAuthModalOpen = useAppStore((state) => state.isAuthModalOpen)
  const closeAuthModal = useAppStore((state) => state.closeAuthModal)
  const [activeTab, setActiveTab] = useState<AuthTab>('login')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const { addToast } = useAppContext()

  const loginMutation = useLogin()
  const registerMutation = useRegister()

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterForm,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  })

  const handleClose = () => {
    closeAuthModal()
    resetLoginForm()
    resetRegisterForm()
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        addToast({ message: 'Welcome back! Signed in successfully.', type: 'success' })
        handleClose()
      },
    })
  }

  const onRegister = (data: RegisterData) => {
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
          handleClose()
        },
      }
    )
  }

  const currentError =
    (activeTab === 'login' && loginMutation.error?.message) ||
    (activeTab === 'register' && registerMutation.error?.message)

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={handleClose}
      title={activeTab === 'login' ? 'Sign In to Your Account' : 'Create Your Account'}
      size="sm"
    >
      <div className="space-y-4">
        {/* Tab switchers */}
        <div className="flex rounded-xl bg-neutral-900 p-1 border border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'login'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'register'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error notification */}
        {currentError && (
          <div className="flex items-start gap-2 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs">
            <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
            <p>{currentError}</p>
          </div>
        )}

        {/* Tab 1: Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-3.5" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
              error={loginErrors.email?.message}
              {...loginRegister('email')}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-neutral-300">Password</label>
                <Link
                  to="/auth/forgot-password"
                  onClick={handleClose}
                  className="text-xs text-neutral-400 hover:text-[#FF2E4D] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock size={16} />}
                error={loginErrors.password?.message}
                {...loginRegister('password')}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-neutral-300 pointer-events-auto"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#FF2E4D] hover:bg-[#e02441] text-white mt-2"
            >
              {loginMutation.isPending ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        )}

        {/* Tab 2: Register */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-3.5" noValidate>
            <AvatarPicker
              file={avatarFile}
              previewUrl={avatarPreview}
              onChange={(file, preview) => {
                setAvatarFile(file)
                setAvatarPreview(preview)
              }}
              disabled={registerMutation.isPending}
            />

            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              leftIcon={<UserIcon size={16} />}
              error={registerErrors.name?.message}
              {...registerRegister('name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
              error={registerErrors.email?.message}
              {...registerRegister('email')}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+91 98765 43210"
              leftIcon={<Phone size={16} />}
              error={registerErrors.phoneNumber?.message}
              {...registerRegister('phoneNumber')}
            />

            <Input
              label="Password (min 6 chars)"
              type={showRegisterPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              error={registerErrors.password?.message}
              {...registerRegister('password')}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="hover:text-neutral-300 pointer-events-auto"
                >
                  {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-[#FF2E4D] hover:bg-[#e02441] text-white mt-2"
            >
              {registerMutation.isPending ? 'Creating Account…' : 'Create Account'}
            </Button>
          </form>
        )}
      </div>
    </Modal>
  )
}
