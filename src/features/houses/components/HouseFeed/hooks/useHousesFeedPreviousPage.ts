import { useLayoutEffect, useRef } from "react";
import type { DocumentScrollSnapshot } from "../utils/restoreScrollAfterPrepend";
import { restoreScrollAfterPrepend } from "../utils/restoreScrollAfterPrepend";

type Params = {
  fetchPreviousPage: () => Promise<unknown>;
  isPending: boolean;
  isFetchingPreviousPage: boolean;
  /** Re-run scroll correction after prepend once query data updates. */
  data: unknown;
};

/**
 * Wraps `fetchPreviousPage` with a document scroll snapshot so the viewport
 * stays anchored after older pages are prepended above the fold.
 */
export function useHousesFeedPreviousPage({
  fetchPreviousPage,
  isPending,
  isFetchingPreviousPage,
  data,
}: Params) {
  const pendingScrollAfterPrependRef = useRef<DocumentScrollSnapshot | null>(null);

  async function handleFetchPreviousPage() {
    pendingScrollAfterPrependRef.current = {
      scrollHeight: document.documentElement.scrollHeight,
      scrollY: window.scrollY,
    };
    await fetchPreviousPage();
  }

  useLayoutEffect(() => {
    if (isPending || isFetchingPreviousPage) return;
    const pendingScroll = pendingScrollAfterPrependRef.current;
    if (!pendingScroll) return;
    restoreScrollAfterPrepend(pendingScroll);
    pendingScrollAfterPrependRef.current = null;
  }, [isPending, isFetchingPreviousPage, data]);

  return { handleFetchPreviousPage };
}
