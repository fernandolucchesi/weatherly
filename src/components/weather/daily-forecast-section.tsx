import { Droplets } from 'lucide-react'
import type { DailyForecast } from '@/types'
import { getWeatherIcon } from './utils/weather-icons'
import { formatDayName, formatDate, isToday } from './utils/date-formatters'

interface DailyForecastSectionProps {
  daily: DailyForecast[]
}

export function DailyForecastSection({ daily }: DailyForecastSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">7-Day Forecast</h3>
      <div className="space-y-1.5">
        {daily.map((day, index) => (
          <div
            key={`${day.date}-${index}`}
            className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                {getWeatherIcon(day.weatherCode, true, 'sm')}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {isToday(day.date) ? 'Today' : formatDayName(day.date)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(day.date)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {day.precipitationProbability !== undefined &&
                day.precipitationProbability > 0 && (
                  <div className="flex items-center gap-1 text-xs font-medium text-blue-500">
                    <Droplets className="h-3 w-3" />
                    <span>{day.precipitationProbability}%</span>
                  </div>
                )}
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold text-foreground">
                  {Math.round(day.temperatureMaxC)}°
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(day.temperatureMinC)}°
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
