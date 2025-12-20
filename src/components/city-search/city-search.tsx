'use client'

import * as React from 'react'
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

  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [open, setOpen] = React.useState(false)
  const [hasTyped, setHasTyped] = React.useState(false)

  const canSearch = query.trim().length >= minChars
  const listId = React.useId()
  const statusId = React.useId()
  const instructionsId = React.useId()

  // Open/close based on typing + min length
  React.useEffect(() => {
    if (!hasTyped) return
    setOpen(canSearch)
  }, [canSearch, hasTyped])

  // Keep input focused when popover opens due to typing/results
  React.useEffect(() => {
    if (!open) return
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [open, cities.length, loading, error])

  const handleSelect = React.useCallback(
    (city: City) => {
      onCitySelect?.(city)
      setQuery('')
      setHasTyped(false)
      setOpen(false)
      inputRef.current?.blur()
    },
    [onCitySelect, setQuery],
  )

  const handleValueChange = React.useCallback(
    (value: string) => {
      setQuery(value)
      setHasTyped(true)
      setOpen(value.trim().length >= minChars)
    },
    [setQuery, minChars],
  )

  const handleFocus = React.useCallback(() => {
    if (query.trim().length >= minChars) setOpen(true)
  }, [query, minChars])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }, [])

  const announcement = React.useMemo(() => {
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
        open={open}
        onOpenChange={(next) => {
          if (next && !canSearch) return
          setOpen(next)
        }}
      >
        <PopoverAnchor asChild>
          <div className="w-full">
            <CitySearchInput
              query={query}
              onValueChange={handleValueChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              open={open}
              listId={listId}
              statusId={statusId}
              instructionsId={instructionsId}
              inputRef={inputRef as React.RefObject<HTMLInputElement>}
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
