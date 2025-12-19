'use client'

import { WeatherDisplay } from '@/components/weather'
import { useWeatherContext } from '@/contexts/weather-context'

export default function Home() {
  const { weather, loading, error } = useWeatherContext()

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background font-sans">
      <main className="flex w-full max-w-2xl flex-col gap-8 px-6 py-16 sm:px-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
            Weather Forecast
          </h1>
          <p className="text-sm text-muted-foreground">
            Search for a city in the header to view weather information
          </p>
        </div>
        <WeatherDisplay weather={weather} loading={loading} error={error} />
      </main>
    </div>
  )
}
