import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ImageWithFallback } from "./ImageWithFallback";

describe("ImageWithFallback", () => {
  it("shows fallback after the image errors", () => {
    render(
      <ImageWithFallback
        src="https://example.com/missing.jpg"
        alt="Listing"
        fallbackText="Photo unavailable"
      />,
    );

    const img = screen.getByRole("img", { name: "Listing" });
    fireEvent.error(img);

    expect(screen.getByText("Photo unavailable")).toBeTruthy();
    expect(screen.queryByRole("img", { name: "Listing" })).toBeNull();
  });
});
