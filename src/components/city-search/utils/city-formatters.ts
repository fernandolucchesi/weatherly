import type { City } from '@/types'

/**
 * Formats a city name with administrative divisions
 * @param city - City object
 * @returns Formatted string like "City Name, State, County, Country"
 */
export function formatCityLabel(city: City): string {
  const parts = [city.name]
  if (city.admin1) parts.push(city.admin1)
  if (city.admin2) parts.push(city.admin2)
  return `${parts.join(', ')}, ${city.country}`
}

/**
 * Gets a unique value for a city (used by Command component)
 * @param city - City object
 * @returns Unique identifier string
 */
export function getCityValue(city: City): string {
  return `${city.id}-${city.name}-${city.country}`
}

