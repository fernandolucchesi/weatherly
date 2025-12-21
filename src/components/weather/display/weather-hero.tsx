import type { DailyForecast } from '@/types'
import { getWeatherIcon } from '../utils/weather-icons'

interface WeatherHeroProps {
  temperatureC: number
  weatherCode: number
  isDay?: boolean
  todayForecast?: DailyForecast
}

export function WeatherHero({
  temperatureC,
  weatherCode,
  isDay,
  todayForecast,
}: WeatherHeroProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4">
      <div className="opacity-70">
        {getWeatherIcon(weatherCode, isDay, 'lg')}
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-7xl font-bold text-foreground">
            {Math.round(temperatureC)}
          </span>
          <span className="text-3xl text-muted-foreground">°C</span>
        </div>
        {todayForecast && (
          <div className="text-sm text-muted-foreground">
            H:{Math.round(todayForecast.temperatureMaxC)}° L:
            {Math.round(todayForecast.temperatureMinC)}°
          </div>
        )}
      </div>
    </div>
  )
}
