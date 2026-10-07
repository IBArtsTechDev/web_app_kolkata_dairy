import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useAppContext, type Toast } from '@/context'
import { cn } from '@/lib/utils'

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const colorStyles = {
  success: 'bg-[#15231b] border-emerald-500/30 text-emerald-300',
  error: 'bg-[#291415] border-red-500/30 text-red-300',
  info: 'bg-[#141b29] border-blue-500/30 text-blue-300',
  warning: 'bg-[#282115] border-amber-500/30 text-amber-300',
}

export function ToastContainer() {
  const { toasts, removeToast } = useAppContext()

  return (
    <div
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toasts.map((toast: Toast) => {
          const Icon = icons[toast.type] || Info
          const style = colorStyles[toast.type] || colorStyles.info

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md',
                style,
              )}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm font-medium text-neutral-100">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-neutral-400 hover:text-white transition-colors p-0.5 shrink-0"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
