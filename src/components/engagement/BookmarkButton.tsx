import { Bookmark } from 'lucide-react'
import { useEngagementLookup, useToggleBookmark } from '@/hooks/useEngagement'
import { cn } from '@/lib/utils'
import type { EntityType } from '@/types'

interface BookmarkButtonProps {
  entityType: EntityType
  entityId: string
  entityTitle?: string
  className?: string
  size?: number
  variant?: 'badge' | 'button' | 'icon'
  showText?: boolean
}

export function BookmarkButton({
  entityType,
  entityId,
  entityTitle,
  className,
  size = 18,
  variant = 'badge',
  showText = false,
}: BookmarkButtonProps) {
  const { isBookmarked } = useEngagementLookup()
  const toggleBookmark = useToggleBookmark()
  const active = isBookmarked(entityType, entityId)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    toggleBookmark.mutate({ entityType, entityId, entityTitle })
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={toggleBookmark.isPending}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border',
          active
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
            : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700',
          toggleBookmark.isPending && 'opacity-60 cursor-not-allowed',
          className,
        )}
        aria-label={active ? `Remove ${entityTitle || 'item'} from bookmarks` : `Bookmark ${entityTitle || 'item'}`}
        aria-pressed={active}
      >
        <Bookmark
          size={size}
          className={cn(
            'transition-transform duration-200',
            active && 'fill-amber-400 scale-110',
          )}
        />
        <span>{active ? 'Bookmarked' : 'Bookmark'}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggleBookmark.isPending}
      className={cn(
        'w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md',
        active
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
          : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80 border border-white/10',
        toggleBookmark.isPending && 'opacity-60 cursor-not-allowed',
        className,
      )}
      aria-label={active ? `Remove ${entityTitle || 'item'} from bookmarks` : `Bookmark ${entityTitle || 'item'}`}
      aria-pressed={active}
    >
      <Bookmark
        size={size}
        className={cn(
          'transition-transform duration-200',
          active && 'fill-amber-400 scale-110',
        )}
      />
      {showText && <span className="ml-1.5 text-xs font-medium">{active ? 'Saved' : 'Save'}</span>}
    </button>
  )
}
