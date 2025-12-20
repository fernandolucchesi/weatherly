// Open-Meteo Geocoding API adapter

import 'server-only'

import type { City } from '@/types'

interface OpenMeteoGeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  country_code?: string
  admin1?: string
  admin2?: string
  admin3?: string
  admin4?: string
  elevation?: number
  population?: number
  timezone?: string
}

interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[]
  generationtime_ms?: number
}

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search'

/**
 * Search cities by name
 * @param query - Search query (min length enforced by caller)
 */
export async function searchCities(query: string): Promise<City[]> {
  const url = new URL(GEOCODING_API_URL)
  url.searchParams.set('name', query)
  url.searchParams.set('count', '10')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')

  let response: Response
  try {
    response = await fetch(url.toString())
  } catch (error) {
    throw new Error(`Failed to reach geocoding provider: ${error}`)
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('RATE_LIMITED')
    }
    throw new Error('Provider request failed')
  }

  let data: OpenMeteoGeocodingResponse
  try {
    data = await response.json()
  } catch (error) {
    throw new Error(`Invalid provider response format: ${error}`)
  }

  if (!data.results || !Array.isArray(data.results)) {
    return []
  }

  return data.results.map((result) => ({
    id: `${result.latitude},${result.longitude}`,
    name: result.name,
    country: result.country || result.country_code || '',
    admin1: result.admin1,
    admin2: result.admin2,
    lat: result.latitude,
    lon: result.longitude,
  }))
}

interface NominatimResponse {
  address?: {
    city?: string
    town?: string
    village?: string
    municipality?: string
    state?: string
    region?: string
    country?: string
    country_code?: string
  }
  display_name?: string
}

const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/reverse'

/**
 * Reverse geocode coordinates to location name (uses Nominatim)
 * @param lat - Latitude
 * @param lon - Longitude
 */
export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<string | null> {
  const url = new URL(NOMINATIM_API_URL)
  url.searchParams.set('lat', lat.toString())
  url.searchParams.set('lon', lon.toString())
  url.searchParams.set('format', 'json')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('accept-language', 'en')

  let response: Response
  try {
    response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Weatherly App',
      },
    })
  } catch {
    return null
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('RATE_LIMITED')
    }
    return null
  }

  let data: NominatimResponse
  try {
    data = await response.json()
  } catch {
    return null
  }

  if (data.address) {
    const address = data.address
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      ''
    const state = address.state || address.region || ''
    const country = address.country || ''

    const locationParts = [city, state, country].filter(Boolean)
    if (locationParts.length > 0) {
      return locationParts.join(', ')
    }
  }

  if (data.display_name) {
    const parts = data.display_name.split(',')
    if (parts.length >= 2) {
      return `${parts[0].trim()}, ${parts[parts.length - 1].trim()}`
    }
    return data.display_name
  }

  return null
}
