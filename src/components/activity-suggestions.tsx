import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import type { Weather } from '@/types'

const ACTIVITIES = [
  'Cozy café visit with a book',
  'Quick jog in the park',
  'Museum or gallery drop-in',
  'Stay-in movie marathon',
  'Window shopping + hot chocolate',
  'Board games with friends',
  'Sunset walk and photos',
  'New recipe night at home',
  'Thrift store treasure hunt',
  'Indoor climbing session',
  'Catch a local comedy show',
  'Yoga or stretching session',
  'Photo walk in your neighborhood',
  'Co-working in a new spot',
]

function pickRandom<T>(items: T[], count: number): T[] {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count)
}

export function ActivitySuggestions({ weather }: { weather: Weather | null }) {
  const suggestions = pickRandom(ACTIVITIES, 3)
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>Things to do</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {!weather && (
          <p className="text-sm text-muted-foreground">
            Select a location to see activity ideas.
          </p>
        )}
        {weather && (
          <>
            <ul className="list-disc list-inside text-sm space-y-1">
              {suggestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}
        <a
          href="mailto:fernando@lucalto.com?subject=I%20would%20love%20to%20work%20together"
          className="text-xs text-muted-foreground underline"
        >
          Advertise my business here
        </a>
      </CardContent>
    </Card>
  )
}
