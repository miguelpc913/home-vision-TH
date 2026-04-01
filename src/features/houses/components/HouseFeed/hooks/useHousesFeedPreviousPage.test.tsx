import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useHousesFeedPreviousPage } from "./useHousesFeedPreviousPage";

describe("useHousesFeedPreviousPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls fetchPreviousPage after capturing scroll snapshot", async () => {
    const fetchPreviousPage = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(800);
    Object.defineProperty(window, "scrollY", { value: 120, configurable: true, writable: true });

    const { result } = renderHook(() =>
      useHousesFeedPreviousPage({
        fetchPreviousPage,
        isPending: false,
        isFetchingPreviousPage: false,
        data: { v: 1 },
      }),
    );

    await act(async () => {
      await result.current.handleFetchPreviousPage();
    });

    expect(fetchPreviousPage).toHaveBeenCalledOnce();
  });
});
