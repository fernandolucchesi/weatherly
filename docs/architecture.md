# Architecture

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zod for runtime validation
- SWR for data fetching with automatic caching, deduplication, and background revalidation

## External APIs

- Open-Meteo Geocoding: resolves city text -> coordinates (lat/lon)
- Open-Meteo Forecast: retrieves weather using coordinates (lat/lon)
- Nominatim: reverse geocoding (lat/lon -> location name)
- ip-api.com: IP-based geolocation fallback

## Canonical Location Rule

- Internally, locations are identified by latitude/longitude.
- City name is a label only (ambiguous). Coordinates are source of truth.
- Recent searches store the selected location (name + country + lat/lon).

## Default location strategy

1) Browser geolocation on load (smoother UX; acknowledged Lighthouse trade-off)
2) Server IP-based geolocation via `/api/geo` (approx)
3) Default city fallback (deterministic; Oslo, Norway)

## Rules

- UI components NEVER call Open-Meteo directly.
- UI calls only internal Next.js API routes under /app/api.
- API routes call provider adapters in /services.
- API routes normalize output into domain models in /types.
- API responses are stable: { data } on success, { error } on failure.
- Weather uses WMO weather codes (0-99) and optional isDay flag; labels/icons derived client-side.

## Data Flow

UI -> /app/api/cities -> Open-Meteo Geocoding
UI -> /app/api/weather -> Open-Meteo Forecast
UI -> /app/api/reverse-geocode -> Nominatim
UI -> /app/api/geo -> ip-api.com

## Conventions

- Prefer named React imports (e.g., `import { useState } from 'react'`) rather than namespace imports.
