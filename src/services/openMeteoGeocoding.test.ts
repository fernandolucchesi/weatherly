import { describe, expect, it, vi, afterEach, type Mock } from 'vitest'
import { searchCities } from './openMeteoGeocoding'

const providerResponse = {
  results: [
    {
      id: 1,
      name: 'London',
      latitude: 51.5,
      longitude: -0.1,
      country: 'United Kingdom',
      admin1: 'England',
      admin2: 'London',
    },
  ],
}

describe('searchCities', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals?.()
  })

  it('maps provider results into City objects', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(providerResponse), { status: 200 }),
      )
    vi.stubGlobal('fetch', fetchMock)

    const cities = await searchCities('London')

    expect(fetchMock).toHaveBeenCalled()
    expect(cities).toHaveLength(1)
    expect(cities[0]).toMatchObject({
      id: '51.5,-0.1',
      name: 'London',
      country: 'United Kingdom',
      admin1: 'England',
      admin2: 'London',
      lat: 51.5,
      lon: -0.1,
    })
  })

  it('throws RATE_LIMITED on 429', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('rate', { status: 429 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(searchCities('Lon')).rejects.toThrow('RATE_LIMITED')
  })

  it('returns empty array when provider results missing', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const cities = await searchCities('Nowhere')
    expect(cities).toEqual([])
  })
})

