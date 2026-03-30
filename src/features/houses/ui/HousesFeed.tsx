import { useFavorites } from "@/features/houses/context/favoritesContext";
import { useHousesInfiniteQuery } from "@/features/houses/hooks/useHousesInfiniteQuery";
import { visibleHousesFrom } from "@/features/houses/lib/visibleHousesFrom";
import { ErrorActionAlert } from "./ErrorActionAlert";
import { HousesFeedFooter } from "./HousesFeedFooter";
import { HousesFeedSkeleton } from "./HousesGridSkeleton";
import { HousesGrid } from "./HousesGrid";
import type { FilterMode, House } from "@/features/houses/api/types";

type Props = {
  search: string;
  filterMode: FilterMode;
  onOpenDetail: (house: House) => void;
};

export function HousesFeed({ search, filterMode, onOpenDetail }: Props) {
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
        <HousesGrid
          houses={visibleHouses}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onOpenDetail={onOpenDetail}
        />
      )}
      {!isError && !error && hasLoadedSome ? (
        <HousesFeedFooter
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasLoadedListings={allHouses.length > 0}
        />
      ) : null}
      {isError && error ? (
        <ErrorActionAlert
          title={hasLoadedSome ? "Could not load more listings" : "Could not load houses"}
          message={error.message}
          actionLabel="Refetch"
          actionLoadingLabel="Refetching..."
          onAction={fetchNextPage}
          className="mx-auto"
        />
      ) : null}
    </div>
  );
}
