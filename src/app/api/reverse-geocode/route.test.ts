import { describe, expect, it, vi, afterEach, type Mock } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from './route'

vi.mock('@/services/openMeteoGeocoding', () => ({
  reverseGeocode: vi.fn(),
}))

const { reverseGeocode } = await import('@/services/openMeteoGeocoding')

describe('/api/reverse-geocode', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 on invalid coordinates', async () => {
    const req = new NextRequest(
      'http://localhost/api/reverse-geocode?lat=999&lon=0',
    )
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error.code).toBe('VALIDATION')
  })

  it('returns location name on success', async () => {
    ;(reverseGeocode as unknown as Mock).mockResolvedValue('Test Place')
    const req = new NextRequest(
      'http://localhost/api/reverse-geocode?lat=1&lon=2',
    )
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data.locationName).toBe('Test Place')
  })

  it('returns null location when not found', async () => {
    ;(reverseGeocode as unknown as Mock).mockResolvedValue(null)
    const req = new NextRequest(
      'http://localhost/api/reverse-geocode?lat=1&lon=2',
    )
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data.locationName).toBeNull()
  })

  it('returns 429 on rate limit', async () => {
    ;(reverseGeocode as unknown as Mock).mockRejectedValue(
      new Error('RATE_LIMITED'),
    )
    const req = new NextRequest(
      'http://localhost/api/reverse-geocode?lat=1&lon=2',
    )
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(429)
    expect(body.error.code).toBe('RATE_LIMITED')
  })

  it('returns 502 on provider error', async () => {
    ;(reverseGeocode as unknown as Mock).mockRejectedValue(new Error('boom'))
    const req = new NextRequest(
      'http://localhost/api/reverse-geocode?lat=1&lon=2',
    )
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(502)
    expect(body.error.code).toBe('PROVIDER_ERROR')
  })
})
