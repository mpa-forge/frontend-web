import { render, screen } from "@testing-library/react";

import { App } from "./App";

describe("App", () => {
  it("renders the current frontend shell", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "MPA Forge Blueprint" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Phase 1 local frontend baseline.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Missing configuration" })
    ).toBeInTheDocument();
  });
});
