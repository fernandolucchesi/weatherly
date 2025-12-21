import { describe, expect, it, vi, afterEach, type Mock } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from './route'

vi.mock('@/services/openMeteoGeocoding', () => ({
  searchCities: vi.fn(),
}))

const { searchCities } = await import('@/services/openMeteoGeocoding')

describe('/api/cities', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 on invalid query', async () => {
    const req = new NextRequest('http://localhost/api/cities?query=a')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error.code).toBe('VALIDATION')
  })

  it('returns data on success', async () => {
    ;(searchCities as unknown as Mock).mockResolvedValue([
      { id: '1', name: 'London', country: 'UK', lat: 1, lon: 2 },
    ])
    const req = new NextRequest('http://localhost/api/cities?query=Lon')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data).toHaveLength(1)
    expect(body.data[0].name).toBe('London')
  })

  it('returns 429 on provider rate limit', async () => {
    ;(searchCities as unknown as Mock).mockRejectedValue(
      new Error('RATE_LIMITED'),
    )
    const req = new NextRequest('http://localhost/api/cities?query=Lon')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(429)
    expect(body.error.code).toBe('RATE_LIMITED')
  })
})
