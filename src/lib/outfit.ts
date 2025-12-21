import type { Weather } from '@/types'

export type OutfitAdvice = {
  headline: string
  text: string
  note?: string
}

function isWet(weatherCode: number, precipitation?: number) {
  if (precipitation && precipitation >= 0.5) return true
  if (weatherCode >= 51 && weatherCode <= 67) return true // drizzle/rain
  if (weatherCode >= 80 && weatherCode <= 82) return true // showers
  if (weatherCode >= 95) return true // thunderstorms/hail
  return false
}

function isSnowy(weatherCode: number) {
  if (weatherCode >= 71 && weatherCode <= 77) return true
  if (weatherCode >= 85 && weatherCode <= 86) return true
  if (weatherCode >= 96 && weatherCode <= 99) return true
  return false
}

/**
 * Lightweight, deterministic outfit recommendation based on current weather.
 * This can be replaced or augmented by an LLM-backed endpoint if desired.
 */
export function getOutfitRecommendation(weather: Weather): OutfitAdvice {
  const temp = weather.temperatureC
  const currentPrecip = weather.hourly?.[0]?.precipitation
  const code = weather.weatherCode

  const bullets: string[] = []

  if (isSnowy(code)) {
    bullets.push('Insulated jacket, gloves, beanie, waterproof boots')
  } else if (temp <= 5) {
    bullets.push('Heavy coat, scarf, gloves')
  } else if (temp <= 12) {
    bullets.push('Warm jacket or fleece layer')
  } else if (temp <= 18) {
    bullets.push('Light jacket or thick sweater')
  } else if (temp <= 24) {
    bullets.push('Long sleeves or light layers')
  } else {
    bullets.push('T-shirt and breathable fabrics')
  }

  if (isWet(code, currentPrecip)) {
    bullets.push('Waterproof layer and umbrella')
  }

  if (temp >= 26) {
    bullets.push('Cap/sunglasses, stay hydrated')
  }

  if (weather.isDay === false && temp <= 16) {
    bullets.push('Evening: bring an extra layer')
  }

  return {
    headline: 'What to wear today',
    text: bullets.join('; ') || 'Dress comfortably for mild conditions.',
    note: 'Rule-based suggestion. AI fallback used only when OpenAI is unavailable.',
  }
}
