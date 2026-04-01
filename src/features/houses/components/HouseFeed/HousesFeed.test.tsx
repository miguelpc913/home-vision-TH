import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockHouse } from "@/test/mocks/handlers";
import { renderWithProviders } from "@/test/utils/renderWithProviders";

import { HousesFeed } from "./HousesFeed";

describe("HousesFeed", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("loads listings and renders the grid", async () => {
    const onOpenDetail = vi.fn();

    renderWithProviders(
      <HousesFeed search="" filterMode="all" onOpenDetail={onOpenDetail} />,
    );

    await waitFor(() => {
      expect(screen.getByText(mockHouse.address)).toBeTruthy();
    });
  });

  it("shows empty state when search filters everything out", async () => {
    renderWithProviders(
      <HousesFeed search="__no_match__" filterMode="all" onOpenDetail={vi.fn()} />,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/no houses match your search or filter/i),
      ).toBeTruthy();
    });
  });
});
