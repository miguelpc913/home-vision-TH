import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import type { House } from "@/features/houses/api/types";
import { FavoritesProvider } from "@/features/houses/context/favoritesContext";
import { ThemeProvider } from "@/shared/context/themeContext";

import { useHousesPage } from "./useHousesPage";

const house: House = {
  id: 9,
  address: "x",
  homeowner: "y",
  price: 1,
  photoURL: "https://x",
};

function wrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </ThemeProvider>
  );
}

describe("useHousesPage", () => {
  it("opens and closes detail", () => {
    const { result } = renderHook(() => useHousesPage(), { wrapper });

    expect(result.current.detailHouse).toBe(null);
    expect(result.current.detailOpen).toBe(false);

    act(() => {
      result.current.openDetail(house);
    });
    expect(result.current.detailHouse).toEqual(house);
    expect(result.current.detailOpen).toBe(true);

    act(() => {
      result.current.onDetailOpenChange(false);
    });
    expect(result.current.detailHouse).toBe(null);
  });
});
