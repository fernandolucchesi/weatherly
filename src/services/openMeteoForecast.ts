/**
 * Open-Meteo Forecast API adapter
 * Maps provider responses to domain models
 */

import 'server-only'

import type { Weather, HourlyForecast, DailyForecast } from '@/types'

interface OpenMeteoCurrentWeather {
  temperature: number
  weathercode: number
  time: string
  is_day?: number // 1 for day, 0 for night
}

interface OpenMeteoHourlyData {
  time: string[]
  temperature_2m: number[]
  weathercode: number[]
  is_day: number[]
  precipitation?: number[]
  relativehumidity_2m?: number[]
}

interface OpenMeteoDailyData {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  weathercode: number[]
  precipitation_sum?: number[]
  precipitation_probability_max?: number[]
}

interface OpenMeteoForecastResponse {
  current_weather?: OpenMeteoCurrentWeather
  hourly?: OpenMeteoHourlyData
  daily?: OpenMeteoDailyData
  latitude?: number
  longitude?: number
  timezone?: string // e.g., "America/New_York"
  timezone_abbreviation?: string // e.g., "EST"
  utc_offset_seconds?: number
  generationtime_ms?: number
}

const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast'

/**
 * Fetches current weather and forecasts for given coordinates using Open-Meteo Forecast API
 * @param lat - Latitude
 * @param lon - Longitude
 * @param locationName - Location name for the weather response
 * @returns Normalized Weather object with hourly and daily forecasts
 * @throws Error if provider request fails or returns unexpected format
 */
export async function getCurrentWeather(
  lat: number,
  lon: number,
  locationName: string,
): Promise<Weather> {
  const url = new URL(FORECAST_API_URL)
  url.searchParams.set('latitude', lat.toString())
  url.searchParams.set('longitude', lon.toString())
  url.searchParams.set('current_weather', 'true')
  url.searchParams.set('temperature_unit', 'celsius')
  url.searchParams.set('timezone', 'auto')

  // Request hourly forecast for next 24 hours
  url.searchParams.set(
    'hourly',
    [
      'temperature_2m',
      'weathercode',
      'is_day',
      'precipitation',
      'relativehumidity_2m',
    ].join(','),
  )

  // Request daily forecast for next 7 days
  url.searchParams.set(
    'daily',
    [
      'weathercode',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'precipitation_probability_max',
    ].join(','),
  )

  // Set forecast days
  url.searchParams.set('forecast_days', '7')

  let response: Response
  try {
    response = await fetch(url.toString())
  } catch (error) {
    throw new Error(`Failed to reach forecast provider: ${error}`)
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('NOT_FOUND')
    }
    throw new Error('Provider request failed')
  }

  let data: OpenMeteoForecastResponse
  try {
    data = await response.json()
  } catch (error) {
    throw new Error(`Invalid provider response format: ${error}`)
  }

  // Defensively handle missing current_weather data
  if (!data.current_weather) {
    throw new Error('NOT_FOUND')
  }

  const current = data.current_weather

  // Map hourly forecast data
  let hourlyForecast: HourlyForecast[] | undefined
  if (data.hourly) {
    const hourly = data.hourly
    hourlyForecast = hourly.time.map((time, index) => ({
      time,
      temperatureC: hourly.temperature_2m[index] ?? 0,
      weatherCode: hourly.weathercode[index] ?? 0,
      isDay: hourly.is_day[index] === 1,
      precipitation: hourly.precipitation?.[index],
      humidity: hourly.relativehumidity_2m?.[index],
    }))
    // Limit to next 48 hours as a buffer, we will display 24 hours of forecast in the UI adjusted for the location's timezone
    hourlyForecast = hourlyForecast.slice(0, 48)
  }

  // Map daily forecast data
  let dailyForecast: DailyForecast[] | undefined
  if (data.daily) {
    const daily = data.daily
    dailyForecast = daily.time.map((date, index) => ({
      date,
      temperatureMaxC: daily.temperature_2m_max[index] ?? 0,
      temperatureMinC: daily.temperature_2m_min[index] ?? 0,
      weatherCode: daily.weathercode[index] ?? 0,
      precipitation: daily.precipitation_sum?.[index],
      precipitationProbability: daily.precipitation_probability_max?.[index],
    }))
  }

  // Map provider response to domain model
  // timezone should always be present when using 'auto', but fallback to UTC if missing
  return {
    locationName,
    temperatureC: current.temperature,
    weatherCode: current.weathercode,
    isDay: current.is_day === 1,
    timezone: data.timezone || 'UTC',
    hourly: hourlyForecast,
    daily: dailyForecast,
  }
}
