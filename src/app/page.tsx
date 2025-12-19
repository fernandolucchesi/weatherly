'use client'

import { CitySearch } from '@/components/city-search'
import { WeatherDisplay } from '@/components/weather-display'
import { ThemeToggle } from '@/components/theme-toggle'
import { useWeather } from '@/hooks/useWeather'
import type { City } from '@/types'

export default function Home() {
  const { weather, loading, error, fetchWeather } = useWeather()

  const handleCitySelect = (city: City) => {
    const locationName = [city.name, city.admin1, city.country]
      .filter(Boolean)
      .join(', ')
    fetchWeather(city.lat, city.lon, locationName)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex w-full max-w-2xl flex-col gap-8 py-16 px-6 sm:px-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
              Weatherly
            </h1>
            <p className="text-sm text-muted-foreground">
              Search for cities and view weather information
            </p>
          </div>
          <ThemeToggle />
        </div>
        <CitySearch onCitySelect={handleCitySelect} />
        <WeatherDisplay weather={weather} loading={loading} error={error} />
      </main>
    </div>
  )
}
