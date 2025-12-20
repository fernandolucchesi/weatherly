'use client'

import { CitySearch } from '@/components/city-search'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useWeatherContext } from '@/contexts/weather-context'
import { Cloud } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const { handleCitySelect } = useWeatherContext()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex md:grid md:grid-cols-7 h-full items-center gap-4">
          <Link
            href="/"
            className="flex items-center  font-semibold md:col-span-2 shrink-0"
          >
            <Cloud className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-lg sm:text-xl tracking-tighter">
              Weatherly.
            </span>
          </Link>

          <div className="flex flex-1  md:col-span-3 items-center justify-center gap-4 min-w-0">
            <div className="w-full">
              <CitySearch onCitySelect={handleCitySelect} />
            </div>
          </div>

          <div className="shrink-0 md:col-span-2 md:justify-self-end flex">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
