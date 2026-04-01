import type { FilterMode, House } from "@/features/houses/api/types";
import { useHousesFeed } from "./hooks/useHousesFeed";
import { ErrorActionAlert } from "../ErrorActionAlert/ErrorActionAlert";
import { Footer } from "./parts/footer/Footer";
import { PreviousPageControls } from "./parts/previousPage/PreviousPageControls";
import { ScrollToTopButton } from "./parts/scrollToTop/ScrollToTopButton";
import { HousesFeedSkeleton } from "../HouseGrid/HousesGridSkeleton";
import { HousesGrid } from "../HouseGrid/HousesGrid";

type Props = {
  search: string;
  filterMode: FilterMode;
  onOpenDetail: (house: House) => void;
};

export function HousesFeed({ search, filterMode, onOpenDetail }: Props) {
  const {
    isPending,
    visibleHouses,
    isFavorite,
    toggleFavorite,
    handleFetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    isFetchPreviousPageError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    hasLoadedSome,
    allHousesLength,
    error,
    isError,
    emptyAfterFilter,
    showInfiniteFooter,
    showPreviousControls,
    onReturnToFirstPage,
  } = useHousesFeed({ search, filterMode });

  if (isPending) {
    return <HousesFeedSkeleton />;
  }

  return (
    <div className="relative space-y-6">
      {showPreviousControls ? (
        <PreviousPageControls
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
        <Footer
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasLoadedListings={allHousesLength > 0}
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

      {hasLoadedSome ? <ScrollToTopButton onReturnToFirstPage={onReturnToFirstPage} /> : null}
    </div>
  );
}
