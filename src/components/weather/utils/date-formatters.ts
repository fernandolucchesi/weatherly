// Formats current time in location timezone
export function formatCurrentTime(timezone?: string): string {
  const now = new Date()

  if (timezone) {
    return now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  // Fallback to local time
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// Formats hour from ISO time string (e.g., "14:00")
export function formatHour(time: string): string {
  // Extract hour from ISO string
  const hourMatch = time.match(/T(\d{2}):\d{2}/)
  if (hourMatch) {
    return `${hourMatch[1]}:00`
  }

  // Fallback
  return '00:00'
}

// Formats date to day name (e.g., "Mon")
export function formatDayName(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  return dateObj.toLocaleDateString('en-US', { weekday: 'short' })
}

// Formats date as "Mon, Jan 1"
export function formatDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// Checks if date is today
export function isToday(date: string): boolean {
  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  const today = new Date()
  return (
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getDate() === today.getDate()
  )
}

// Gets current hour string in location timezone
export function getCurrentHourString(tz?: string): string {
  const now = new Date()
  if (!tz) {
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hour = String(now.getHours()).padStart(2, '0')
    return `${year}-${month}-${day}T${hour}:00`
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(now)
  const year = parts.find((p) => p.type === 'year')?.value || ''
  const month = parts.find((p) => p.type === 'month')?.value || ''
  const day = parts.find((p) => p.type === 'day')?.value || ''
  const hour = parts.find((p) => p.type === 'hour')?.value || ''

  return `${year}-${month}-${day}T${hour.padStart(2, '0')}:00`
}
