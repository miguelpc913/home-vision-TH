import { afterEach, describe, expect, it, vi } from "vitest";

import { restoreScrollAfterPrepend } from "./restoreScrollAfterPrepend";

describe("restoreScrollAfterPrepend", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("adjusts scroll by document height delta", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(3000);

    restoreScrollAfterPrepend({ scrollHeight: 2500, scrollY: 400 });

    expect(scrollTo).toHaveBeenCalledWith({
      top: 900,
      left: 0,
      behavior: "auto",
    });
  });
});
