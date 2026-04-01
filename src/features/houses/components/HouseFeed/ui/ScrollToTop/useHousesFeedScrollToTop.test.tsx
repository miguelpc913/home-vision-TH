import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useHousesFeedScrollToTop } from "./useHousesFeedScrollToTop";

describe("useHousesFeedScrollToTop", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sets scrolled when scrollY passes threshold", () => {
    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 0 });

    const { result } = renderHook(() => useHousesFeedScrollToTop());

    expect(result.current.scrolled).toBe(false);

    act(() => {
      window.scrollY = 500;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.scrolled).toBe(true);
  });
});
