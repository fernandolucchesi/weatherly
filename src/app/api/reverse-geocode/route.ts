import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { reverseGeocode } from '@/services/openMeteoGeocoding'

/**
 * GET /api/reverse-geocode?lat=&lon=
 * Reverse geocode coordinates to location name
 */

const querySchema = z.object({
  lat: z.coerce
    .number()
    .min(-90)
    .max(90, 'Latitude must be between -90 and 90'),
  lon: z.coerce
    .number()
    .min(-180)
    .max(180, 'Longitude must be between -180 and 180'),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const latParam = searchParams.get('lat')
    const lonParam = searchParams.get('lon')

    const validationResult = querySchema.safeParse({
      lat: latParam,
      lon: lonParam,
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

    let locationName: string | null
    try {
      locationName = await reverseGeocode(lat, lon)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'

      if (errorMessage === 'RATE_LIMITED') {
        return NextResponse.json(
          {
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many requests. Please try again later.',
            },
          },
          { status: 429 },
        )
      }

      // Handle provider errors
      return NextResponse.json(
        {
          error: {
            code: 'PROVIDER_ERROR',
            message: 'Failed to reverse geocode location',
          },
        },
        { status: 502 },
      )
    }

    if (!locationName) {
      return NextResponse.json(
        {
          data: {
            locationName: null,
          },
        },
        { status: 200 },
      )
    }

    return NextResponse.json(
      {
        data: {
          locationName,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
        },
      },
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
