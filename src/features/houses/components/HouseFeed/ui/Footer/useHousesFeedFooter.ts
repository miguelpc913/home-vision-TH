import { useEffect, useRef, type RefObject } from "react";

type Params = {
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export function useHousesFeedFooter({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: Params): { sentinelRef: RefObject<HTMLDivElement | null> } {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => {
        const hit = entries[0]?.isIntersecting;
        if (hit && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "500px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return { sentinelRef };
}
