import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

const { authState, currentUserProfileState, runtimeState } = vi.hoisted(() => ({
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
    signOut: vi.fn(async () => undefined),
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
    userDisplayName: null as string | null
  },
  currentUserProfileState: {
    status: "loading"
  } as Record<string, unknown>
}));

vi.mock("./stores/runtimeStore", () => ({
  envValues: runtimeState.envValues,
  useRuntimeStore: (selector: (state: typeof runtimeState) => unknown) =>
    selector(runtimeState)
}));

vi.mock("./auth/FrontendAuthProvider", () => ({
  useFrontendAuth: () => authState
}));

vi.mock("./api/currentUserProfile", () => ({
  useCurrentUserProfileData: () => currentUserProfileState
}));

import { App } from "./App";

function renderAppAt(pathname: string) {
  window.history.replaceState({}, "", pathname);

  return render(<App />);
}

describe("App", () => {
  beforeEach(() => {
    authState.isAuthConfigured = true;
    authState.isLoaded = true;
    authState.isSignedIn = false;
    authState.userDisplayName = null;
    runtimeState.missingVars = [];
    authState.signOut.mockReset();
    currentUserProfileState.status = "loading";
  });

  it("redirects unauthenticated protected visits to the sign-in route", async () => {
    renderAppAt("/");

    expect(
      await screen.findByRole("heading", { name: "Sign in" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Requested post-auth redirect target: /")
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/sign-in");
  });

  it("renders an auth-unavailable state when Clerk is not configured", () => {
    authState.isAuthConfigured = false;

    renderAppAt("/");

    expect(
      screen.getByRole("heading", { name: "Authentication unavailable" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Runtime" })
    ).toBeInTheDocument();
  });

  it("renders the protected shell and current-user profile for authenticated users", async () => {
    authState.isSignedIn = true;
    authState.userDisplayName = "Casey Example";
    Object.assign(currentUserProfileState, {
      status: "success",
      profile: {
        userId: "user_123",
        email: "casey@example.com",
        displayName: "Casey Example",
        role: "user"
      }
    });

    const user = userEvent.setup();

    renderAppAt("/");

    expect(
      screen.getByRole("heading", { name: "Protected workspace" })
    ).toBeInTheDocument();
    expect(
      await screen.findAllByText("Signed in as Casey Example.")
    ).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: "Current user profile" })
    ).toHaveAttribute("href", "/");

    await user.click(screen.getByRole("button", { name: "Sign out" }));

    expect(authState.signOut).toHaveBeenCalledTimes(1);
  });

  it("renders both auth-entry routes as explicit app-owned pages", () => {
    renderAppAt("/sign-up");

    expect(
      screen.getByRole("heading", { name: "Sign up" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This route is reserved for the Clerk sign-up handoff/)
    ).toBeInTheDocument();
  });
});
