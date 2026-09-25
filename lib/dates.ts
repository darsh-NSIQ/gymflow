import { addDays, addMonths, addYears, format, parseISO, differenceInDays, isBefore, isAfter, isSameDay } from 'date-fns'

/**
 * Calculates membership end_date based on DEC-03:
 * end_date = start_date + plan duration - 1 day (inclusive).
 */
export function calculateMembershipEndDate(
  startDateStr: string,
  durationValue: number,
  durationUnit: 'days' | 'months' | 'years'
): string {
  const start = parseISO(startDateStr)
  let targetDate: Date

  if (durationUnit === 'days') {
    targetDate = addDays(start, durationValue)
  } else if (durationUnit === 'months') {
    targetDate = addMonths(start, durationValue)
  } else {
    targetDate = addYears(start, durationValue)
  }

  // Subtract 1 day for inclusive range
  const endDate = addDays(targetDate, -1)
  return format(endDate, 'yyyy-MM-dd')
}

export function getDaysRemaining(endDateStr: string, todayStr?: string): number {
  const end = parseISO(endDateStr)
  const today = todayStr ? parseISO(todayStr) : new Date()

  const diff = differenceInDays(end, today)
  return Math.max(0, diff)
}

export function isMembershipActive(
  startDateStr: string,
  endDateStr: string,
  todayStr?: string
): boolean {
  const start = parseISO(startDateStr)
  const end = parseISO(endDateStr)
  const today = todayStr ? parseISO(todayStr) : new Date()

  return (
    (isAfter(today, start) || isSameDay(today, start)) &&
    (isBefore(today, end) || isSameDay(today, end))
  )
}

export function formatDateDisplay(dateStr: string, formatPattern = 'dd/MM/yyyy'): string {
  if (!dateStr) return '-'
  try {
    return format(parseISO(dateStr), formatPattern)
  } catch {
    return dateStr
  }
}
