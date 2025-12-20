'use client'

import { Loader2 } from 'lucide-react'
import type { City } from '@/types'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from '@/components/ui/command'
import { CitySearchItem } from './city-search-item'

interface CitySearchResultsProps {
  cities: City[]
  loading: boolean
  error: string | null
  canSearch: boolean
  listId: string
  onCitySelect: (city: City) => void
}

export function CitySearchResults({
  cities,
  loading,
  error,
  canSearch,
  listId,
  onCitySelect,
}: CitySearchResultsProps) {
  return (
    <Command
      shouldFilter={false}
      className="max-h-[300px]"
      aria-label="City search results"
    >
      <CommandList id={listId}>
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Searching...
            </span>
          </div>
        )}

        {error && (
          <div
            className="px-4 py-3 text-sm text-destructive"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {!loading && !error && canSearch && cities.length > 0 && (
          <CommandGroup
            heading={`${cities.length} ${
              cities.length === 1 ? 'city found' : 'cities found'
            }`}
          >
            {cities.map((city) => (
              <CitySearchItem
                key={city.id}
                city={city}
                onSelect={onCitySelect}
              />
            ))}
          </CommandGroup>
        )}

        {!loading && !error && canSearch && cities.length === 0 && (
          <CommandEmpty>
            <div className="py-6 text-center text-sm">
              <p className="text-muted-foreground">
                No cities found. Try a different search term.
              </p>
            </div>
          </CommandEmpty>
        )}
      </CommandList>
    </Command>
  )
}

