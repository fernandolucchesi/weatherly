import { useState, useCallback } from 'react'
import useSWR from 'swr'
import type { City } from '@/types'
import type { CitiesApiResponse } from '@/types/api'
import { useDebounce } from './useDebounce'

interface UseCitySearchResult {
  query: string
  setQuery: (query: string) => void
  cities: City[]
  loading: boolean
  error: string | null
}

/**
 * Custom hook for city search functionality
 * Handles debounced search, loading states, and error handling
 */
export function useCitySearch(): UseCitySearchResult {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const canSearch = debouncedQuery.trim().length >= 2
  const searchKey = canSearch ? debouncedQuery.trim() : null

  const fetchCities = useCallback(async (searchQuery: string) => {
    const response = await fetch(
      `/api/cities?query=${encodeURIComponent(searchQuery)}`,
    )

    const data: CitiesApiResponse = await response.json()

    if (!response.ok) {
      if ('error' in data) {
        throw new Error(data.error.message || 'Failed to search cities')
      }
      throw new Error('Failed to search cities')
    }

    if ('data' in data) {
      return data.data
    }

    throw new Error('Invalid response format')
  }, [])

  const {
    data: cities,
    error,
    isValidating,
  } = useSWR<City[]>(searchKey, fetchCities, {
    // SWR handles deduping, caching, and keeps previous data visible,
    // which avoids manual loading/error bookkeeping and stale responses.
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  return {
    query,
    setQuery,
    cities: cities ?? [],
    loading: Boolean(searchKey) && isValidating,
    error: error ? error.message : null,
  }
}
