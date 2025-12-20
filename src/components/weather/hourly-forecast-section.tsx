'use client'

import { useState, useEffect, useRef } from 'react'
import { Droplets } from 'lucide-react'
import type { HourlyForecast } from '@/types'
import { getWeatherIcon } from './utils/weather-icons'
import { formatHour, getCurrentHourString } from './utils/date-formatters'

interface HourlyForecastSectionProps {
  hourly: HourlyForecast[]
  timezone?: string
}

export function HourlyForecastSection({
  hourly,
  timezone,
}: HourlyForecastSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftGradient, setShowLeftGradient] = useState(false)
  const [showRightGradient, setShowRightGradient] = useState(true)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const checkScrollPosition = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container
      const isAtStart = scrollLeft <= 0
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1 // -1 for rounding errors

      setShowLeftGradient(!isAtStart)
      setShowRightGradient(!isAtEnd)
    }

    // Check initial position
    checkScrollPosition()

    // Add scroll listener
    container.addEventListener('scroll', checkScrollPosition)

    // Check on resize
    const resizeObserver = new ResizeObserver(checkScrollPosition)
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener('scroll', checkScrollPosition)
      resizeObserver.disconnect()
    }
  }, [hourly])
  const currentHourString = getCurrentHourString(timezone)

  // Filter out past hours
  const currentHourDate = new Date(currentHourString + ':00')
  const futureHours: HourlyForecast[] = []

  for (let i = 0; i < hourly.length; i++) {
    const hourDate = new Date(hourly[i].time)
    // Round down to the hour for comparison
    hourDate.setMinutes(0, 0, 0)

    if (hourDate >= currentHourDate) {
      futureHours.push(hourly[i])
    }
  }

  const displayHours = futureHours.slice(0, 25)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        24-Hour Forecast
      </h3>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700"
        >
          {displayHours.map((hour, index) => (
            <div
              key={`${hour.time}-${index}`}
              className="flex min-w-[80px] flex-col items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {index === 0 ? 'Now' : formatHour(hour.time)}
              </span>
              <div className="flex items-center justify-center">
                {getWeatherIcon(hour.conditionCode, hour.isDay, 'sm')}
              </div>
              <span className="text-sm font-semibold text-foreground">
                {Math.round(hour.temperatureC)}°
              </span>
              {hour.precipitation !== undefined && hour.precipitation > 0 && (
                <div className="flex items-center gap-0.5 text-xs text-blue-500">
                  <Droplets className="h-3 w-3" />
                  <span>{hour.precipitation.toFixed(1)}mm</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Left side gradient fade */}
        {showLeftGradient && (
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-linear-to-r from-background to-transparent" />
        )}
        {/* Right side gradient fade */}
        {showRightGradient && (
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-linear-to-l from-background to-transparent" />
        )}
      </div>
    </div>
  )
}
