import { describe, expect, it, vi, afterEach } from 'vitest'
import { getCurrentWeather } from './openMeteoForecast'

const mockResponse = {
  current_weather: {
    temperature: 12.3,
    weathercode: 1,
    time: '2024-01-01T00:00',
    is_day: 1,
  },
  hourly: {
    time: ['2024-01-01T00:00', '2024-01-01T01:00'],
    temperature_2m: [12.3, 13],
    weathercode: [1, 2],
    is_day: [1, 0],
    precipitation: [0, 0.1],
    relativehumidity_2m: [50, 55],
  },
  daily: {
    time: ['2024-01-01'],
    temperature_2m_max: [15],
    temperature_2m_min: [10],
    weathercode: [3],
    precipitation_sum: [1],
    precipitation_probability_max: [60],
  },
  timezone: 'UTC',
}

describe('getCurrentWeather', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals?.()
  })

  it('maps provider response into Weather domain model', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      )
    vi.stubGlobal('fetch', fetchMock)

    const result = await getCurrentWeather(1, 2, 'Test City')

    expect(fetchMock).toHaveBeenCalled()
    expect(result.locationName).toBe('Test City')
    expect(result.temperatureC).toBe(12.3)
    expect(result.weatherCode).toBe(1)
    expect(result.isDay).toBe(true)
    expect(result.timezone).toBe('UTC')
    expect(result.hourly?.[1]).toMatchObject({
      time: '2024-01-01T01:00',
      temperatureC: 13,
      weatherCode: 2,
      isDay: false,
      precipitation: 0.1,
      humidity: 55,
    })
    expect(result.daily?.[0]).toMatchObject({
      date: '2024-01-01',
      temperatureMaxC: 15,
      temperatureMinC: 10,
      weatherCode: 3,
      precipitation: 1,
      precipitationProbability: 60,
    })
  })

  it('throws NOT_FOUND on provider 404', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('not found', { status: 404 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(getCurrentWeather(1, 2, 'Missing')).rejects.toThrow(
      'NOT_FOUND',
    )
  })

  it('throws on provider error status', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('error', { status: 500 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(getCurrentWeather(1, 2, 'Error City')).rejects.toThrow(
      'Provider request failed',
    )
  })
})
