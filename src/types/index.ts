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
  conditionCode: WeatherCondition
  isDay?: boolean
}

export type WeatherCondition =
  | 'clear'
  | 'cloudy'
  | 'rain'
  | 'snow'
  | 'fog'
  | 'thunder'
