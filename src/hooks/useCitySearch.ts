import { useState, useEffect, useCallback } from 'react'
import type { City } from '@/types'
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
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query, 300)

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

  useEffect(() => {
    searchCities(debouncedQuery)
  }, [debouncedQuery, searchCities])

  return {
    query,
    setQuery,
    cities,
    loading,
    error,
  }
}
