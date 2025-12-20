import { useState, useEffect } from 'react'
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
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as RecentSearch[]) : []
    } catch (error) {
      console.error('Failed to load recent searches:', error)
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches))
    } catch (error) {
      console.error('Failed to save recent searches:', error)
    }
  }, [recentSearches])

  const addRecentSearch = (city: City, weather: Weather) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((search) => search.city.id !== city.id)
      const newSearch: RecentSearch = { city, weather, searchedAt: Date.now() }
      return [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES)
    })
  }

  const clearRecentSearches = () => setRecentSearches([])

  return { recentSearches, addRecentSearch, clearRecentSearches }
}
