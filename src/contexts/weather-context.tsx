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

interface WeatherContextType {
  weather: ReturnType<typeof useWeather>['weather']
  loading: boolean
  error: string | null
  handleCitySelect: (city: City) => void
  recentSearches: ReturnType<typeof useRecentSearches>['recentSearches']
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

interface GeoApiResponse {
  data?: {
    lat: number
    lon: number
    accuracy: 'approx' | 'default'
  }
  error?: {
    code: string
    message: string
  }
}

interface ReverseGeocodeApiResponse {
  data?: {
    locationName: string | null
  }
  error?: {
    code: string
    message: string
  }
}

export function WeatherProvider({ children }: { children: ReactNode }) {
  const { weather, loading, error, fetchWeather } = useWeather()
  const { addRecentSearch, recentSearches } = useRecentSearches()
  const hasInitialized = useRef(false)
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

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          try {
            const response = await fetch(
              `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`,
            )
            const data: ReverseGeocodeApiResponse = await response.json()

            if (response.ok && data.data?.locationName) {
              fetchWeather(latitude, longitude, data.data.locationName)
            } else {
              fetchWeather(
                latitude,
                longitude,
                `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
              )
            }
          } catch {
            fetchWeather(
              latitude,
              longitude,
              `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
            )
          }
        },
        async () => {
          try {
            const response = await fetch('/api/geo')
            const data: GeoApiResponse = await response.json()

            if (response.ok && data.data) {
              const { lat, lon } = data.data

              if (data.data.accuracy === 'default') {
                fetchWeather(lat, lon, 'Oslo, Norway')
              } else {
                try {
                  const reverseResponse = await fetch(
                    `/api/reverse-geocode?lat=${lat}&lon=${lon}`,
                  )
                  const reverseData: ReverseGeocodeApiResponse =
                    await reverseResponse.json()

                  if (reverseResponse.ok && reverseData.data?.locationName) {
                    fetchWeather(lat, lon, reverseData.data.locationName)
                  } else {
                    fetchWeather(
                      lat,
                      lon,
                      `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
                    )
                  }
                } catch {
                  fetchWeather(lat, lon, `${lat.toFixed(2)}, ${lon.toFixed(2)}`)
                }
              }
            } else {
              fetchWeather(59.9139, 10.7522, 'Oslo, Norway')
            }
          } catch {
            fetchWeather(59.9139, 10.7522, 'Oslo, Norway')
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 10000, // 10 seconds timeout
          maximumAge: 300000, // Accept cached position up to 5 minutes old
        },
      )
    } else {
      fetch('/api/geo')
        .then(async (response) => {
          const data: GeoApiResponse = await response.json()
          if (response.ok && data.data) {
            const { lat, lon } = data.data

            if (data.data.accuracy === 'default') {
              fetchWeather(lat, lon, 'Oslo, Norway')
            } else {
              try {
                const reverseResponse = await fetch(
                  `/api/reverse-geocode?lat=${lat}&lon=${lon}`,
                )
                const reverseData: ReverseGeocodeApiResponse =
                  await reverseResponse.json()

                if (reverseResponse.ok && reverseData.data?.locationName) {
                  fetchWeather(lat, lon, reverseData.data.locationName)
                } else {
                  fetchWeather(lat, lon, `${lat.toFixed(2)}, ${lon.toFixed(2)}`)
                }
              } catch {
                fetchWeather(lat, lon, `${lat.toFixed(2)}, ${lon.toFixed(2)}`)
              }
            }
          } else {
            fetchWeather(59.9139, 10.7522, 'Oslo, Norway')
          }
        })
        .catch(() => {
          fetchWeather(59.9139, 10.7522, 'Oslo, Norway')
        })
    }
  }, [fetchWeather])

  return (
    <WeatherContext.Provider
      value={{ weather, loading, error, handleCitySelect, recentSearches }}
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
