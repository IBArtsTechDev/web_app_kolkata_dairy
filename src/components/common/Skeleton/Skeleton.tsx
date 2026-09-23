import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2" style={{ width }} aria-busy="true" aria-label="Loading...">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 bg-neutral-800 rounded animate-pulse',
              i === lines - 1 && 'w-3/4',
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-neutral-800 animate-pulse',
        variant === 'text' && 'h-4 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-xl',
        className,
      )}
      style={{ width, height }}
      aria-busy="true"
      aria-label="Loading..."
    />
  )
}

/** Event card skeleton for loading states */
export function EventCardSkeleton() {
  return (
    <div className="bg-[#141414] rounded-2xl overflow-hidden shadow-sm">
      <Skeleton variant="rectangular" className="w-full h-44" />
      <div className="p-4 space-y-3">
        <Skeleton width="60%" height={20} />
        <Skeleton lines={2} />
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton width="30%" />
        </div>
      </div>
    </div>
  )
}
