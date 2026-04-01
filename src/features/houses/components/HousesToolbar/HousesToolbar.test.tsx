import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HousesToolbar } from "./HousesToolbar";

describe("HousesToolbar", () => {
  it("calls onSearchChange when the search field changes", () => {
    const onSearchChange = vi.fn();
    const onFilterChange = vi.fn();

    render(
      <HousesToolbar
        search=""
        onSearchChange={onSearchChange}
        filterMode="all"
        onFilterChange={onFilterChange}
      />,
    );

    const field = screen.getByRole("textbox", { name: /search/i });
    fireEvent.change(field, { target: { value: "oak" } });

    expect(onSearchChange).toHaveBeenCalledWith("oak");
  });

  it("reflects the current search value", () => {
    render(
      <HousesToolbar
        search="Main St"
        onSearchChange={vi.fn()}
        filterMode="all"
        onFilterChange={vi.fn()}
      />,
    );

    const input = screen.getByRole("textbox", { name: /search/i }) as HTMLInputElement;
    expect(input.value).toBe("Main St");
  });
});
