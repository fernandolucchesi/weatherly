import { cn } from '@/lib/utils'

/**
 * Maps WMO weather codes (0-99) to weather-icons CSS class names
 * Based on WMO Weather interpretation codes (WW)
 * Weather-icons library: https://erikflowers.github.io/weather-icons/
 */
function getWeatherIconClass(
  weatherCode: number,
  isDay: boolean = true,
): string {
  // Clear sky
  if (weatherCode === 0) {
    return isDay ? 'wi-day-sunny' : 'wi-night-clear'
  }

  // Mainly clear (1)
  if (weatherCode === 1) {
    return isDay ? 'wi-day-sunny-overcast' : 'wi-night-alt-partly-cloudy'
  }

  // Partly cloudy (2)
  if (weatherCode === 2) {
    return isDay ? 'wi-day-cloudy' : 'wi-night-alt-cloudy'
  }

  // Overcast (3)
  if (weatherCode === 3) {
    return 'wi-cloudy'
  }

  // Fog and depositing rime fog (45, 48)
  if (weatherCode === 45 || weatherCode === 48) {
    return 'wi-fog'
  }

  // Drizzle: Light, moderate, and dense intensity (51-53)
  if (weatherCode >= 51 && weatherCode <= 53) {
    return isDay ? 'wi-day-sprinkle' : 'wi-night-alt-sprinkle'
  }

  // Freezing Drizzle: Light and dense intensity (56-57)
  if (weatherCode >= 56 && weatherCode <= 57) {
    return 'wi-sleet'
  }

  // Rain: Slight, moderate and heavy intensity (61-63)
  if (weatherCode >= 61 && weatherCode <= 63) {
    return isDay ? 'wi-day-rain' : 'wi-night-alt-rain'
  }

  // Freezing Rain: Light and heavy intensity (66-67)
  if (weatherCode >= 66 && weatherCode <= 67) {
    return 'wi-rain-mix'
  }

  // Snow fall: Slight, moderate, and heavy intensity (71-73)
  if (weatherCode >= 71 && weatherCode <= 73) {
    return isDay ? 'wi-day-snow' : 'wi-night-alt-snow'
  }

  // Snow grains (77)
  if (weatherCode === 77) {
    return 'wi-snowflake-cold'
  }

  // Rain showers: Slight, moderate, and violent (80-82)
  if (weatherCode >= 80 && weatherCode <= 82) {
    return isDay ? 'wi-day-showers' : 'wi-night-alt-showers'
  }

  // Snow showers slight and heavy (85-86)
  if (weatherCode >= 85 && weatherCode <= 86) {
    return isDay ? 'wi-day-snow-thunderstorm' : 'wi-night-alt-snow-thunderstorm'
  }

  // Thunderstorm: Slight or moderate (95)
  if (weatherCode === 95) {
    return isDay ? 'wi-day-thunderstorm' : 'wi-night-alt-thunderstorm'
  }

  // Thunderstorm with slight and heavy hail (96-99)
  if (weatherCode >= 96 && weatherCode <= 99) {
    return isDay ? 'wi-day-storm-showers' : 'wi-night-alt-storm-showers'
  }

  // Default fallback
  return isDay ? 'wi-day-cloudy' : 'wi-night-alt-cloudy'
}

/**
 * Maps WMO weather codes to human-readable labels
 */
export function getWeatherLabel(weatherCode: number): string {
  // Clear sky
  if (weatherCode === 0) return 'Clear sky'

  // Mainly clear
  if (weatherCode === 1) return 'Mainly clear'

  // Partly cloudy
  if (weatherCode === 2) return 'Partly cloudy'

  // Overcast
  if (weatherCode === 3) return 'Overcast'

  // Fog
  if (weatherCode === 45) return 'Fog'
  if (weatherCode === 48) return 'Depositing rime fog'

  // Drizzle
  if (weatherCode === 51) return 'Light drizzle'
  if (weatherCode === 53) return 'Moderate drizzle'
  if (weatherCode === 55) return 'Dense drizzle'

  // Freezing Drizzle
  if (weatherCode === 56) return 'Light freezing drizzle'
  if (weatherCode === 57) return 'Dense freezing drizzle'

  // Rain
  if (weatherCode === 61) return 'Slight rain'
  if (weatherCode === 63) return 'Moderate rain'
  if (weatherCode === 65) return 'Heavy rain'

  // Freezing Rain
  if (weatherCode === 66) return 'Light freezing rain'
  if (weatherCode === 67) return 'Heavy freezing rain'

  // Snow fall
  if (weatherCode === 71) return 'Slight snow fall'
  if (weatherCode === 73) return 'Moderate snow fall'
  if (weatherCode === 75) return 'Heavy snow fall'

  // Snow grains
  if (weatherCode === 77) return 'Snow grains'

  // Rain showers
  if (weatherCode === 80) return 'Slight rain showers'
  if (weatherCode === 81) return 'Moderate rain showers'
  if (weatherCode === 82) return 'Violent rain showers'

  // Snow showers
  if (weatherCode === 85) return 'Slight snow showers'
  if (weatherCode === 86) return 'Heavy snow showers'

  // Thunderstorm
  if (weatherCode === 95) return 'Thunderstorm'

  // Thunderstorm with hail
  if (weatherCode === 96) return 'Thunderstorm with slight hail'
  if (weatherCode === 97) return 'Thunderstorm with moderate hail'
  if (weatherCode === 98) return 'Thunderstorm with heavy sandstorm'
  if (weatherCode === 99) return 'Thunderstorm with heavy hail'

  return 'Unknown'
}

/**
 * Gets weather icon component using weather-icons library
 * @param weatherCode - WMO weather code (0-99)
 * @param isDay - Whether it's daytime
 * @param size - Icon size
 */
export function getWeatherIcon(
  weatherCode: number,
  isDay?: boolean,
  size: 'sm' | 'md' | 'lg' = 'md',
) {
  const iconClass = getWeatherIconClass(weatherCode, isDay ?? true)

  return (
    <i
      className={cn(
        'wi',
        iconClass,
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-lg',
        size === 'lg' && 'text-5xl',
      )}
      aria-hidden="true"
    />
  )
}
