import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchHousesPage } from "@/features/houses/api/fetchHousesPage";

export const HOUSES_PER_PAGE = 10;

export function useHousesInfiniteQuery() {
  const perPage = HOUSES_PER_PAGE;

  return useInfiniteQuery({
    queryKey: ["houses", perPage],
    queryFn: ({ pageParam }) => fetchHousesPage(pageParam, perPage),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (lastPage.length < perPage) return undefined;
      return lastPageParam + 1;
    },
  });
}
