import type { ReactNode } from "react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

const {
  authState,
  clerkRouteState,
  currentUserProfileState,
  observabilityState,
  runtimeState
} = vi.hoisted(() => ({
  runtimeState: {
    envValues: {
      VITE_APP_ENV: "local",
      VITE_APP_RELEASE: "2026.04.06-dev",
      VITE_API_BASE_URL: "http://localhost:8080",
      VITE_CLERK_PUBLISHABLE_KEY: "pk_test_live_configured",
      VITE_CLERK_SIGN_IN_URL: "/sign-in",
      VITE_CLERK_SIGN_UP_URL: "/sign-up",
      VITE_OBSERVABILITY_ENABLED: "false",
      VITE_OBSERVABILITY_ENDPOINT: "",
      VITE_OBSERVABILITY_TRANSPORT: "",
      VITE_OBSERVABILITY_DATASET: ""
    },
    missingVars: [] as string[]
  },
  authState: {
    isAuthConfigured: true,
    isLoaded: true,
    isSignedIn: false,
    getToken: vi.fn(async () => "test-token"),
    sessionId: null as string | null,
    signOut: vi.fn(async () => undefined),
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
    userDisplayName: null as string | null,
    userId: null as string | null
  },
  clerkRouteState: {
    signInRender: vi.fn(),
    signUpRender: vi.fn()
  },
  currentUserProfileState: {
    status: "loading"
  } as Record<string, unknown>,
  observabilityState: {
    runtime: {
      captureError: vi.fn()
    },
    startWebVitalsTracking: vi.fn(() => () => undefined),
    syncFrontendWebUserContext: vi.fn(),
    useReactRouterPageViews: vi.fn()
  }
}));

vi.mock("@clerk/clerk-react", () => ({
  SignIn: (props: Record<string, unknown>) => {
    clerkRouteState.signInRender(props);

    return <div data-testid="clerk-sign-in">Clerk SignIn</div>;
  },
  SignUp: (props: Record<string, unknown>) => {
    clerkRouteState.signUpRender(props);

    return <div data-testid="clerk-sign-up">Clerk SignUp</div>;
  }
}));

vi.mock("./stores/runtime/runtimeStore", () => ({
  envValues: runtimeState.envValues,
  useRuntimeStore: (selector: (state: typeof runtimeState) => unknown) =>
    selector(runtimeState)
}));

vi.mock("@mpa-forge/platform-frontend-observability", () => ({
  createFrontendObservability: vi.fn(() => observabilityState.runtime),
  startWebVitalsTracking: observabilityState.startWebVitalsTracking
}));

vi.mock("@mpa-forge/platform-frontend-observability/react", () => ({
  FrontendObservabilityProvider: ({ children }: { children: ReactNode }) =>
    children,
  useFrontendObservabilityRuntime: () => observabilityState.runtime
}));

vi.mock("@mpa-forge/platform-frontend-observability/react-router", () => ({
  useReactRouterPageViews: observabilityState.useReactRouterPageViews
}));

vi.mock("@mpa-forge/platform-frontend-observability/frontend-web", () => ({
  applyRequestCorrelationHeaders: vi.fn(),
  syncFrontendWebUserContext: observabilityState.syncFrontendWebUserContext
}));

vi.mock("./app/providers/FrontendAuthProvider", () => ({
  FrontendAuthProvider: ({ children }: { children: ReactNode }) => children,
  useFrontendAuth: () => authState
}));

vi.mock("./features/current-user/api/useCurrentUserProfileData", () => ({
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
    authState.sessionId = null;
    authState.userDisplayName = null;
    authState.userId = null;
    runtimeState.missingVars = [];
    authState.signOut.mockReset();
    clerkRouteState.signInRender.mockReset();
    clerkRouteState.signUpRender.mockReset();
    observabilityState.startWebVitalsTracking.mockClear();
    observabilityState.syncFrontendWebUserContext.mockClear();
    observabilityState.useReactRouterPageViews.mockClear();
    currentUserProfileState.status = "loading";
  });

  it("redirects unauthenticated protected visits to the sign-in route", async () => {
    renderAppAt("/");

    expect(
      await screen.findByRole("heading", { name: "Sign in" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("clerk-sign-in")).toBeInTheDocument();
    expect(
      screen.getByText("Requested post-auth redirect target: /")
    ).toBeInTheDocument();
    expect(clerkRouteState.signInRender).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackRedirectUrl: "/",
        forceRedirectUrl: "/",
        path: "/sign-in",
        routing: "path",
        signInUrl: "/sign-in",
        signUpFallbackRedirectUrl: "/",
        signUpForceRedirectUrl: "/",
        signUpUrl: "/sign-up"
      })
    );
    expect(window.location.pathname).toBe("/sign-in");
  });

  it("renders an auth-unavailable state when the auth-entry route lacks Clerk configuration", () => {
    authState.isAuthConfigured = false;

    renderAppAt("/sign-in");

    expect(
      screen.getByRole("heading", { name: "Authentication unavailable" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Runtime" })
    ).toBeInTheDocument();
    expect(screen.queryByTestId("clerk-sign-in")).not.toBeInTheDocument();
  });

  it("renders the protected shell and current-user profile for authenticated users", async () => {
    authState.isSignedIn = true;
    authState.sessionId = "session_123";
    authState.userDisplayName = "Casey Example";
    authState.userId = "user_123";
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

  it("passes a preserved protected redirect target into the real sign-in flow", () => {
    renderAppAt("/sign-in?redirectTo=%2Fprofile%3Ftab%3Dsecurity");

    expect(
      screen.getByText(
        "Requested post-auth redirect target: /profile?tab=security"
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId("clerk-sign-in")).toBeInTheDocument();
    expect(clerkRouteState.signInRender).toHaveBeenCalledWith(
      expect.objectContaining({
        forceRedirectUrl: "/profile?tab=security",
        signUpForceRedirectUrl: "/profile?tab=security"
      })
    );
  });

  it("sanitizes auth-entry redirect targets that point back to auth routes", () => {
    renderAppAt("/sign-up?redirectTo=%2Fsign-in%3FredirectTo%3D%252F");

    expect(
      screen.getByText("Requested post-auth redirect target: /")
    ).toBeInTheDocument();
    expect(screen.getByTestId("clerk-sign-up")).toBeInTheDocument();
    expect(clerkRouteState.signUpRender).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackRedirectUrl: "/",
        forceRedirectUrl: "/",
        path: "/sign-up",
        routing: "path",
        signInFallbackRedirectUrl: "/",
        signInForceRedirectUrl: "/",
        signInUrl: "/sign-in"
      })
    );
  });

  it("short-circuits signed-in auth-entry visits back into the protected flow", async () => {
    authState.isSignedIn = true;
    authState.sessionId = "session_123";
    authState.userDisplayName = "Casey Example";
    authState.userId = "user_123";
    Object.assign(currentUserProfileState, {
      status: "success",
      profile: {
        userId: "user_123",
        email: "casey@example.com",
        displayName: "Casey Example",
        role: "user"
      }
    });

    renderAppAt("/sign-in?redirectTo=%2F");

    expect(
      await screen.findByRole("heading", { name: "Protected workspace" })
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/");
    expect(screen.queryByTestId("clerk-sign-in")).not.toBeInTheDocument();
  });

  it("renders the sign-up auth-entry route as a real Clerk-hosting page", () => {
    renderAppAt("/sign-up");

    expect(
      screen.getByRole("heading", { name: "Sign up" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("clerk-sign-up")).toBeInTheDocument();
  });
});
