import { afterEach, describe, expect, it, vi } from "vitest";

import { scrollToTopWithMotionPreference } from "./scrollToTopWithMotionPreference";

describe("scrollToTopWithMotionPreference", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses smooth scroll when motion is allowed", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      media: "",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    } as unknown as MediaQueryList);

    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    scrollToTopWithMotionPreference();

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("uses auto when reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    } as unknown as MediaQueryList);

    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    scrollToTopWithMotionPreference();

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});
