import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useErrorActionAlert } from "./useErrorActionAlert";

describe("useErrorActionAlert", () => {
  it("sets isActing around async onAction", async () => {
    let resolve!: () => void;
    const pending = new Promise<void>(r => {
      resolve = r;
    });
    const onAction = vi.fn(() => pending);

    const { result } = renderHook(() => useErrorActionAlert(onAction));

    expect(result.current.isActing).toBe(false);

    let actionPromise: Promise<void>;
    act(() => {
      actionPromise = result.current.handleAction();
    });
    expect(result.current.isActing).toBe(true);

    await act(async () => {
      resolve();
      await actionPromise!;
    });

    expect(result.current.isActing).toBe(false);
    expect(onAction).toHaveBeenCalledOnce();
  });
});
