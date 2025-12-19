'use client'

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCitySearch } from '@/hooks/useCitySearch'
import type { City } from '@/types'

function CityItem({ city }: { city: City }) {
  return (
    <li className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
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
  )
}

function CityList({ cities }: { cities: City[] }) {
  if (cities.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Found {cities.length} result{cities.length !== 1 ? 's' : ''}:
      </p>
      <ul className="space-y-2">
        {cities.map((city) => (
          <CityItem key={city.id} city={city} />
        ))}
      </ul>
    </div>
  )
}

export function CitySearch() {
  const { query, setQuery, cities, loading, error } = useCitySearch()

  return (
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

        {!loading && !error && <CityList cities={cities} />}

        {!loading && !error && query.length >= 2 && cities.length === 0 && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No cities found. Try a different search term.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
