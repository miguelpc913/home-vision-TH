import { parseHousesApiResponse } from '@/features/houses/api/parseHousesApiResponse'
import type { House } from '@/features/houses/api/types'

const STAGING_BASE = 'https://staging.homevision.co/api_project'

function apiBaseUrl(): string {
  // Dev uses Vite proxy: /api → https://staging.homevision.co/api_project (see vite.config.ts).
  if (import.meta.env.DEV) {
    return '/api'
  }
  return import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? STAGING_BASE
}

/**
 * Fetches one page of houses. Throws on HTTP errors or when the JSON body reports ok: false
 * so React Query can retry and surface error states.
 */
export async function fetchHousesPage(
  page: number,
  perPage: number
): Promise<House[]> {
  const base = apiBaseUrl()
  const url = `${base}/houses?page=${page}&per_page=${perPage}`
  const res = await fetch(url)

  let json: unknown
  try {
    json = await res.json()
  } catch {
    throw new Error('Could not parse response')
  }

  let parsed
  try {
    parsed = parseHousesApiResponse(json)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid response'
    throw new Error(msg)
  }

  if (!res.ok) {
    const msg =
      parsed.ok === false ? parsed.message : res.statusText || `HTTP ${res.status}`
    throw new Error(msg)
  }

  if (!parsed.ok) {
    throw new Error(parsed.message)
  }

  return parsed.houses
}
