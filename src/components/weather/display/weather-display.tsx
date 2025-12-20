'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import type { Weather } from '@/types'
import { getCurrentHourString, isToday } from '../utils/date-formatters'
import { WeatherHeader } from './weather-header'
import { WeatherHero } from './weather-hero'
import { WeatherMetrics } from './weather-metrics'
import { HourlyForecastSection } from '../sections/hourly-forecast-section'
import { DailyForecastSection } from '../sections/daily-forecast-section'

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
        <div className="px-6 pt-6">
          <div className="flex flex-col gap-1 items-center text-center">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20 mt-1" />
          </div>
        </div>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center gap-6 py-4">
            <Skeleton className="h-20 w-20 rounded-full opacity-75" />
            <Skeleton className="h-24 w-32" />
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
          {/* 24-Hour Forecast skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="flex min-w-[80px] flex-col items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
            <Skeleton className="mt-4 h-5 w-32" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
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
        <CardContent>
          <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
            Select a city to view weather information
          </p>
        </CardContent>
      </Card>
    )
  }

  // Get current precipitation and humidity from hourly forecast
  // Use the same logic as HourlyForecastSection to find the current/first future hour
  let currentHourly = weather.hourly?.[0]
  if (weather.hourly) {
    const currentHourString = getCurrentHourString(weather.timezone)
    const currentHourDate = new Date(currentHourString + ':00')

    // Find the first hour that is >= current hour
    for (let i = 0; i < weather.hourly.length; i++) {
      const hourDate = new Date(weather.hourly[i].time)
      hourDate.setMinutes(0, 0, 0)

      if (hourDate >= currentHourDate) {
        currentHourly = weather.hourly[i]
        break
      }
    }
  }
  const currentPrecipitation = currentHourly?.precipitation
  const currentHumidity = currentHourly?.humidity

  // Get today's daily forecast for min/max temperatures
  const todayForecast = weather.daily?.find((day) => isToday(day.date))

  return (
    <Card className="w-full">
      <WeatherHeader
        locationName={weather.locationName}
        weatherCode={weather.weatherCode}
        timezone={weather.timezone}
      />

      <CardContent className="space-y-6">
        <WeatherHero
          temperatureC={weather.temperatureC}
          weatherCode={weather.weatherCode}
          isDay={weather.isDay}
          todayForecast={todayForecast}
        />

        <WeatherMetrics
          precipitation={currentPrecipitation}
          humidity={currentHumidity}
        />

        {weather.hourly && weather.hourly.length > 0 && (
          <HourlyForecastSection
            hourly={weather.hourly}
            timezone={weather.timezone}
          />
        )}

        {weather.daily && weather.daily.length > 0 && (
          <DailyForecastSection daily={weather.daily} />
        )}
      </CardContent>
    </Card>
  )
}
