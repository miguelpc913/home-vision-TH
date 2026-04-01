import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { House } from "@/features/houses/api/types";

import { HousesGrid } from "./HousesGrid";

const houses: House[] = [
  {
    id: 1,
    address: "A St",
    homeowner: "Alice",
    price: 100_000,
    photoURL: "https://example.com/a.jpg",
  },
  {
    id: 2,
    address: "B Rd",
    homeowner: "Bob",
    price: 200_000,
    photoURL: "https://example.com/b.jpg",
  },
];

describe("HousesGrid", () => {
  it("renders one card per house", () => {
    render(
      <HousesGrid
        houses={houses}
        isFavorite={() => false}
        onToggleFavorite={vi.fn()}
        onOpenDetail={vi.fn()}
      />,
    );

    expect(screen.getByText("A St")).toBeTruthy();
    expect(screen.getByText("B Rd")).toBeTruthy();
  });

  it("passes favorite state per id", () => {
    render(
      <HousesGrid
        houses={houses}
        isFavorite={id => id === 1}
        onToggleFavorite={vi.fn()}
        onOpenDetail={vi.fn()}
      />,
    );

    const pressed = screen.getAllByRole("button", { name: /favorites/i }).filter(
      b => b.getAttribute("aria-pressed") === "true",
    );
    expect(pressed).toHaveLength(1);
  });
});
