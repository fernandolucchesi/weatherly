import {
  describe,
  expect,
  it,
  vi,
  afterEach,
  beforeEach,
  type Mock,
} from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/services/openMeteoForecast', () => ({
  getCurrentWeather: vi.fn(),
}))

const makeReq = (url: string) => new NextRequest(url)

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('/api/weather', () => {
  it('returns 400 on invalid lat/lon', async () => {
    const { GET } = await import('./route')
    const req = makeReq('http://localhost/api/weather?lat=999&lon=0')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error.code).toBe('VALIDATION')
  })

  it('returns data on success', async () => {
    const { GET } = await import('./route')
    const { getCurrentWeather } = await import('@/services/openMeteoForecast')
    ;(getCurrentWeather as unknown as Mock).mockResolvedValue({
      locationName: 'Test City',
      temperatureC: 20,
      weatherCode: 1,
      timezone: 'UTC',
    })
    const req = makeReq(
      'http://localhost/api/weather?lat=1&lon=2&locationName=Test',
    )
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data.locationName).toBe('Test City')
  })

  it('returns 404 when provider reports not found', async () => {
    const { GET } = await import('./route')
    const { getCurrentWeather } = await import('@/services/openMeteoForecast')
    ;(getCurrentWeather as unknown as Mock).mockRejectedValue(
      new Error('NOT_FOUND'),
    )
    const req = makeReq(
      'http://localhost/api/weather?lat=1&lon=2&locationName=Test',
    )
    const res = await GET(req)
    const body = await res.json()

    expect(getCurrentWeather).toHaveBeenCalled()
    expect(res.status).toBe(404)
    expect(body.error.code).toBe('NOT_FOUND')
  })

  it('returns 502 on provider error', async () => {
    const { GET } = await import('./route')
    const { getCurrentWeather } = await import('@/services/openMeteoForecast')
    ;(getCurrentWeather as unknown as Mock).mockRejectedValue(new Error('boom'))
    const req = makeReq(
      'http://localhost/api/weather?lat=1&lon=2&locationName=Test',
    )
    const res = await GET(req)
    const body = await res.json()

    expect(getCurrentWeather).toHaveBeenCalled()
    expect(res.status).toBe(502)
    expect(body.error.code).toBe('PROVIDER_ERROR')
  })
})
