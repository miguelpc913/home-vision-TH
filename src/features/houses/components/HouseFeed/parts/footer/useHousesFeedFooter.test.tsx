import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useHousesFeedFooter } from "./useHousesFeedFooter";

function SentinelTest({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: {
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}) {
  const { sentinelRef } = useHousesFeedFooter({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });
  return <div ref={sentinelRef} data-testid="sentinel" />;
}

describe("useHousesFeedFooter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("observes sentinel and calls fetchNextPage when intersecting", () => {
    const fetchNextPage = vi.fn().mockResolvedValue(undefined);
    let intersectionCallback: IntersectionObserverCallback | undefined;

    class IntersectionObserverMock {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn();
      root = null;
      rootMargin = "";
      thresholds: number[] = [];

      constructor(cb: IntersectionObserverCallback) {
        intersectionCallback = cb;
      }
    }

    vi.stubGlobal(
      "IntersectionObserver",
      IntersectionObserverMock as unknown as typeof IntersectionObserver,
    );

    function actIntersect(isIntersecting: boolean) {
      act(() => {
        intersectionCallback?.(
          [
            {
              isIntersecting,
              target: document.createElement("div"),
            } as unknown as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        );
      });
    }

    render(
      <SentinelTest fetchNextPage={fetchNextPage} hasNextPage={true} isFetchingNextPage={false} />,
    );

    expect(screen.getByTestId("sentinel")).toBeTruthy();
    expect(intersectionCallback).toBeDefined();

    actIntersect(true);
    expect(fetchNextPage).toHaveBeenCalledOnce();
  });
});
