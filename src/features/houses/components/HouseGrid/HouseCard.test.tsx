import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { mockHouse } from "@/test/mocks/handlers";
import { HouseCard } from "./HouseCard";

describe("HouseCard", () => {
  it("renders address, owner, and price", () => {
    render(
      <HouseCard
        house={mockHouse}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        onOpenDetail={vi.fn()}
      />,
    );

    expect(screen.getByText(mockHouse.address)).toBeTruthy();
    expect(screen.getByText(mockHouse.homeowner)).toBeTruthy();
    expect(screen.getByText(/\$250,000/)).toBeTruthy();
  });

  it("opens detail when the card is activated", async () => {
    const user = userEvent.setup();
    const onOpenDetail = vi.fn();

    render(
      <HouseCard
        house={mockHouse}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        onOpenDetail={onOpenDetail}
      />,
    );

    await user.click(screen.getByRole("button", { name: new RegExp(mockHouse.address, "i") }));
    expect(onOpenDetail).toHaveBeenCalledWith(mockHouse);
  });

  it("toggles favorite without opening detail", async () => {
    const user = userEvent.setup();
    const onToggleFavorite = vi.fn();
    const onOpenDetail = vi.fn();

    render(
      <HouseCard
        house={mockHouse}
        isFavorite={false}
        onToggleFavorite={onToggleFavorite}
        onOpenDetail={onOpenDetail}
      />,
    );

    await user.click(screen.getByRole("button", { name: /add to favorites/i }));
    expect(onToggleFavorite).toHaveBeenCalledWith(mockHouse.id);
    expect(onOpenDetail).not.toHaveBeenCalled();
  });
});
