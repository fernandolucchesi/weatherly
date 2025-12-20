/**
 * Domain models (normalized)
 */

export interface City {
  id: string // stable id, e.g. "lat,lon" or provider id
  name: string
  country: string // or country_code
  admin1?: string // state/province/region
  admin2?: string // county/district
  lat: number
  lon: number
}

export interface Weather {
  locationName: string
  temperatureC: number
  weatherCode: number // WMO weather code (0-99)
  isDay?: boolean
  timezone?: string // IANA timezone identifier (e.g., "America/New_York")
  hourly?: HourlyForecast[]
  daily?: DailyForecast[]
}

export interface HourlyForecast {
  time: string // ISO 8601 datetime string
  temperatureC: number
  weatherCode: number // WMO weather code (0-99)
  isDay?: boolean
  precipitation?: number // mm
  humidity?: number // percentage
}

export interface DailyForecast {
  date: string // YYYY-MM-DD
  temperatureMaxC: number
  temperatureMinC: number
  weatherCode: number // WMO weather code (0-99)
  precipitation?: number // mm
  precipitationProbability?: number // percentage
}

// WeatherCondition type removed - using WMO weather codes directly
