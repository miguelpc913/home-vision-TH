import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useHousesListingUrlState } from "./useHousesListingUrlState";

describe("useHousesListingUrlState", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  it("reads page from URL search params", () => {
    window.history.replaceState(null, "", "/?page=3");

    const { result } = renderHook(() => useHousesListingUrlState());

    expect(result.current.currentPage).toBe(3);
  });

  it("setCurrentPage updates URL and state", () => {
    window.history.replaceState(null, "", "/");

    const replaceSpy = vi.spyOn(window.history, "replaceState");

    const { result } = renderHook(() => useHousesListingUrlState());

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(replaceSpy).toHaveBeenCalled();
    expect(window.location.search).toContain("page=2");
  });
});
