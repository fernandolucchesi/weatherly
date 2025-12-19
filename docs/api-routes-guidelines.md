# API Routes Guidelines

## Locations

- API routes live in /app/api/**/route.ts
- Provider calls live in /services (adapters)

## /api/geo

- Must run server-side (reads client IP from request headers)
- Used only when browser geolocation is denied or unavailable
- Uses an IP geolocation provider via /services
- Must fall back to default city if provider fails

## Provider usage (Open-Meteo)

- /api/cities calls Open-Meteo Geocoding:
  - resolves query -> candidate locations with lat/lon
- /api/weather calls Open-Meteo Forecast:
  - uses lat/lon to retrieve current weather, 24-hour hourly forecast, and 7-day daily forecast
  - returns normalized Weather object with current conditions, hourly array, and daily array

## Validation (Zod required)

- Validate query params with Zod in every route.
- Never trust request input.
- Never trust provider payloads blindly (validate or defensively map).

## Responsibilities

- route.ts: parse -> validate -> call service -> return normalized response
- /services: fetch from Open-Meteo + map to domain models
- /types: domain models only (City, Weather)

## Output rules

- Never return raw Open-Meteo payloads.
- Always return shapes defined in /docs/api-contracts.md.
- Use consistent error shape and error codes.

## Caching / Rate limiting (recommended)

- /api/weather:
  - cache 5–15 minutes by (lat,lon)
- /api/cities:
  - rate limit (basic) and avoid heavy caching
- /api/geo (if used):
  - short caching is fine

## Error mapping

- 400 VALIDATION (bad input)
- 429 RATE_LIMITED
- 502 PROVIDER_ERROR (timeouts, provider down, unexpected provider response)
- 404 NOT_FOUND (no match / no data)
