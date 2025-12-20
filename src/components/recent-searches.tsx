'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWeatherContext } from '@/contexts/weather-context'
import { getWeatherIcon } from '@/components/weather/utils/weather-icons'
import { Clock, ChevronDown, ChevronUp } from 'lucide-react'

export function RecentSearches() {
  const { recentSearches, handleCitySelect } = useWeatherContext()
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full hover:opacity-80 transition-opacity group"
        >
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Recent Searches
            {recentSearches.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({recentSearches.length})
              </span>
            )}
          </CardTitle>
          {recentSearches.length > 0 && (
            <div className="text-muted-foreground transition-transform group-hover:scale-110">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          )}
        </button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 pb-2 px-3">
          {recentSearches.length === 0 ? (
            <div className="text-center py-2">
              <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">
                No recent searches yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Search for a city to get started
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentSearches.map((search) => (
                <button
                  key={`${search.city.id}-${search.searchedAt}`}
                  onClick={() => handleCitySelect(search.city)}
                  title={`View weather for ${search.weather.locationName}`}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/50 dark:border-zinc-800 p-2 text-left transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100 hover:shadow-sm dark:hover:border-zinc-700 dark:hover:bg-zinc-800/80 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="font-medium text-sm text-foreground truncate flex-1 min-w-0"
                      title={search.weather.locationName}
                    >
                      {search.weather.locationName}
                    </span>
                    <div className="flex-shrink-0 flex items-center gap-2.5">
                      <span className="text-sm font-semibold text-foreground whitespace-nowrap tabular-nums">
                        {Math.round(search.weather.temperatureC)}°
                      </span>
                      <div className="opacity-80">
                        {getWeatherIcon(
                          search.weather.conditionCode,
                          search.weather.isDay,
                          'sm',
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
