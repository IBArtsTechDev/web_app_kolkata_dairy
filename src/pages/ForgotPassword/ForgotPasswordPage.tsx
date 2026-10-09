import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ForgotPasswordRequest } from '@/components/auth/ForgotPasswordRequest'

export function ForgotPasswordPage() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/login', { replace: true })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[420px] mx-auto py-8 sm:py-12 px-4"
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Forgot Password</h1>
        <p className="text-neutral-400 mt-1 text-xs sm:text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-5 sm:p-7 shadow-xl">
        <ForgotPasswordRequest onBack={handleBack} />
      </div>

      <p className="text-center text-xs text-neutral-500 mt-6">
        <Link to="/login" className="text-neutral-400 hover:text-white transition-colors">
          Back to login
        </Link>
      </p>
    </motion.div>
  )
}
