import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentWeather } from '@/services/openMeteoForecast'
import type { Weather } from '@/types'

/**
 * GET /api/weather?lat=&lon=&locationName=
 *
 * Fetch weather for coordinates using Open-Meteo Forecast.
 *
 * Query params:
 * - lat: number (latitude)
 * - lon: number (longitude)
 * - locationName: string (optional, defaults to coordinates if not provided)
 *
 * Returns:
 * - 200: { data: Weather }
 * - 400: { error: { code: "VALIDATION", message: string } }
 * - 404: { error: { code: "NOT_FOUND", message: string } }
 * - 502: { error: { code: "PROVIDER_ERROR", message: string } }
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
  locationName: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams
    const latParam = searchParams.get('lat')
    const lonParam = searchParams.get('lon')
    const locationNameParam = searchParams.get('locationName')

    const validationResult = querySchema.safeParse({
      lat: latParam,
      lon: lonParam,
      locationName: locationNameParam,
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

    const {
      lat,
      lon,
      locationName: providedLocationName,
    } = validationResult.data

    // Use provided location name or generate from coordinates
    const locationName =
      providedLocationName || `${lat.toFixed(2)}, ${lon.toFixed(2)}`

    // Call service to fetch weather from Open-Meteo
    let weather: Weather
    try {
      weather = await getCurrentWeather(lat, lon, locationName)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'

      // Handle not found
      if (errorMessage === 'NOT_FOUND') {
        return NextResponse.json(
          {
            error: {
              code: 'NOT_FOUND',
              message: 'No weather data available for this location',
            },
          },
          { status: 404 },
        )
      }

      // Handle provider errors
      return NextResponse.json(
        {
          error: {
            code: 'PROVIDER_ERROR',
            message: 'Failed to fetch weather data from provider',
          },
        },
        { status: 502 },
      )
    }

    // Return normalized response with caching headers (5-15 minutes as recommended)
    return NextResponse.json(
      { data: weather },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300', // 10 minutes cache
        },
      },
    )
  } catch {
    // Unexpected errors
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
