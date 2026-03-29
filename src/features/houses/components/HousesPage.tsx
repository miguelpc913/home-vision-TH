import { useState } from 'react'

import { HousesFeed } from '@/features/houses/components/HousesFeed'
import { HouseDetail } from '@/features/houses/components/HouseDetail'
import {
  HousesToolbar,
  type FilterMode,
  type SortKey,
} from '@/features/houses/components/HousesToolbar'
import type { House } from '@/features/houses/api/types'
import {
  FavoritesProvider,
  useFavorites,
} from '@/features/houses/context/favoritesContext'

function HousesPageContent() {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('price-asc')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [detailHouse, setDetailHouse] = useState<House | null>(null)
  const { isFavorite, toggleFavorite } = useFavorites()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Browse homes
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Listings load in pages as you scroll. Search and sort apply to
          everything loaded so far — the API does not support server-side
          filters.
        </p>
      </header>

      <HousesToolbar
        search={search}
        onSearchChange={setSearch}
        sortKey={sortKey}
        onSortChange={setSortKey}
        filterMode={filterMode}
        onFilterChange={setFilterMode}
      />

      <HousesFeed
        search={search}
        sortKey={sortKey}
        filterMode={filterMode}
        onOpenDetail={setDetailHouse}
      />

      <HouseDetail
        key={detailHouse?.id ?? 'closed'}
        house={detailHouse}
        open={detailHouse !== null}
        onOpenChange={(o) => {
          if (!o) setDetailHouse(null)
        }}
        isFavorite={detailHouse ? isFavorite(detailHouse.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  )
}

export function HousesPage() {
  return (
    <FavoritesProvider>
      <HousesPageContent />
    </FavoritesProvider>
  )
}
