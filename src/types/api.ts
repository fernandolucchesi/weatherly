/**
 * API Response types
 * These types match the API contracts defined in /docs/api-contracts.md
 */

import type { City, Weather } from './index'

/**
 * Standard API success response shape
 */
export interface ApiSuccessResponse<T> {
  data: T
}

/**
 * Standard API error response shape
 */
export interface ApiErrorResponse {
  error: {
    code: string
    message: string
  }
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Specific API response types
 */
export type CitiesApiResponse = ApiResponse<City[]>
export type WeatherApiResponse = ApiResponse<Weather>

/**
 * Error codes as defined in API contracts
 */
export type ApiErrorCode =
  | 'VALIDATION'
  | 'RATE_LIMITED'
  | 'PROVIDER_ERROR'
  | 'NOT_FOUND'
