import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { mockHouse } from "@/test/mocks/handlers";
import { renderWithProviders } from "@/test/utils/renderWithProviders";

import { HousesPage } from "./HousesPage";

describe("HousesPage", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("renders the page chrome and loads the feed", async () => {
    renderWithProviders(<HousesPage />);

    expect(screen.getByRole("heading", { name: /browse homes/i })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: /search/i })).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText(mockHouse.address)).toBeTruthy();
    });
  });
});
