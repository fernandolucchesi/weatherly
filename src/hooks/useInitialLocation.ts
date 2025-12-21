'use client'

import { useCallback, useEffect, useState } from 'react'

interface LocationStatus {
  state:
    | 'idle'
    | 'locating'
    | 'using-geo'
    | 'using-ip'
    | 'fallback'
    | 'denied'
    | 'error'
  message: string
}

/**
 * Handles initial location detection with clear status messaging.
 * Prefers geolocation, falls back to IP lookup, then to a safe default.
 */
export function useInitialLocation(
  fetchWeather: (
    lat: number,
    lon: number,
    locationName?: string,
  ) => Promise<void>,
) {
  const [status, setStatus] = useState<LocationStatus>({
    state: 'locating',
    message: 'Detecting location…',
  })
  const [runKey, setRunKey] = useState(0)

  const resolveLocationName = useCallback(async (lat: number, lon: number) => {
    try {
      const response = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`)
      const data = (await response.json()) as {
        data?: { locationName: string | null }
      }

      if (response.ok && data.data?.locationName) {
        return data.data.locationName
      }
    } catch {
      // ignore – we will fall back to coordinates string
    }

    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`
  }, [])

  const fetchWithResolvedName = useCallback(
    async (lat: number, lon: number, fallbackName?: string) => {
      const name =
        fallbackName !== undefined
          ? fallbackName
          : await resolveLocationName(lat, lon)
      await fetchWeather(lat, lon, name)
    },
    [fetchWeather, resolveLocationName],
  )

  const fallbackToDefault = useCallback(async () => {
    setStatus({
      state: 'fallback',
      message: 'Using default location (Oslo, Norway)',
    })
    await fetchWeather(59.9139, 10.7522, 'Oslo, Norway')
  }, [fetchWeather])

  const runIpLocation = useCallback(async () => {
    setStatus({
      state: 'using-ip',
      message: 'Using IP-based location',
    })

    try {
      const response = await fetch('/api/geo')
      const data = (await response.json()) as {
        data?: { lat: number; lon: number; accuracy: 'approx' | 'default' }
      }

      if (response.ok && data.data) {
        const { lat, lon, accuracy } = data.data

        if (accuracy === 'default') {
          await fetchWithResolvedName(lat, lon, 'Oslo, Norway')
        } else {
          await fetchWithResolvedName(lat, lon)
        }
        return
      }
    } catch {
      // fall through to default
    }

    await fallbackToDefault()
  }, [fetchWithResolvedName, fallbackToDefault])

  const detectLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      return runIpLocation()
    }

    setStatus({
      state: 'locating',
      message: 'Requesting device location…',
    })

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setStatus({
          state: 'using-geo',
          message: 'Using device location',
        })
        await fetchWithResolvedName(latitude, longitude)
      },
      async () => {
        setStatus({
          state: 'denied',
          message:
            'Location permission denied. Falling back to IP-based location.',
        })
        await runIpLocation()
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }, [fetchWithResolvedName, runIpLocation])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        await detectLocation()
      } catch {
        if (cancelled) return
        setStatus({
          state: 'error',
          message: 'Could not detect location. Using default.',
        })
        await fallbackToDefault()
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [detectLocation, fallbackToDefault, runKey])

  const retry = useCallback(() => setRunKey((key) => key + 1), [])

  return {
    locationStatus: status.message,
    retryInitialLocation: retry,
  }
}
