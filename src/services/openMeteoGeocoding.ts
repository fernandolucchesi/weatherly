/**
 * Open-Meteo Geocoding API adapter
 * Maps provider responses to domain models
 */

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
 * Search for cities using Open-Meteo Geocoding API
 * @param query - Search query string (min length should be enforced by caller)
 * @returns Array of normalized City objects
 * @throws Error if provider request fails or returns unexpected format
 */
export async function searchCities(query: string): Promise<City[]> {
  const url = new URL(GEOCODING_API_URL)
  url.searchParams.set('name', query)
  url.searchParams.set('count', '5') // Limit results
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

  // Defensively handle missing or invalid results
  if (!data.results || !Array.isArray(data.results)) {
    return []
  }

  // Map provider results to domain model
  return data.results.map((result) => ({
    id: `${result.latitude},${result.longitude}`, // Stable id from coordinates
    name: result.name,
    country: result.country || result.country_code || '',
    admin1: result.admin1,
    admin2: result.admin2,
    lat: result.latitude,
    lon: result.longitude,
  }))
}
