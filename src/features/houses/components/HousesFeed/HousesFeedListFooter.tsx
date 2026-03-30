import { useEffect, useRef } from 'react'

type HousesFeedListFooterProps = {
  fetchNextPage: () => Promise<unknown>
  hasNextPage: boolean
  isFetchingNextPage: boolean
  /** True when at least one house has been loaded (for end-of-list copy). */
  hasLoadedListings: boolean
}

export function HousesFeedListFooter({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  hasLoadedListings,
}: HousesFeedListFooterProps) {
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
      { rootMargin: '500px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div
      ref={sentinelRef}
      className="flex min-h-12 items-center justify-center py-6"
      aria-hidden
    >
      {isFetchingNextPage ? (
        <span className="text-sm text-muted-foreground">Loading more…</span>
      ) : hasNextPage ? (
        <span className="text-xs text-muted-foreground">Scroll for more</span>
      ) : hasLoadedListings ? (
        <span className="text-xs text-muted-foreground">
          You have reached the end of the list.
        </span>
      ) : null}
    </div>
  )
}
