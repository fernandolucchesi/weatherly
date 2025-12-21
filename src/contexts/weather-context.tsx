'use client'

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import type { City } from '@/types'
import { useWeather } from '@/hooks/useWeather'
import { useRecentSearches } from '@/hooks/useRecentSearches'
import { useInitialLocation } from '@/hooks/useInitialLocation'

interface WeatherContextType {
  weather: ReturnType<typeof useWeather>['weather']
  loading: boolean
  error: string | null
  handleCitySelect: (city: City) => void
  recentSearches: ReturnType<typeof useRecentSearches>['recentSearches']
  locationStatus: string
  retryInitialLocation: () => void
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

export function WeatherProvider({ children }: { children: ReactNode }) {
  const { weather, loading, error, fetchWeather } = useWeather()
  const { addRecentSearch, recentSearches } = useRecentSearches()
  const { locationStatus, retryInitialLocation } =
    useInitialLocation(fetchWeather)
  const lastSelectedCity = useRef<City | null>(null)

  const handleCitySelect = useCallback(
    (city: City) => {
      lastSelectedCity.current = city
      const locationName = [city.name, city.admin1, city.country]
        .filter(Boolean)
        .join(', ')
      fetchWeather(city.lat, city.lon, locationName)
    },
    [fetchWeather],
  )

  // Track when weather is successfully fetched after a city selection
  useEffect(() => {
    if (weather && lastSelectedCity.current && !loading && !error) {
      addRecentSearch(lastSelectedCity.current, weather)
      lastSelectedCity.current = null
    }
  }, [weather, loading, error, addRecentSearch])

  return (
    <WeatherContext.Provider
      value={{
        weather,
        loading,
        error,
        handleCitySelect,
        recentSearches,
        locationStatus,
        retryInitialLocation,
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeatherContext() {
  const context = useContext(WeatherContext)
  if (context === undefined) {
    throw new Error('useWeatherContext must be used within a WeatherProvider')
  }
  return context
}
