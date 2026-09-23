import { format, formatDistanceToNow, isPast, isToday, isTomorrow, parseISO } from 'date-fns'

/** Format event date range */
export function formatDateRange(start: string, end: string): string {
  const startDate = parseISO(start)
  const endDate = parseISO(end)

  if (isToday(startDate)) {
    return `Today, ${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`
  }

  if (isTomorrow(startDate)) {
    return `Tomorrow, ${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`
  }

  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'd, yyyy')}`
  }

  return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
}

/** Format a single date */
export function formatDate(date: string, formatStr = 'MMM d, yyyy'): string {
  return format(parseISO(date), formatStr)
}

/** Format date with time */
export function formatDateTime(date: string): string {
  return format(parseISO(date), 'MMM d, yyyy · h:mm a')
}

/** Get relative time (e.g., "in 2 days") */
export function getRelativeTime(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true })
}

/** Check if an event has already ended */
export function isEventPast(endDate: string): boolean {
  return isPast(parseISO(endDate))
}

/** Get event status label */
export function getEventStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Draft',
    published: 'Live',
    cancelled: 'Cancelled',
    completed: 'Completed',
  }
  return labels[status] || status
}

/** Get event status color classes */
export function getEventStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-surface-200 text-surface-700',
    published: 'bg-success/15 text-success',
    cancelled: 'bg-error/15 text-error',
    completed: 'bg-info/15 text-info',
  }
  return colors[status] || 'bg-surface-200 text-surface-700'
}
