import type { FilterMode, House } from '@/features/houses/api/types'

/** Filter-only; order matches API / infinite-query page order. */
export function visibleHousesFrom(
  allHouses: House[],
  filterMode: FilterMode,
  favoriteIds: ReadonlySet<number>,
  search: string
): House[] {
  let list = allHouses
  if (filterMode === 'favorites') {
    list = list.filter((h) => favoriteIds.has(h.id))
  }
  const q = search.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (h) =>
        h.address.toLowerCase().includes(q) ||
        h.homeowner.toLowerCase().includes(q)
    )
  }
  return list
}
