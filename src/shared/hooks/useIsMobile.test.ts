import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useIsMobile } from "./useIsMobile";

describe("useIsMobile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reflects matchMedia matches", () => {
    const listeners: Array<() => void> = [];
    const mq = {
      matches: true,
      media: "(max-width: 767px)",
      addEventListener: vi.fn((_e: string, cb: () => void) => {
        listeners.push(cb);
      }),
      removeEventListener: vi.fn(),
    };

    vi.spyOn(window, "matchMedia").mockReturnValue(mq as unknown as MediaQueryList);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    mq.matches = false;
    act(() => {
      listeners.forEach(fn => fn());
    });
    expect(result.current).toBe(false);
  });
});
