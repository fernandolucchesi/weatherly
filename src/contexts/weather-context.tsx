'use client'

import { createContext, useContext, useCallback, type ReactNode } from 'react'
import type { City } from '@/types'
import { useWeather } from '@/hooks/useWeather'

interface WeatherContextType {
  weather: ReturnType<typeof useWeather>['weather']
  loading: boolean
  error: string | null
  handleCitySelect: (city: City) => void
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

export function WeatherProvider({ children }: { children: ReactNode }) {
  const { weather, loading, error, fetchWeather } = useWeather()

  const handleCitySelect = useCallback(
    (city: City) => {
      const locationName = [city.name, city.admin1, city.country]
        .filter(Boolean)
        .join(', ')
      fetchWeather(city.lat, city.lon, locationName)
    },
    [fetchWeather],
  )

  return (
    <WeatherContext.Provider
      value={{ weather, loading, error, handleCitySelect }}
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
