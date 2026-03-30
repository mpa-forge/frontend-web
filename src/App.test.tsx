import { vi } from "vitest";
import { render, screen } from "@testing-library/react";

const { authState, loadCurrentUserProfile, runtimeState } = vi.hoisted(() => ({
  runtimeState: {
    envValues: {
      VITE_APP_ENV: "local",
      VITE_API_BASE_URL: "http://localhost:8080",
      VITE_CLERK_PUBLISHABLE_KEY: "pk_test_live_configured",
      VITE_CLERK_SIGN_IN_URL: "/sign-in",
      VITE_CLERK_SIGN_UP_URL: "/sign-up"
    },
    missingVars: [] as string[]
  },
  authState: {
    isAuthConfigured: true,
    isLoaded: true,
    isSignedIn: false,
    getToken: vi.fn(async () => "test-token"),
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
    userDisplayName: null as string | null
  },
  loadCurrentUserProfile: vi.fn()
}));

vi.mock("./stores/runtimeStore", () => ({
  envValues: runtimeState.envValues,
  useRuntimeStore: (selector: (state: typeof runtimeState) => unknown) =>
    selector(runtimeState)
}));

vi.mock("./auth/FrontendAuthProvider", () => ({
  useFrontendAuth: () => authState
}));

vi.mock("./features/current-user/loadCurrentUserProfile", () => ({
  loadCurrentUserProfile
}));

import { App } from "./App";

describe("App", () => {
  beforeEach(() => {
    authState.isAuthConfigured = true;
    authState.isLoaded = true;
    authState.isSignedIn = false;
    authState.userDisplayName = null;
    runtimeState.missingVars = [];
    loadCurrentUserProfile.mockReset();
  });

  it("renders the unauthenticated protected profile state", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "MPA Forge Blueprint" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Phase 2 generated frontend contract-client baseline.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Sign in required to load the protected current-user profile."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/sign-in"
    );
  });

  it("renders the protected profile returned by the generated client flow", async () => {
    authState.isSignedIn = true;
    authState.userDisplayName = "Casey Example";
    loadCurrentUserProfile.mockResolvedValue({
      userId: "user_123",
      email: "casey@example.com",
      displayName: "Casey Example",
      role: "user"
    });

    render(<App />);

    expect(
      screen.getByText("Loading current user profile...")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Signed in as Casey Example.")
    ).toBeInTheDocument();
    expect(screen.getByText("Email: casey@example.com")).toBeInTheDocument();
    expect(screen.getByText("Role: user")).toBeInTheDocument();
  });

  it("renders a protected API error state when the profile request fails", async () => {
    authState.isSignedIn = true;
    loadCurrentUserProfile.mockRejectedValue(new Error("401 Unauthorized"));

    render(<App />);

    expect(
      await screen.findByText("Protected API error: 401 Unauthorized")
    ).toBeInTheDocument();
  });
});
