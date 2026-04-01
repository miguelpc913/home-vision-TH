import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test/utils/renderWithProviders";

import { Header } from "./Header";

describe("Header", () => {
  it("shows branding and toggles the document dark class", async () => {
    const user = userEvent.setup();

    renderWithProviders(<Header />);

    expect(screen.getByText("HomeVision")).toBeTruthy();

    const wasDark = document.documentElement.classList.contains("dark");
    await user.click(screen.getByRole("button", { name: /switch to (light|dark) theme/i }));

    expect(document.documentElement.classList.contains("dark")).toBe(!wasDark);
  });
});
