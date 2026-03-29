import {
  QueryErrorResetBoundary,
  useQueryErrorResetBoundary,
} from '@tanstack/react-query'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { House } from '@/features/houses/api/types'
import { HouseCard } from '@/features/houses/components/HouseCard'
import type { FilterMode, SortKey } from '@/features/houses/components/HousesToolbar'
import { useFavorites } from '@/features/houses/context/favoritesContext'
import { useHousesInfiniteQuery } from '@/features/houses/hooks/useHousesInfiniteQuery'

type HousesFeedProps = {
  search: string
  sortKey: SortKey
  filterMode: FilterMode
  onOpenDetail: (house: House) => void
}

function visibleHousesFrom(
  allHouses: House[],
  filterMode: FilterMode,
  favoriteIds: ReadonlySet<number>,
  search: string,
  sortKey: SortKey
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
  const sorted = [...list]
  if (sortKey === 'price-asc') {
    sorted.sort((a, b) => a.price - b.price)
  } else if (sortKey === 'price-desc') {
    sorted.sort((a, b) => b.price - a.price)
  } else {
    sorted.sort((a, b) => a.address.localeCompare(b.address))
  }
  return sorted
}

function FeedErrorFallback({
  error,
  onRetry,
}: {
  error: Error
  onRetry: () => void
}) {
  return (
    <Alert variant="destructive" className="max-w-xl">
      <AlertCircle />
      <AlertTitle>Something broke while rendering</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-pretty">{error.message}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 border-destructive/40"
          onClick={onRetry}
        >
          <RefreshCw className="size-4" />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  )
}

function HousesGrid({
  houses,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  footer,
}: {
  houses: House[]
  isFavorite: (id: number) => boolean
  onToggleFavorite: (id: number) => void
  onOpenDetail: (house: House) => void
  footer?: ReactNode
}) {
  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {houses.map((house) => (
          <li key={house.id}>
            <HouseCard
              house={house}
              isFavorite={isFavorite(house.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenDetail={onOpenDetail}
            />
          </li>
        ))}
      </ul>
      {footer}
    </>
  )
}

function HousesFeedInner({
  search,
  sortKey,
  filterMode,
  onOpenDetail,
}: HousesFeedProps) {
  const { reset: resetQueryErrors } = useQueryErrorResetBoundary()
  const { isFavorite, toggleFavorite, favoriteIds } = useFavorites()
  const {
    data,
    error,
    isError,
    isPending,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useHousesInfiniteQuery()

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries[0]?.isIntersecting
        if (hit && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { rootMargin: '240px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const allHouses = data?.pages.flatMap((p) => p) ?? []
  const visibleHouses = visibleHousesFrom(
    allHouses,
    filterMode,
    favoriteIds,
    search,
    sortKey
  )

  if (isError && error) {
    return (
      <Alert variant="destructive" className="max-w-xl">
        <AlertCircle />
        <AlertTitle>Could not load houses</AlertTitle>
        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-pretty">{error.message}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 border-destructive/40"
            onClick={() => {
              resetQueryErrors()
              void refetch()
            }}
          >
            <RefreshCw className="size-4" />
            Refetch
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (isPending) {
    return (
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i}>
            <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
              <Skeleton className="aspect-[4/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </li>
        ))}
      </ul>
    )
  }

  const emptyAfterFilter =
    allHouses.length > 0 &&
    visibleHouses.length === 0 &&
    (filterMode === 'favorites' || search.trim().length > 0)

  return (
    <div className="space-y-6">
      {isFetching && !isFetchingNextPage ? (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Updating…
        </p>
      ) : null}

      {emptyAfterFilter ? (
        <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          No houses match your search or filter. Try adjusting the toolbar
          above.
        </p>
      ) : (
        <HousesGrid
          houses={visibleHouses}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onOpenDetail={onOpenDetail}
          footer={
            <div
              ref={sentinelRef}
              className="flex min-h-12 items-center justify-center py-6"
              aria-hidden
            >
              {isFetchingNextPage ? (
                <span className="text-sm text-muted-foreground">
                  Loading more…
                </span>
              ) : hasNextPage ? (
                <span className="text-xs text-muted-foreground">
                  Scroll for more
                </span>
              ) : allHouses.length > 0 ? (
                <span className="text-xs text-muted-foreground">
                  You have reached the end of the list.
                </span>
              ) : null}
            </div>
          }
        />
      )}

      {!emptyAfterFilter && allHouses.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          No listings returned yet.
        </p>
      ) : null}
    </div>
  )
}

export function HousesFeed(props: HousesFeedProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <FeedErrorFallback
              error={error instanceof Error ? error : new Error(String(error))}
              onRetry={() => {
                reset()
                resetErrorBoundary()
              }}
            />
          )}
        >
          <HousesFeedInner {...props} />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
