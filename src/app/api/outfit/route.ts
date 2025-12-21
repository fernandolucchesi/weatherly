import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getOutfitRecommendation } from '@/lib/outfit'
import type { Weather } from '@/types'
import { getWeatherLabel } from '@/components/weather/utils/weather-icons'
import { getAIOutfitAdvice } from '@/services/outfitAI'

const weatherSchema = z.object({
  locationName: z.string(),
  temperatureC: z.number(),
  weatherCode: z.number(),
  isDay: z.boolean().optional(),
  daily: z
    .array(
      z.object({
        date: z.string().optional(),
        weatherCode: z.number().optional(),
        temperatureMaxC: z.number().optional(),
        temperatureMinC: z.number().optional(),
        precipitation: z.number().optional(),
        precipitationProbability: z.number().optional(),
      }),
    )
    .optional(),
  maxPrecipitation: z.number().optional(),
  maxPrecipitationProbability: z.number().optional(),
  eveningTemperatureC: z.number().optional(),
})

function normalizeWeather(weather: z.infer<typeof weatherSchema>): Weather {
  return {
    locationName: weather.locationName,
    temperatureC: weather.temperatureC,
    weatherCode: weather.weatherCode,
    isDay: weather.isDay,
    timezone: 'UTC',
    daily: weather.daily?.map((d, idx) => ({
      date: d.date ?? `day-${idx}`,
      temperatureMaxC: d.temperatureMaxC ?? weather.temperatureC,
      temperatureMinC: d.temperatureMinC ?? weather.temperatureC,
      weatherCode: d.weatherCode ?? weather.weatherCode,
      precipitation: d.precipitation,
      precipitationProbability: d.precipitationProbability,
    })),
  }
}

async function getOpenAIAdvice(weather: z.infer<typeof weatherSchema>) {
  const label = getWeatherLabel(weather.weatherCode)
  const max = weather.daily?.[0]?.temperatureMaxC
  const min = weather.daily?.[0]?.temperatureMinC
  const precipitation =
    weather.maxPrecipitation ?? weather.daily?.[0]?.precipitation
  const precipProb =
    weather.maxPrecipitationProbability ??
    weather.daily?.[0]?.precipitationProbability
  const eveningNote =
    weather.eveningTemperatureC !== undefined
      ? `Evening around ${Math.round(weather.eveningTemperatureC)}°C.`
      : 'Evening trend not provided.'

  const prompt = `
You are a weather forecast assistant. You are given a weather forecast and you need to provide a concise, outfit idea sentence with a tiny compliment. Take into consideration date time and weather.
Loc: ${weather.locationName}
Now: ${Math.round(weather.temperatureC)}°C, ${label} (code ${
    weather.weatherCode
  })
Hi/Lo: ${max ?? 'n/a'}/${min ?? 'n/a'}°C
Precip: ${precipitation ?? 0} mm max, ${precipProb ?? 'n/a'}% chance
Evening: ${eveningNote}
Rules: Max 1 sentence. Be creative. Be flirty. Celsius only.
  `.trim()

  return getAIOutfitAdvice(prompt)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const parsed = weatherSchema.safeParse(body?.weather)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: { code: 'VALIDATION', message: 'Invalid weather payload' },
        },
        { status: 400 },
      )
    }

    const weather = parsed.data

    // Try AI; fall back to deterministic advice on failure
    try {
      const advice = await getOpenAIAdvice(weather)
      return NextResponse.json({ data: advice })
    } catch {
      const fallbackWeather = normalizeWeather(weather)
      const fallback = getOutfitRecommendation(fallbackWeather)
      fallback.note = undefined
      return NextResponse.json({ data: fallback })
    }
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'PROVIDER_ERROR',
          message: 'Failed to generate outfit recommendation',
        },
      },
      { status: 502 },
    )
  }
}
