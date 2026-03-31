import { useEffect, useLayoutEffect, useRef } from "react";
import { useFavorites } from "@/features/houses/context/favoritesContext";
import { useHousesInfiniteQuery } from "@/features/houses/hooks/useHousesInfiniteQuery";
import { useHousesListingUrlState } from "@/features/houses/hooks/useHousesListingUrlState";
import { visibleHousesFrom } from "@/features/houses/lib/visibleHousesFrom";
import type { FilterMode, House } from "@/features/houses/api/types";
import { ErrorActionAlert } from "./ErrorActionAlert";
import { HousesFeedFooter } from "./HousesFeedFooter";
import { HousesFeedPreviousControls } from "./HousesFeedPreviousControls";
import { HousesFeedScrollToTop } from "./HousesFeedScrollToTop";
import { HousesFeedSkeleton } from "./HousesGridSkeleton";
import { HousesGrid } from "./HousesGrid";

type Props = {
  search: string;
  filterMode: FilterMode;
  onOpenDetail: (house: House) => void;
};

export function HousesFeed({ search, filterMode, onOpenDetail }: Props) {
  const pendingScrollAfterPrependRef = useRef<{
    scrollHeight: number;
    scrollY: number;
  } | null>(null);

  const { currentPage, setCurrentPage: onCurrentPageChange } = useHousesListingUrlState();
  const { isFavorite, toggleFavorite, favoriteIds } = useFavorites();
  const {
    data,
    error,
    isError,
    isPending,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isFetchPreviousPageError,
    isFetchNextPageError,
  } = useHousesInfiniteQuery({ startPage: currentPage });

  const loadedParams = (data?.pageParams ?? []) as number[];
  const loadedMax = loadedParams.length ? Math.max(...loadedParams) : currentPage;

  // Persist only current page in URL; previous window remains in-memory.
  useEffect(() => {
    if (loadedMax !== currentPage) {
      onCurrentPageChange(loadedMax);
    }
  }, [currentPage, loadedMax, onCurrentPageChange]);

  async function handleFetchPreviousPage() {
    pendingScrollAfterPrependRef.current = {
      scrollHeight: document.documentElement.scrollHeight,
      scrollY: window.scrollY,
    };
    await fetchPreviousPage();
  }

  useLayoutEffect(() => {
    if (isPending || isFetchingPreviousPage) return;
    const pending = pendingScrollAfterPrependRef.current;
    if (!pending) return;
    const delta = document.documentElement.scrollHeight - pending.scrollHeight;
    window.scrollTo({ top: pending.scrollY + delta, left: 0, behavior: "auto" });
    pendingScrollAfterPrependRef.current = null;
  }, [isPending, isFetchingPreviousPage, data]);

  if (isPending) {
    return <HousesFeedSkeleton />;
  }

  const allHouses = data?.pages.flatMap(p => p) ?? [];
  const visibleHouses = visibleHousesFrom(allHouses, filterMode, favoriteIds, search);
  const hasLoadedSome = allHouses.length > 0;
  const emptyAfterFilter =
    allHouses.length > 0 &&
    visibleHouses.length === 0 &&
    (filterMode === "favorites" || search.trim().length > 0);

  const showInfiniteFooter = hasLoadedSome && !isError && !isFetchNextPageError && !error;

  const showPreviousControls =
    hasLoadedSome && !isFetchPreviousPageError && !error && hasPreviousPage;

  return (
    <div className="relative space-y-6">
      {showPreviousControls ? (
        <HousesFeedPreviousControls
          fetchPreviousPage={handleFetchPreviousPage}
          hasPreviousPage={hasPreviousPage}
          isFetchingPreviousPage={isFetchingPreviousPage}
        />
      ) : null}

      {isFetchPreviousPageError && error ? (
        <ErrorActionAlert
          title="Could not load earlier listings"
          message={error.message}
          actionLabel="Try again"
          actionLoadingLabel="Retrying..."
          onAction={handleFetchPreviousPage}
          className="mx-auto"
        />
      ) : null}

      {emptyAfterFilter ? (
        <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          No houses match your search or filter. Try adjusting the toolbar above.
        </p>
      ) : (
        <HousesGrid
          houses={visibleHouses}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onOpenDetail={onOpenDetail}
        />
      )}
      {showInfiniteFooter ? (
        <HousesFeedFooter
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasLoadedListings={allHouses.length > 0}
        />
      ) : null}
      {isError && error && !isFetchPreviousPageError ? (
        <ErrorActionAlert
          title={hasLoadedSome ? "Could not load more listings" : "Could not load houses"}
          message={error.message}
          actionLabel="Refetch"
          actionLoadingLabel="Refetching..."
          onAction={fetchNextPage}
          className="mx-auto"
        />
      ) : null}

      {hasLoadedSome ? (
        <HousesFeedScrollToTop onReturnToFirstPage={() => onCurrentPageChange(1)} />
      ) : null}
    </div>
  );
}
