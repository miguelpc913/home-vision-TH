import { useEffect } from "react";
import { useFavorites } from "@/features/houses/context/favoritesContext";
import { useHousesInfiniteQuery } from "./useHousesInfiniteQuery";
import { useHousesListingUrlState } from "./useHousesListingUrlState";
import { useHousesFeedPreviousPage } from "./useHousesFeedPreviousPage";
import { visibleHousesFrom } from "@/features/houses/components/HouseFeed/utils/visibleHousesFrom";
import type { FilterMode } from "@/features/houses/api/types";

type Params = {
  search: string;
  filterMode: FilterMode;
};

export function useHousesFeed({ search, filterMode }: Params) {
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

  const { handleFetchPreviousPage } = useHousesFeedPreviousPage({
    fetchPreviousPage,
    isPending,
    isFetchingPreviousPage,
    data,
  });

  const loadedParams = (data?.pageParams ?? []) as number[];
  const loadedMax = loadedParams.length ? Math.max(...loadedParams) : currentPage;

  useEffect(() => {
    if (loadedMax !== currentPage) {
      onCurrentPageChange(loadedMax);
    }
  }, [currentPage, loadedMax, onCurrentPageChange]);

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

  return {
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
    allHousesLength: allHouses.length,
    error,
    isError,
    emptyAfterFilter,
    showInfiniteFooter,
    showPreviousControls,
    onReturnToFirstPage: () => onCurrentPageChange(1),
  };
}
