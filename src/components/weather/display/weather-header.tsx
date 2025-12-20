import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { getWeatherLabel } from '../utils/weather-icons'
import {
  formatCurrentTime,
  formatCurrentDateShort,
} from '../utils/date-formatters'

interface WeatherHeaderProps {
  locationName: string
  weatherCode: number
  timezone: string
}

export function WeatherHeader({
  locationName,
  weatherCode,
  timezone,
}: WeatherHeaderProps) {
  const currentTime = formatCurrentTime(timezone)
  const currentDate = formatCurrentDateShort(timezone)

  return (
    <CardHeader>
      <div className="flex flex-col gap-1 items-center text-center">
        <CardTitle className="text-xl">{locationName}</CardTitle>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{currentDate}</span>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>{currentTime}</span>
          </div>
        </div>
        <Badge variant="outline" className="w-fit text-xs">
          {getWeatherLabel(weatherCode)}
        </Badge>
      </div>
    </CardHeader>
  )
}
