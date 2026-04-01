import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { createTestQueryClient } from "@/test/utils/renderWithProviders";

import { HOUSES_PER_PAGE, useHousesInfiniteQuery } from "./useHousesInfiniteQuery";

describe("useHousesInfiniteQuery", () => {
  it("loads first page via MSW", async () => {
    const queryClient = createTestQueryClient();

    function wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }

    const { result } = renderHook(() => useHousesInfiniteQuery({ startPage: 1 }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.pages[0]).toBeDefined();
    expect(result.current.data?.pages[0]?.length).toBeLessThanOrEqual(HOUSES_PER_PAGE);
  });
});
