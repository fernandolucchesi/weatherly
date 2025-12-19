import { CitySearch } from '@/components/city-search'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-8 py-16 px-6 sm:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50">
            City Search
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Search for cities using the Open-Meteo Geocoding API
          </p>
        </div>

        <CitySearch />
      </main>
    </div>
  )
}
