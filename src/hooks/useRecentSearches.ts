import { useCallback, useEffect, useState } from 'react'
import type { City, Weather } from '@/types'

export interface RecentSearch {
  city: City
  weather: Weather
  searchedAt: number
}

const STORAGE_KEY = 'weatherly_recent_searches'
const MAX_RECENT_SEARCHES = 5

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [hasLoaded, setHasLoaded] = useState(false)

  // Load once (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setRecentSearches(JSON.parse(stored) as RecentSearch[])
    } catch (error) {
      console.error('Failed to load recent searches:', error)
    } finally {
      setHasLoaded(true)
    }
  }, [])

  // Persist after initial load
  useEffect(() => {
    if (!hasLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches))
    } catch (error) {
      console.error('Failed to save recent searches:', error)
    }
  }, [recentSearches, hasLoaded])

  const addRecentSearch = useCallback((city: City, weather: Weather) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.city.id !== city.id)
      const next: RecentSearch = { city, weather, searchedAt: Date.now() }
      return [next, ...filtered].slice(0, MAX_RECENT_SEARCHES)
    })
  }, [])

  const clearRecentSearches = useCallback(() => setRecentSearches([]), [])

  return { recentSearches, addRecentSearch, clearRecentSearches }
}
