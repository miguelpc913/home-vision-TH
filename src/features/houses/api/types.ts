export type House = {
  id: number
  address: string
  homeowner: string
  price: number
  photoURL: string
}

export type FilterMode = 'all' | 'favorites'

export type HousesSuccessResponse = {
  houses: House[]
  ok: true
}

export type HousesErrorResponse = {
  message: string
  ok: false
}

export type HousesApiResponse = HousesSuccessResponse | HousesErrorResponse
