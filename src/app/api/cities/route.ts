import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { searchCities } from '@/services/openMeteoGeocoding'
import type { City } from '@/types'

/**
 * GET /api/cities?query=
 *
 * Autocomplete city search using Open-Meteo Geocoding.
 *
 * Query params:
 * - query: string (min length 2)
 *
 * Returns:
 * - 200: { data: City[] }
 * - 400: { error: { code: "VALIDATION", message: string } }
 * - 429: { error: { code: "RATE_LIMITED", message: string } }
 * - 502: { error: { code: "PROVIDER_ERROR", message: string } }
 */

const querySchema = z.object({
  query: z.string().min(2, 'Query must be at least 2 characters'),
})

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams
    const queryParam = searchParams.get('query')

    const validationResult = querySchema.safeParse({
      query: queryParam,
    })

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION',
            message:
              validationResult.error.issues[0]?.message ||
              'Invalid query parameter',
          },
        },
        { status: 400 },
      )
    }

    const { query } = validationResult.data

    // Call service to fetch cities from Open-Meteo
    let cities: City[]
    try {
      cities = await searchCities(query)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'

      // Handle rate limiting
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
            message: 'Failed to fetch city data from provider',
          },
        },
        { status: 502 },
      )
    }

    // Return normalized response
    return NextResponse.json({ data: cities })
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
