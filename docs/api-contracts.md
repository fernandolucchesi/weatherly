# API Contracts

All API routes return JSON.

## Success shape

{ "data": ... }

## Error shape

{ "error": { "code": string, "message": string } }

---

## Domain Models (normalized)

### City

- id: string (stable id, e.g. "lat,lon" or provider id)
- name: string
- country: string (or country_code)
- lat: number
- lon: number

### Weather (for main display)

- locationName: string
- temperatureC: number
- conditionCode: WeatherCondition
- isDay?: boolean

### WeatherCondition (normalized)

One of:

- clear
- cloudy
- rain
- snow
- fog
- thunder

## GET /api/cities?query=

Purpose: autocomplete city search using Open-Meteo Geocoding.

Query:

- query: string (min length enforced)

200:
{ "data": City[] }

Errors:

- 400 { error.code = "VALIDATION" }
- 429 { error.code = "RATE_LIMITED" }
- 502 { error.code = "PROVIDER_ERROR" }

---

## GET /api/weather?lat=&lon=

Purpose: fetch weather for coordinates using Open-Meteo Forecast.

Query:

- lat: number
- lon: number

200:
{ "data": Weather }

Errors:

- 400 VALIDATION (missing/invalid lat/lon)
- 404 NOT_FOUND (no weather available / invalid location)
- 502 PROVIDER_ERROR (Open-Meteo unreachable/failed)

---

## GET /api/geo

Purpose: fallback coordinates when browser geolocation is denied/unavailable.

200:
{ "data": { "lat": number, "lon": number, "accuracy": "approx" | "default" } }

Errors:

- 502 PROVIDER_ERROR (IP geo provider failed)
