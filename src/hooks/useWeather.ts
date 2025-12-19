import { useState, useCallback } from 'react'
import type { Weather } from '@/types'
import type { WeatherApiResponse } from '@/types/api'

interface UseWeatherResult {
  weather: Weather | null
  loading: boolean
  error: string | null
  fetchWeather: (
    lat: number,
    lon: number,
    locationName?: string,
  ) => Promise<void>
}

/**
 * Custom hook for fetching weather data
 * Handles loading states and error handling
 */
export function useWeather(): UseWeatherResult {
  const [weather, setWeather] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = useCallback(
    async (lat: number, lon: number, locationName?: string) => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          lat: lat.toString(),
          lon: lon.toString(),
        })

        if (locationName) {
          params.set('locationName', locationName)
        }

        const response = await fetch(`/api/weather?${params.toString()}`)
        const data: WeatherApiResponse = await response.json()

        if (!response.ok) {
          if ('error' in data) {
            setError(data.error.message || 'Failed to fetch weather')
          } else {
            setError('Failed to fetch weather')
          }
          setWeather(null)
          return
        }

        if ('data' in data) {
          setWeather(data.data)
        } else {
          setError('Invalid response format')
          setWeather(null)
        }
      } catch {
        setError('An unexpected error occurred')
        setWeather(null)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return {
    weather,
    loading,
    error,
    fetchWeather,
  }
}
