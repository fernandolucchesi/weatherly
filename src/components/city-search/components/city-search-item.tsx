'use client'

import type { City } from '@/types'
import { CommandItem } from '@/components/ui/command'
import { formatCityLabel, getCityValue } from '../utils/city-formatters'

interface CitySearchItemProps {
  city: City
  onSelect: (city: City) => void
}

export function CitySearchItem({ city, onSelect }: CitySearchItemProps) {
  return (
    <CommandItem
      key={city.id}
      value={getCityValue(city)}
      onSelect={() => onSelect(city)}
      className="cursor-pointer"
      aria-label={formatCityLabel(city)}
    >
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="font-medium text-foreground truncate">
          {city.name}
          {city.admin1 && (
            <span className="text-muted-foreground">, {city.admin1}</span>
          )}
          {city.admin2 && (
            <span className="text-muted-foreground text-sm">
              , {city.admin2}
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {city.country}
        </div>
      </div>
    </CommandItem>
  )
}

