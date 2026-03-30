import type { House } from '@/features/houses/api/types'
import type { FilterMode } from '@/features/houses/components/HousesToolbar'

export type HousesFeedProps = {
  search: string
  filterMode: FilterMode
  onOpenDetail: (house: House) => void
}
