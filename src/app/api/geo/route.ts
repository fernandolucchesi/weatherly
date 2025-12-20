import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getLocationFromIp } from '@/services/ipGeolocation'

/**
 * GET /api/geo
 * Fallback location: browser coords → IP geolocation → Oslo default
 */

const querySchema = z.object({
  lat: z.coerce
    .number()
    .min(-90)
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),
  lon: z.coerce
    .number()
    .min(-180)
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),
})

const DEFAULT_LOCATION = { lat: 59.9139, lon: 10.7522 }

function createGeoResponse(
  lat: number,
  lon: number,
  accuracy: 'approx' | 'default',
) {
  return NextResponse.json(
    { data: { lat, lon, accuracy } },
    {
      headers: {
        'Cache-Control':
          accuracy === 'default'
            ? 'public, s-maxage=3600'
            : 'public, s-maxage=300, stale-while-revalidate=60',
      },
    },
  )
}

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const validationResult = querySchema.safeParse({
      lat: searchParams.get('lat'),
      lon: searchParams.get('lon'),
    })

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION',
            message:
              validationResult.error.issues[0]?.message ||
              'Invalid lat/lon parameters',
          },
        },
        { status: 400 },
      )
    }

    const { lat, lon } = validationResult.data

    if (lat !== undefined && lon !== undefined) {
      // Reject 0,0 coordinates as invalid
      if (lat === 0 && lon === 0) {
        // Fall through to IP geolocation
      } else {
        return createGeoResponse(lat, lon, 'approx')
      }
    }

    const clientIp = getClientIp(request)
    if (clientIp) {
      try {
        const location = await getLocationFromIp(clientIp)
        if (location) {
          // Reject 0,0 as invalid (likely from failed geolocation)
          if (location.lat === 0 && location.lon === 0) {
            // Fall through to default
          } else {
            return createGeoResponse(location.lat, location.lon, 'approx')
          }
        }
      } catch {
        // Fall through to default
      }
    }

    return createGeoResponse(
      DEFAULT_LOCATION.lat,
      DEFAULT_LOCATION.lon,
      'default',
    )
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'PROVIDER_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 502 },
    )
  }
}
