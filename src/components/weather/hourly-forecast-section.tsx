import { Droplets } from 'lucide-react'
import type { HourlyForecast } from '@/types'
import { getWeatherIcon } from './utils/weather-icons'
import { formatHour, getCurrentHourString } from './utils/date-formatters'

interface HourlyForecastSectionProps {
  hourly: HourlyForecast[]
  timezone?: string
}

export function HourlyForecastSection({
  hourly,
  timezone,
}: HourlyForecastSectionProps) {
  const currentHourString = getCurrentHourString(timezone)

  // Filter out past hours
  let currentHourIndex = -1
  const futureHours: HourlyForecast[] = []

  for (let i = 0; i < hourly.length; i++) {
    const hourTime = hourly[i].time
    const hourMatch = hourTime.match(/^(\d{4}-\d{2}-\d{2}T\d{2}):\d{2}/)
    const hourString = hourMatch ? hourMatch[1] : ''

    if (hourString >= currentHourString) {
      if (currentHourIndex === -1 && hourString === currentHourString) {
        currentHourIndex = futureHours.length
      }
      futureHours.push(hourly[i])
    }
  }

  const displayHours = futureHours.slice(0, 25)

  const formatTimeLabel = (hour: HourlyForecast, index: number): string => {
    if (index === 0) {
      const hourMatch = hour.time.match(/^(\d{4}-\d{2}-\d{2}T\d{2}):\d{2}/)
      const hourString = hourMatch ? hourMatch[1] : ''
      if (hourString === currentHourString) {
        return 'Now'
      }
    }
    return formatHour(hour.time)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        24-Hour Forecast
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
        {displayHours.map((hour, index) => (
          <div
            key={`${hour.time}-${index}`}
            className="flex min-w-[80px] flex-col items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <span className="text-xs font-medium text-muted-foreground">
              {formatTimeLabel(hour, index)}
            </span>
            <div className="flex items-center justify-center">
              {getWeatherIcon(hour.conditionCode, hour.isDay, 'sm')}
            </div>
            <span className="text-sm font-semibold text-foreground">
              {Math.round(hour.temperatureC)}°
            </span>
            {hour.precipitation !== undefined && hour.precipitation > 0 && (
              <div className="flex items-center gap-0.5 text-xs text-blue-500">
                <Droplets className="h-3 w-3" />
                <span>{hour.precipitation.toFixed(1)}mm</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
