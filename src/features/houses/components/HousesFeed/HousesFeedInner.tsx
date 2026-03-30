import { useFavorites } from "@/features/houses/context/favoritesContext";
import { useHousesInfiniteQuery } from "@/features/houses/hooks/useHousesInfiniteQuery";
import { HousesFeedListFooter } from "./HousesFeedListFooter";
import { HousesFeedSkeleton } from "./HousesFeedSkeleton";
import { HousesGrid } from "./HousesGrid";
import { HousesQueryErrorAlert } from "./HousesQueryErrorAlert";
import type { HousesFeedProps } from "./types";
import { visibleHousesFrom } from "./visibleHousesFrom";

export function HousesFeedInner({ search, filterMode, onOpenDetail }: HousesFeedProps) {
  const { isFavorite, toggleFavorite, favoriteIds } = useFavorites();

  const { data, error, isError, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useHousesInfiniteQuery();

  const allHouses = data?.pages.flatMap(p => p) ?? [];
  const visibleHouses = visibleHousesFrom(allHouses, filterMode, favoriteIds, search);

  if (isPending) {
    return <HousesFeedSkeleton />;
  }

  const hasLoadedSome = allHouses.length > 0;

  const emptyAfterFilter =
    allHouses.length > 0 &&
    visibleHouses.length === 0 &&
    (filterMode === "favorites" || search.trim().length > 0);

  return (
    <div className="space-y-6">
      {emptyAfterFilter ? (
        <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          No houses match your search or filter. Try adjusting the toolbar above.
        </p>
      ) : (
        <>
          <HousesGrid
            houses={visibleHouses}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onOpenDetail={onOpenDetail}
          />
        </>
      )}
      {!isError && !error && hasLoadedSome ? (
        <HousesFeedListFooter
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasLoadedListings={allHouses.length > 0}
        />
      ) : null}
      {isError && error ? (
        <HousesQueryErrorAlert
          title={hasLoadedSome ? "Could not load more listings" : "Could not load houses"}
          message={error.message}
          onRefetch={fetchNextPage}
        />
      ) : null}
    </div>
  );
}
