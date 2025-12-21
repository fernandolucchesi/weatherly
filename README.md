---
title: Weatherly
---

## Weatherly

Location-aware weather with city autocomplete, recent searches, and Open-Meteo data. Live at <https://myweatherlyapp.vercel.app/>

### Location flow

- Try device geolocation first
- Fall back to IP-based lookup
- Final fallback: Oslo, Norway (59.9139, 10.7522)
- Note: Geolocation is requested on load for a smoother UX; this trade-off is known to trigger Lighthouse’s “don’t request geolocation on page load” best-practice audit ([Chrome guidance](https://developer.chrome.com/docs/lighthouse/best-practices/geolocation-on-start/?utm_source=lighthouse&utm_medium=devtools)).

### Data sources

- Forecast: Open-Meteo
- Geocoding: Open-Meteo Geocoding
- Reverse geocoding: Nominatim
- IP fallback: ip-api.com

### Running locally

```bash
yarn install
yarn dev
```

### Tests

- Unit
  - `src/services/openMeteoForecast.test.ts`: provider → Weather mapping and error handling
  - `src/services/openMeteoGeocoding.test.ts`: provider → City mapping and error handling
  - `src/services/ipGeolocation.test.ts`: ip-api mapping and validation
- Integration
  - API routes (mocking downstream services):
    - `src/app/api/weather/route.test.ts`
    - `src/app/api/cities/route.test.ts`
    - `src/app/api/reverse-geocode/route.test.ts`
    - `src/app/api/geo/route.test.ts`
  - UI component:
    - `src/components/weather/display/weather-display.test.tsx`

Run all tests:

```bash
yarn test
```

### Tech

- Next.js 16 (App Router), React 19, Tailwind 4
- UI: Shadcn, Weather Icons
- State/data: SWR for city search, custom hooks for weather fetching and location
- Theming: next-themes
- APIs: Open-Meteo (forecast + geocoding), Nominatim reverse geocode, ip-api.com fallback
- Tooling: TypeScript, ESLint, Vitest + Testing Library (unit/integration)
