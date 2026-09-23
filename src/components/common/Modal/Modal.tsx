import { Fragment, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'full'
  showClose?: boolean
}

const sizeClasses = {
  sm: 'max-w-[384px]',
  md: 'max-w-[512px]',
  lg: 'max-w-[672px]',
  full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)]',
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'relative w-full bg-[#141414] rounded-t-2xl sm:rounded-2xl shadow-xl',
                'max-h-[90dvh] overflow-y-auto',
                'safe-area-bottom',
                sizeClasses[size],
              )}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              {/* Header */}
              {(title || showClose) && (
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-[#141414]/80 backdrop-blur-sm">
                  {title && (
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                  )}
                  {showClose && (
                    <button
                      onClick={onClose}
                      className="p-2 -m-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                      aria-label="Close modal"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="p-4 sm:p-5">{children}</div>
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  )
}
