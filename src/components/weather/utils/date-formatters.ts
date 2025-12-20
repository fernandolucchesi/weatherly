// Formats current time in location timezone (24-hour format)
export function formatCurrentTime(timezone: string): string {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// Formats current date in short format (e.g., "Mon, Jan 15")
export function formatCurrentDateShort(timezone: string): string {
  return new Date().toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// Helper: Parses date string (YYYY-MM-DD) to Date object
function parseDateString(date: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Formats hour from ISO time string (e.g., "14:00")
export function formatHour(time: string): string {
  const hourMatch = time.match(/T(\d{2}):\d{2}/)
  return hourMatch ? `${hourMatch[1]}:00` : '00:00'
}

// Formats date to day name (e.g., "Mon")
export function formatDayName(date: string): string {
  return parseDateString(date).toLocaleDateString('en-US', {
    weekday: 'short',
  })
}

// Formats date as "Mon, Jan 1"
export function formatDate(date: string): string {
  return parseDateString(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// Checks if date is today
export function isToday(date: string): boolean {
  const dateObj = parseDateString(date)
  const today = new Date()
  return (
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getDate() === today.getDate()
  )
}

// Gets current hour string in location timezone (format: YYYY-MM-DDTHH:00)
export function getCurrentHourString(timezone: string): string {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
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
