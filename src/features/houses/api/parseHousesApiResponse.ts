import type { House, HousesApiResponse } from './types'

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}

export function parseHousesApiResponse(json: unknown): HousesApiResponse {
  if (!isRecord(json) || typeof json.ok !== 'boolean') {
    throw new Error('Unexpected response shape')
  }
  if (json.ok === false) {
    const message =
      typeof json.message === 'string' ? json.message : 'Request failed'
    return { ok: false, message }
  }
  if (!Array.isArray(json.houses)) {
    throw new Error('Unexpected response shape')
  }
  const houses: House[] = []
  for (const row of json.houses) {
    if (!isRecord(row)) continue
    const id = row.id
    const address = row.address
    const homeowner = row.homeowner
    const price = row.price
    const photoURL = row.photoURL
    if (
      typeof id === 'number' &&
      typeof address === 'string' &&
      typeof homeowner === 'string' &&
      typeof price === 'number' &&
      typeof photoURL === 'string'
    ) {
      houses.push({ id, address, homeowner, price, photoURL })
    }
  }
  return { ok: true, houses }
}
