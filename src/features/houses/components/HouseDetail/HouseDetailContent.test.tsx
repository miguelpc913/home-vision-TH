import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { mockHouse } from "@/test/mocks/handlers";

import { HouseDetailContent } from "./HouseDetailContent";

describe("HouseDetailContent", () => {
  it("shows price, homeowner, and toggle label", () => {
    render(
      <HouseDetailContent
        house={mockHouse}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.getByText(/\$250,000/)).toBeTruthy();
    expect(screen.getByText(mockHouse.homeowner)).toBeTruthy();
    expect(screen.getByRole("button", { name: /save/i })).toBeTruthy();
  });

  it("calls onToggleFavorite with house id", async () => {
    const user = userEvent.setup();
    const onToggleFavorite = vi.fn();

    render(
      <HouseDetailContent
        house={mockHouse}
        isFavorite={false}
        onToggleFavorite={onToggleFavorite}
      />,
    );

    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(onToggleFavorite).toHaveBeenCalledWith(mockHouse.id);
  });
});
