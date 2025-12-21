'use client'

import { WeatherDisplay } from '@/components/weather'
import { useWeatherContext } from '@/contexts/weather-context'
import { RecentSearches } from '@/components/recent-searches'
import { OutfitRecommendations } from '@/components/outfit-recommendations'
import { ActivitySuggestions } from '@/components/activity-suggestions'

export default function Home() {
  const { weather, loading, error, locationStatus, retryInitialLocation } =
    useWeatherContext()

  return (
    <div className="flex min-h-[calc(100svh-150px)] justify-center bg-background font-sans">
      <main className="flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 w-full">
          <div className="lg:col-span-2 order-3 lg:order-1">
            <RecentSearches />
          </div>
          <div className="lg:col-span-3 order-1 lg:order-2">
            <WeatherDisplay
              weather={weather}
              loading={loading}
              error={error}
              locationStatus={locationStatus}
              onRetryLocation={retryInitialLocation}
            />
          </div>

          <div className="lg:col-span-2 order-2 lg:order-3 space-y-4">
            <OutfitRecommendations weather={weather} />
            <ActivitySuggestions weather={weather} />
          </div>
        </div>
      </main>
    </div>
  )
}
