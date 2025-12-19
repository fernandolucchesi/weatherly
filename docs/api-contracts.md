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
- admin1?: string (state/province/region)
- admin2?: string (county/district)
- lat: number
- lon: number

### Weather (for main display)

- locationName: string
- temperatureC: number
- conditionCode: WeatherCondition
- isDay?: boolean
- timezone?: string (IANA timezone identifier, e.g., "America/New_York")
- hourly?: HourlyForecast[] (24-hour forecast)
- daily?: DailyForecast[] (7-day forecast)

### WeatherCondition (normalized)

One of:

- clear
- cloudy
- rain
- snow
- fog
- thunder

### HourlyForecast

- time: string (ISO 8601 datetime string)
- temperatureC: number
- conditionCode: WeatherCondition
- isDay?: boolean
- precipitation?: number (mm)
- humidity?: number (percentage)

### DailyForecast

- date: string (YYYY-MM-DD format)
- temperatureMaxC: number
- temperatureMinC: number
- conditionCode: WeatherCondition
- precipitation?: number (mm)
- precipitationProbability?: number (percentage)

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

## GET /api/weather?lat=&lon=&locationName=

Purpose: fetch current weather and forecasts (24-hour hourly + 7-day daily) for coordinates using Open-Meteo Forecast.

Query:

- lat: number (latitude, -90 to 90)
- lon: number (longitude, -180 to 180)
- locationName: string (optional, defaults to coordinates if not provided)

200:
{ "data": Weather }

The Weather object includes:

- Current weather (temperature, condition, isDay)
- Optional timezone (IANA timezone identifier)
- Optional hourly array (24-hour forecast with hourly temperature, condition, precipitation, humidity)
- Optional daily array (7-day forecast with daily min/max temperatures, condition, precipitation probability)

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
