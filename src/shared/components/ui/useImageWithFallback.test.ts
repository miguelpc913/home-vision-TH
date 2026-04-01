import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useImageWithFallback } from "./useImageWithFallback";

describe("useImageWithFallback", () => {
  it("starts not failed and onImgError sets failed", () => {
    const { result } = renderHook(() => useImageWithFallback());

    expect(result.current.loadFailed).toBe(false);

    act(() => {
      result.current.onImgError();
    });

    expect(result.current.loadFailed).toBe(true);
  });
});
