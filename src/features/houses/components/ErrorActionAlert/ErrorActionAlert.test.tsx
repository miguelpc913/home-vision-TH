import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ErrorActionAlert } from "./ErrorActionAlert";

describe("ErrorActionAlert", () => {
  it("renders title and message", () => {
    render(
      <ErrorActionAlert
        title="Something failed"
        message="Please retry."
        actionLabel="Retry"
        onAction={vi.fn()}
      />,
    );

    expect(screen.getByText("Something failed")).toBeTruthy();
    expect(screen.getByText("Please retry.")).toBeTruthy();
  });

  it("invokes onAction when the action button is clicked", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <ErrorActionAlert
        title="Error"
        message="Details"
        actionLabel="Try again"
        onAction={onAction}
      />,
    );

    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(onAction).toHaveBeenCalledOnce();
  });
});
