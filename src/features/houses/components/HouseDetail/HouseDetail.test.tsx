import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/shared/hooks/useIsMobile", () => ({
  useIsMobile: () => false,
}));

import { mockHouse } from "@/test/mocks/handlers";
import { renderWithProviders } from "@/test/utils/renderWithProviders";

import { HouseDetail } from "./HouseDetail";

describe("HouseDetail", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("renders nothing when house is null", () => {
    renderWithProviders(<HouseDetail house={null} open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows listing content in a dialog when open", async () => {
    renderWithProviders(
      <HouseDetail house={mockHouse} open onOpenChange={vi.fn()} />,
    );

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(dialog.textContent).toContain(mockHouse.address);
      expect(dialog.textContent).toContain(mockHouse.homeowner);
    });
  });
});
