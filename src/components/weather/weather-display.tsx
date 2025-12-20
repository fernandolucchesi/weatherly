'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Weather } from '@/types'
import { getWeatherIcon, getWeatherLabel } from './utils/weather-icons'
import { formatCurrentTime } from './utils/date-formatters'
import { HourlyForecastSection } from './hourly-forecast-section'
import { DailyForecastSection } from './daily-forecast-section'

interface WeatherDisplayProps {
  weather: Weather | null
  loading: boolean
  error: string | null
}

export function WeatherDisplay({
  weather,
  loading,
  error,
}: WeatherDisplayProps) {
  if (loading) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-32" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="w-full">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Select a city to view weather information
        </p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-foreground">
            {weather.locationName}
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="w-fit">
              {getWeatherLabel(weather.conditionCode)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatCurrentTime(weather.timezone)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {getWeatherIcon(weather.conditionCode, weather.isDay, 'lg')}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-foreground">
          {Math.round(weather.temperatureC)}
        </span>
        <span className="text-xl text-muted-foreground">°C</span>
      </div>

      {weather.isDay !== undefined && (
        <p className="text-sm text-muted-foreground">
          {weather.isDay ? 'Daytime' : 'Nighttime'}
        </p>
      )}

      {weather.hourly && weather.hourly.length > 0 && (
        <>
          <Separator />
          <HourlyForecastSection
            hourly={weather.hourly}
            timezone={weather.timezone}
          />
        </>
      )}

      {weather.daily && weather.daily.length > 0 && (
        <>
          <Separator />
          <DailyForecastSection daily={weather.daily} />
        </>
      )}
    </div>
  )
}
