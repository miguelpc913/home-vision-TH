import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchHousesPage } from "@/features/houses/api/fetchHousesPage";

export const HOUSES_PER_PAGE = 21;

export const HOUSES_INFINITE_QUERY_KEY = ["houses", HOUSES_PER_PAGE] as const;

export function useHousesInfiniteQuery({ startPage }: { startPage: number }) {
  const perPage = HOUSES_PER_PAGE;

  return useInfiniteQuery({
    queryKey: HOUSES_INFINITE_QUERY_KEY,
    queryFn: ({ pageParam }) => fetchHousesPage(pageParam, perPage),
    initialPageParam: startPage,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (lastPage.length < perPage) return undefined;
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_firstPage, _pages, firstPageParam) => {
      if (firstPageParam <= 1) return undefined;
      return firstPageParam - 1;
    },
  });
}
