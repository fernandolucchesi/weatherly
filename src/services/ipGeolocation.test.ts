import { describe, expect, it, vi, afterEach } from 'vitest'
import { getLocationFromIp } from './ipGeolocation'

describe('getLocationFromIp', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals?.()
  })

  it('returns lat/lon on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', lat: 10, lon: 20 }), {
        status: 200,
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await getLocationFromIp('1.1.1.1')
    expect(result).toEqual({ lat: 10, lon: 20 })
  })

  it('returns null on provider failure status', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('fail', { status: 500 }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await getLocationFromIp('1.1.1.1')
    expect(result).toBeNull()
  })

  it('returns null on provider fail message', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'fail', message: 'denied' }), {
        status: 200,
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await getLocationFromIp('1.1.1.1')
    expect(result).toBeNull()
  })

  it('returns null when coordinates are invalid', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', lat: 999, lon: 20 }), {
        status: 200,
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await getLocationFromIp('1.1.1.1')
    expect(result).toBeNull()
  })
})

