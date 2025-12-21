import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Weather } from '@/types'
import { useEffect, useState } from 'react'
import { getOutfitRecommendation, type OutfitAdvice } from '@/lib/outfit'
import { Loader2, Sparkles } from 'lucide-react'

interface OutfitRecommendationsProps {
  weather: Weather | null
}

export function OutfitRecommendations({ weather }: OutfitRecommendationsProps) {
  const [advice, setAdvice] = useState<OutfitAdvice | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchAdvice = async () => {
      if (!weather) {
        setAdvice(null)
        return
      }
      setLoading(true)
      try {
        const res = await fetch('/api/outfit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ weather }),
        })
        if (!res.ok) throw new Error('failed')
        const data = (await res.json()) as { data?: OutfitAdvice }
        if (cancelled) return
        if (data.data) {
          setAdvice(data.data)
        } else {
          setAdvice(getOutfitRecommendation(weather))
        }
      } catch {
        if (cancelled) return
        setAdvice(getOutfitRecommendation(weather))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchAdvice()

    return () => {
      cancelled = true
    }
  }, [weather])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <span>Weather Happens</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-5">
        {!weather && (
          <p className="text-sm text-muted-foreground">
            Select a city or use your location to see outfit tips.
          </p>
        )}
        {weather && loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Getting outfit tips…</span>
          </div>
        )}
        {weather && advice && !loading && (
          <>
            <p className="text-sm">{advice.text}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
