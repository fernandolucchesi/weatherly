import { Droplets, Gauge } from 'lucide-react'

interface WeatherMetricsProps {
  precipitation?: number
  humidity?: number
}

export function WeatherMetrics({
  precipitation,
  humidity,
}: WeatherMetricsProps) {
  if (precipitation === undefined && humidity === undefined) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-6">
      {precipitation !== undefined && (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full bg-blue-50 p-2.5 dark:bg-blue-950/30">
            <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Precipitation</span>
            <span className="text-base font-semibold text-foreground">
              {precipitation > 0 ? `${precipitation.toFixed(1)} mm` : '0 mm'}
            </span>
          </div>
        </div>
      )}
      {humidity !== undefined && (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full bg-zinc-100 p-2.5 dark:bg-zinc-800">
            <Gauge className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Humidity</span>
            <span className="text-base font-semibold text-foreground">
              {Math.round(humidity)}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
