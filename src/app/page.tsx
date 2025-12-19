import { CitySearch } from '@/components/city-search'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex w-full max-w-2xl flex-col gap-8 py-16 px-6 sm:px-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
              City Search
            </h1>
            <p className="text-sm text-muted-foreground">
              Search for cities using the Open-Meteo Geocoding API
            </p>
          </div>
          <ThemeToggle />
        </div>

        <CitySearch />
      </main>
    </div>
  )
}
