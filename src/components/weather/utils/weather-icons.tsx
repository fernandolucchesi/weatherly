import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudFog,
  Zap,
  Moon,
} from 'lucide-react'
import type { WeatherCondition } from '@/types'

// Maps weather conditions to icons
export function getWeatherIcon(
  condition: WeatherCondition,
  isDay?: boolean,
  size: 'sm' | 'md' | 'lg' = 'md',
) {
  const sizeClass =
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-12 w-12' : 'h-6 w-6'

  switch (condition) {
    case 'clear':
      return isDay ? (
        <Sun className={`${sizeClass} text-yellow-500`} />
      ) : (
        <Moon className={`${sizeClass} text-blue-400`} />
      )
    case 'cloudy':
      return <Cloud className={`${sizeClass} text-gray-400`} />
    case 'rain':
      return <CloudRain className={`${sizeClass} text-blue-500`} />
    case 'snow':
      return <CloudSnow className={`${sizeClass} text-blue-200`} />
    case 'fog':
      return <CloudFog className={`${sizeClass} text-gray-300`} />
    case 'thunder':
      return <Zap className={`${sizeClass} text-yellow-400`} />
    default:
      return <Cloud className={`${sizeClass} text-gray-400`} />
  }
}

// Maps weather conditions to labels
export function getWeatherLabel(condition: WeatherCondition): string {
  switch (condition) {
    case 'clear':
      return 'Clear'
    case 'cloudy':
      return 'Cloudy'
    case 'rain':
      return 'Rain'
    case 'snow':
      return 'Snow'
    case 'fog':
      return 'Fog'
    case 'thunder':
      return 'Thunderstorm'
    default:
      return 'Unknown'
  }
}
