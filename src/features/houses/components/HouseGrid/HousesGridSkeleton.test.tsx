import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HousesFeedSkeleton } from "./HousesGridSkeleton";

describe("HousesFeedSkeleton", () => {
  it("renders a grid of placeholder cards", () => {
    const { container } = render(<HousesFeedSkeleton />);
    const items = container.querySelectorAll("ul > li");
    expect(items.length).toBe(9);
  });
});
