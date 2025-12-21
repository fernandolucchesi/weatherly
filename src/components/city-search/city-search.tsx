'use client'

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react'
import type { City } from '@/types'
import { useCitySearch } from '@/hooks/useCitySearch'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { CitySearchInput } from './components/city-search-input'
import { CitySearchResults } from './components/city-search-results'

export interface CitySearchProps {
  onCitySelect?: (city: City) => void
  minChars?: number
  placeholder?: string
}

export function CitySearch({
  onCitySelect,
  minChars = 2,
  placeholder = 'Search for a city...',
}: CitySearchProps) {
  const { query, setQuery, cities, loading, error } = useCitySearch()

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)

  const canSearch = query.trim().length >= minChars
  const isOpen = open && canSearch
  const listId = useId()
  const statusId = useId()
  const instructionsId = useId()

  const handleSelect = useCallback(
    (city: City) => {
      onCitySelect?.(city)
      setQuery('')
      setOpen(false)
      inputRef.current?.blur()
    },
    [onCitySelect, setQuery],
  )

  const handleValueChange = useCallback(
    (value: string) => {
      setQuery(value)
      setOpen(value.trim().length >= minChars)
    },
    [setQuery, minChars],
  )

  const handleFocus = useCallback(() => {
    if (query.trim().length >= minChars) setOpen(true)
  }, [query, minChars])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }, [])

  const announcement = useMemo(() => {
    if (!canSearch) return ''
    if (loading) return 'Searching for cities...'
    if (error) return `Error: ${error}`
    if (cities.length === 0) return 'No cities found'
    return `Found ${cities.length} ${cities.length === 1 ? 'city' : 'cities'}`
  }, [canSearch, loading, error, cities.length])

  return (
    <div ref={containerRef} className="relative w-full">
      <p id={instructionsId} className="sr-only">
        Type at least {minChars} characters to search for cities. Use arrow keys
        to navigate results and press Enter to select. Press Escape to close.
      </p>

      <div
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      <Popover
        open={isOpen}
        onOpenChange={(next) => setOpen(next && canSearch)}
      >
        <PopoverAnchor asChild>
          <div className="w-full">
            <CitySearchInput
              query={query}
              onValueChange={handleValueChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              open={isOpen}
              listId={listId}
              statusId={statusId}
              instructionsId={instructionsId}
              inputRef={inputRef as RefObject<HTMLInputElement>}
            />
          </div>
        </PopoverAnchor>

        <PopoverContent
          className="p-0"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            const target = e.target as Node
            if (containerRef.current?.contains(target)) e.preventDefault()
          }}
          onEscapeKeyDown={() => {
            setOpen(false)
            inputRef.current?.blur()
          }}
        >
          <CitySearchResults
            cities={cities}
            loading={loading}
            error={error}
            canSearch={canSearch}
            listId={listId}
            onCitySelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
