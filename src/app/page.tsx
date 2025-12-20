'use client'

import { WeatherDisplay } from '@/components/weather'
import { useWeatherContext } from '@/contexts/weather-context'
import { RecentSearches } from '@/components/recent-searches'

export default function Home() {
  const { weather, loading, error } = useWeatherContext()

  return (
    <div className="flex min-h-svh justify-center bg-background font-sans pb-16">
      <main className="flex w-full max-w-7xl flex-col gap-8 px-6 py-16 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 w-full">
          <div className="lg:col-span-3">
            <WeatherDisplay weather={weather} loading={loading} error={error} />
          </div>

          <div className="lg:col-span-2">
            <RecentSearches />
          </div>
        </div>
      </main>
    </div>
  )
}
