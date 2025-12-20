import { useState, useEffect, useCallback } from 'react'
import type { City, Weather } from '@/types'

export interface RecentSearch {
  city: City
  weather: Weather
  searchedAt: number // timestamp
}

const STORAGE_KEY = 'weatherly_recent_searches'
const MAX_RECENT_SEARCHES = 5

/**
 * Custom hook for managing recent searches
 * Stores the latest 5 searches in localStorage
 */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as RecentSearch[]
        setRecentSearches(parsed)
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error)
    }
  }, [])

  // Save to localStorage whenever recentSearches changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches))
    } catch (error) {
      console.error('Failed to save recent searches:', error)
    }
  }, [recentSearches])

  const addRecentSearch = useCallback((city: City, weather: Weather) => {
    setRecentSearches((prev) => {
      // Remove if already exists (to avoid duplicates)
      const filtered = prev.filter((search) => search.city.id !== city.id)

      // Add new search at the beginning
      const newSearch: RecentSearch = {
        city,
        weather,
        searchedAt: Date.now(),
      }

      // Keep only the latest MAX_RECENT_SEARCHES
      const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES)

      return updated
    })
  }, [])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
  }, [])

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  }
}
