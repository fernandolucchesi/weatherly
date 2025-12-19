'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type {
  Weather,
  WeatherCondition,
  HourlyForecast,
  DailyForecast,
} from '@/types'
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudFog,
  Zap,
  Droplets,
} from 'lucide-react'

/**
 * Maps weather condition codes to icon components
 */
function getWeatherIcon(
  condition: WeatherCondition,
  isDay?: boolean,
  size: 'sm' | 'md' | 'lg' = 'md',
) {
  const sizeClass =
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-12 w-12' : 'h-6 w-6'
  const iconColor = isDay === false ? 'text-blue-400' : 'text-yellow-500'

  switch (condition) {
    case 'clear':
      return <Sun className={`${sizeClass} ${iconColor}`} />
    case 'cloudy':
      return <Cloud className={`${sizeClass} text-gray-400`} />
    case 'rain':
      return <CloudRain className={`${sizeClass} text-blue-500`} />
    case 'snow':
      return <CloudSnow className={`${sizeClass} text-blue-200`} />
    case 'fog':
      return <CloudFog className={`${sizeClass} text-gray-300`} />
    case 'thunder':
      return <Zap className={`${sizeClass} text-yellow-400`} />
    default:
      return <Cloud className={`${sizeClass} text-gray-400`} />
  }
}

/**
 * Maps weather condition codes to display labels
 */
function getWeatherLabel(condition: WeatherCondition): string {
  switch (condition) {
    case 'clear':
      return 'Clear'
    case 'cloudy':
      return 'Cloudy'
    case 'rain':
      return 'Rain'
    case 'snow':
      return 'Snow'
    case 'fog':
      return 'Fog'
    case 'thunder':
      return 'Thunderstorm'
    default:
      return 'Unknown'
  }
}

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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Select a city to view weather information
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weather</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  )
}

/**
 * Formats current time for display in the location's timezone (24-hour format)
 */
function formatCurrentTime(timezone?: string): string {
  const now = new Date()

  if (timezone) {
    return now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  // Fallback to local time if no timezone provided
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Formats time to display hour in 24-hour format using location's timezone (e.g., "14:00")
 */
function formatHour(time: string, timezone?: string): string {
  const date = new Date(time)

  if (timezone) {
    // Format using the location's timezone
    const hour = date
      .toLocaleString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        hour12: false,
      })
      .split(':')[0]
      .padStart(2, '0')
    return `${hour}:00`
  }

  // Fallback to local timezone
  const hour = date.getHours().toString().padStart(2, '0')
  return `${hour}:00`
}

/**
 * Formats date to display day name (e.g., "Mon", "Tue")
 * Dates from Open-Meteo are in ISO format and should be treated as local dates
 */
function formatDayName(date: string): string {
  // Parse date as YYYY-MM-DD and treat as local date
  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  return dateObj.toLocaleDateString('en-US', { weekday: 'short' })
}

/**
 * Formats date to display as "Mon, Jan 1"
 * Dates from Open-Meteo are in ISO format and should be treated as local dates
 */
function formatDate(date: string): string {
  // Parse date as YYYY-MM-DD and treat as local date
  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Checks if a date string (YYYY-MM-DD) is today
 */
function isToday(date: string): boolean {
  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  const today = new Date()
  return (
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getDate() === today.getDate()
  )
}

function HourlyForecastSection({
  hourly,
  timezone,
}: {
  hourly: HourlyForecast[]
  timezone?: string
}) {
  // Filter to only show future hours
  // hour.time is in ISO format, so we can compare directly
  const now = new Date()

  const futureHours = hourly.filter((hour) => {
    const hourTime = new Date(hour.time)
    console.log(hour.time, now)
    return hourTime >= now
  })

  // If no future hours, show all (edge case)
  const displayHours =
    futureHours.length > 0 ? futureHours : hourly.slice(0, 24)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        {futureHours.length > 0 ? '24-Hour Forecast' : "Today's Forecast"}
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
        {displayHours.map((hour, index) => (
          <div
            key={`${hour.time}-${index}`}
            className="flex min-w-[80px] flex-col items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <span className="text-xs font-medium text-muted-foreground">
              {formatHour(hour.time, timezone)}
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

function DailyForecastSection({ daily }: { daily: DailyForecast[] }) {
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
                {getWeatherIcon(day.conditionCode, true, 'sm')}
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
