'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { City } from '@/types'

export default function Home() {
  const [query, setQuery] = useState('')
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchCities = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setCities([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/cities?query=${encodeURIComponent(searchQuery)}`,
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.error?.message || 'Failed to search cities')
        setCities([])
        return
      }

      setCities(data.data || [])
    } catch {
      setError('An unexpected error occurred')
      setCities([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCities(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, searchCities])

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-8 py-16 px-6 sm:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50">
            City Search
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Search for cities using the Open-Meteo Geocoding API
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Cities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Type at least 2 characters to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />

            {loading && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Searching...
              </p>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
                {error}
              </div>
            )}

            {!loading && !error && cities.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Found {cities.length} result{cities.length !== 1 ? 's' : ''}:
                </p>
                <ul className="space-y-2">
                  {cities.map((city) => (
                    <li
                      key={city.id}
                      className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-zinc-900 dark:text-zinc-50">
                          {city.name}
                          {city.admin1 && (
                            <span className="ml-2 text-zinc-600 dark:text-zinc-400">
                              {city.admin1}
                            </span>
                          )}
                          {city.admin2 && (
                            <span className="ml-2 text-zinc-500 dark:text-zinc-500">
                              {city.admin2}
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {city.country}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-500">
                          {city.lat.toFixed(4)}, {city.lon.toFixed(4)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!loading && !error && query.length >= 2 && cities.length === 0 && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                No cities found. Try a different search term.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
