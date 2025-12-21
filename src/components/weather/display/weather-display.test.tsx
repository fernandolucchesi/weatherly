import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeatherDisplay } from './weather-display'
import type { Weather } from '@/types'

const today = new Date().toISOString().slice(0, 10)
const now = new Date().toISOString()

const sampleWeather: Weather = {
  locationName: 'Testville, TS',
  temperatureC: 18.4,
  weatherCode: 1,
  isDay: true,
  timezone: 'UTC',
  hourly: [
    {
      time: now,
      temperatureC: 18.4,
      weatherCode: 1,
      isDay: true,
      precipitation: 0.2,
      humidity: 55,
    },
  ],
  daily: [
    {
      date: today,
      temperatureMaxC: 23.1,
      temperatureMinC: 14.2,
      weatherCode: 2,
      precipitation: 1,
      precipitationProbability: 60,
    },
  ],
}

describe('WeatherDisplay', () => {
  it('renders placeholder when no weather is available', () => {
    render(
      <WeatherDisplay
        weather={null}
        loading={false}
        error={null}
        locationStatus="Detecting location…"
      />,
    )

    expect(
      screen.getByText(
        /Select a city or use your location to view weather information./i,
      ),
    ).toBeInTheDocument()
    expect(screen.getByText(/Detecting location…/i)).toBeInTheDocument()
  })

  it('renders error state with retry action', () => {
    const onRetry = vi.fn()

    render(
      <WeatherDisplay
        weather={null}
        loading={false}
        error="Failed to fetch weather"
        locationStatus="Location permission denied"
        onRetryLocation={onRetry}
      />,
    )

    expect(screen.getByText(/Failed to fetch weather/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Location status: Location permission denied/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Retry location detection/i }),
    ).toBeInTheDocument()
  })

  it('renders current weather details when data is present', () => {
    render(
      <WeatherDisplay
        weather={sampleWeather}
        loading={false}
        error={null}
        locationStatus="Using device location"
      />,
    )

    expect(screen.getByText('Testville, TS')).toBeInTheDocument()
    expect(screen.getByText(/Mainly clear/i)).toBeInTheDocument()
    expect(screen.getByText('18')).toBeInTheDocument()
    expect(screen.getByText(/H:23°\s+L:14°/i)).toBeInTheDocument()
  })
})
