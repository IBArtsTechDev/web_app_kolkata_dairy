import { Heart } from 'lucide-react'
import { useEngagementLookup, useToggleFavorite } from '@/hooks/useEngagement'
import { cn } from '@/lib/utils'
import type { EntityType } from '@/types'

interface FavoriteButtonProps {
  entityType: EntityType
  entityId: string
  entityTitle?: string
  className?: string
  size?: number
  variant?: 'badge' | 'button' | 'icon'
  showText?: boolean
}

export function FavoriteButton({
  entityType,
  entityId,
  entityTitle,
  className,
  size = 18,
  variant = 'badge',
  showText = false,
}: FavoriteButtonProps) {
  const { isFavorited } = useEngagementLookup()
  const toggleFavorite = useToggleFavorite()
  const active = isFavorited(entityType, entityId)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite.mutate({ entityType, entityId, entityTitle })
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={toggleFavorite.isPending}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border',
          active
            ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 hover:bg-rose-500/20'
            : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700',
          toggleFavorite.isPending && 'opacity-60 cursor-not-allowed',
          className,
        )}
        aria-label={active ? `Remove ${entityTitle || 'item'} from favorites` : `Add ${entityTitle || 'item'} to favorites`}
        aria-pressed={active}
      >
        <Heart
          size={size}
          className={cn(
            'transition-transform duration-200',
            active && 'fill-rose-500 text-rose-500 scale-110',
          )}
        />
        <span>{active ? 'Favorited' : 'Favorite'}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggleFavorite.isPending}
      className={cn(
        'w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md',
        active
          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
          : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80 border border-white/10',
        toggleFavorite.isPending && 'opacity-60 cursor-not-allowed',
        className,
      )}
      aria-label={active ? `Remove ${entityTitle || 'item'} from favorites` : `Add ${entityTitle || 'item'} to favorites`}
      aria-pressed={active}
    >
      <Heart
        size={size}
        className={cn(
          'transition-transform duration-200',
          active && 'fill-rose-500 text-rose-500 scale-110',
        )}
      />
      {showText && <span className="ml-1.5 text-xs font-medium">{active ? 'Liked' : 'Like'}</span>}
    </button>
  )
}
