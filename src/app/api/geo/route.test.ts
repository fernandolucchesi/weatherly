import { describe, expect, it, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from './route'

vi.mock('@/services/ipGeolocation', () => ({
  getLocationFromIp: vi.fn(),
}))

const { getLocationFromIp } = await import('@/services/ipGeolocation')

describe('/api/geo', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns provided coordinates as approx', async () => {
    const req = new NextRequest('http://localhost/api/geo?lat=1&lon=2')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data.lat).toBe(1)
    expect(body.data.lon).toBe(2)
    expect(body.data.accuracy).toBe('approx')
  })

  it('uses IP-based lookup when no coords', async () => {
    ;(getLocationFromIp as unknown as vi.Mock).mockResolvedValue({
      lat: 5,
      lon: 6,
    })
    const req = new NextRequest('http://localhost/api/geo', {
      headers: { 'x-forwarded-for': '1.1.1.1' },
    })
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data.lat).toBe(5)
    expect(body.data.lon).toBe(6)
    expect(body.data.accuracy).toBe('approx')
  })

  it('falls back to default when IP lookup fails', async () => {
    ;(getLocationFromIp as unknown as vi.Mock).mockResolvedValue(null)
    const req = new NextRequest('http://localhost/api/geo', {
      headers: { 'x-forwarded-for': '1.1.1.1' },
    })
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data.lat).toBeCloseTo(59.9139)
    expect(body.data.accuracy).toBe('default')
  })
})

