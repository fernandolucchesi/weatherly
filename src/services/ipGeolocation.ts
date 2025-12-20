/**
 * IP Geolocation service adapter
 * Maps provider responses to coordinates
 */

import 'server-only'

interface IpGeolocationResponse {
  lat?: number
  lon?: number
  latitude?: number
  longitude?: number
  status?: string
  message?: string
}

/**
 * Get approximate location from IP address using ip-api.com
 * @param ip - Client IP address
 * @returns Object with lat and lon, or null if failed
 * @throws Error if provider request fails
 */
export async function getLocationFromIp(
  ip: string,
): Promise<{ lat: number; lon: number } | null> {
  // Use ip-api.com free service (no API key required)
  // Format: http://ip-api.com/json/{ip}?fields=status,lat,lon
  const url = `http://ip-api.com/json/${ip}?fields=status,lat,lon`

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  let response: Response
  try {
    response = await fetch(url, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
  } catch {
    clearTimeout(timeoutId)
    return null
  }

  if (!response.ok) {
    return null
  }

  let data: IpGeolocationResponse
  try {
    data = await response.json()
  } catch {
    return null
  }

  // Check if request was successful
  if (data.status === 'fail' || data.message) {
    return null
  }

  // Extract coordinates (ip-api uses 'lat' and 'lon')
  const lat = data.lat ?? data.latitude
  const lon = data.lon ?? data.longitude

  // Validate coordinates
  if (
    typeof lat !== 'number' ||
    typeof lon !== 'number' ||
    isNaN(lat) ||
    isNaN(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return null
  }

  return { lat, lon }
}
