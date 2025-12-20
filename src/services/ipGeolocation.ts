// IP geolocation service using ip-api.com
import 'server-only'

interface IpGeolocationResponse {
  lat?: number
  lon?: number
  latitude?: number
  longitude?: number
  status?: string
  message?: string
}

const IP_GEOLOCATION_API_URL =
  'http://ip-api.com/json/{ip}?fields=status,lat,lon'

/**
 * Get approximate location from IP address using ip-api.com
 * @param ip - Client IP address
 * @returns Object with lat and lon, or null if failed
 * @throws Error if provider request fails
 */
export async function getLocationFromIp(
  ip: string,
): Promise<{ lat: number; lon: number } | null> {
  const url = IP_GEOLOCATION_API_URL.replace('{ip}', ip)

  let response: Response
  try {
    response = await fetch(url)
  } catch {
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

  if (data.status === 'fail' || data.message) {
    return null
  }

  // Handle both lat/lon and latitude/longitude field names
  const lat = data.lat ?? data.latitude
  const lon = data.lon ?? data.longitude

  // Validate coordinate ranges
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
