'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { useCitySearch } from '@/hooks/useCitySearch'
import type { City } from '@/types'
import { Search } from 'lucide-react'

function CityItem({
  city,
  onSelect,
}: {
  city: City
  onSelect: (city: City) => void
}) {
  return (
    <li
      className="cursor-pointer rounded-md border border-zinc-200 bg-zinc-50 p-3 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
      onClick={() => onSelect(city)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(city)
        }
      }}
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
      </div>
    </li>
  )
}

interface CitySearchProps {
  onCitySelect?: (city: City) => void
}

export function CitySearch({ onCitySelect }: CitySearchProps) {
  const { query, setQuery, cities, loading, error } = useCitySearch()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCitySelect = (city: City) => {
    onCitySelect?.(city)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
  }

  const handleInputFocus = () => {
    if (query.length >= 2) {
      setIsOpen(true)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Determine if we should show results based on state
  const shouldShowResults =
    query.length >= 2 && (cities.length > 0 || loading || error)
  const showResults = isOpen && shouldShowResults

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="w-full pl-10"
        />
      </div>

      {showResults && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            {loading && (
              <div className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                Searching...
              </div>
            )}

            {error && (
              <div className="p-4 text-sm text-red-800 dark:text-red-200">
                {error}
              </div>
            )}

            {!loading && !error && cities.length > 0 && (
              <ul className="p-2">
                {cities.map((city) => (
                  <CityItem
                    key={city.id}
                    city={city}
                    onSelect={handleCitySelect}
                  />
                ))}
              </ul>
            )}

            {!loading && !error && query.length >= 2 && cities.length === 0 && (
              <div className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                No cities found. Try a different search term.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
