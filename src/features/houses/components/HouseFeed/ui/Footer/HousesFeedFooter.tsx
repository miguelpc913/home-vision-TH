import { Loader2 } from "lucide-react";
import { useHousesFeedFooter } from "./useHousesFeedFooter";

type Props = {
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  /** True when at least one house has been loaded (for end-of-list copy). */
  hasLoadedListings: boolean;
};

export function HousesFeedFooter({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  hasLoadedListings,
}: Props) {
  const { sentinelRef } = useHousesFeedFooter({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <div ref={sentinelRef} className="flex min-h-12 items-center justify-center py-6" aria-hidden>
      {isFetchingNextPage ? (
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading more…
        </span>
      ) : hasNextPage ? (
        <span className="text-xs text-muted-foreground">Scroll for more</span>
      ) : hasLoadedListings ? (
        <span className="text-xs text-muted-foreground">You have reached the end of the list.</span>
      ) : null}
    </div>
  );
}
