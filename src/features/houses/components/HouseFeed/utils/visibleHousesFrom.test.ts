import { describe, expect, it } from "vitest";
import type { House } from "@/features/houses/api/types";
import { visibleHousesFrom } from "./visibleHousesFrom";

const h1: House = {
  id: 1,
  address: "123 Oak Ave",
  homeowner: "Alice",
  price: 1,
  photoURL: "https://x.test/a.jpg",
};
const h2: House = {
  id: 2,
  address: "456 Pine Rd",
  homeowner: "Bob",
  price: 2,
  photoURL: "https://x.test/b.jpg",
};

describe("visibleHousesFrom", () => {
  it("returns all when filter all and empty search", () => {
    expect(visibleHousesFrom([h1, h2], "all", new Set(), "")).toEqual([h1, h2]);
  });

  it("filters to favorites only", () => {
    expect(visibleHousesFrom([h1, h2], "favorites", new Set([2]), "")).toEqual([h2]);
  });

  it("trims and lowercases search for address", () => {
    expect(visibleHousesFrom([h1, h2], "all", new Set(), "  oak  ")).toEqual([h1]);
  });

  it("matches homeowner", () => {
    expect(visibleHousesFrom([h1, h2], "all", new Set(), "bob")).toEqual([h2]);
  });

  it("combines favorites and search", () => {
    expect(visibleHousesFrom([h1, h2], "favorites", new Set([1, 2]), "pine")).toEqual([h2]);
  });
});
