// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { authState, observabilityState } = vi.hoisted(() => ({
  authState: {
    isSignedIn: true,
    sessionId: "session_123",
    userDisplayName: "Casey Example",
    userId: "user_123"
  },
  observabilityState: {
    cleanup: vi.fn(),
    runtime: {
      captureError: vi.fn()
    },
    startWebVitalsTracking: vi.fn(),
    syncFrontendWebUserContext: vi.fn()
  }
}));

vi.mock("@mpa-forge/platform-frontend-observability", () => ({
  createFrontendObservability: vi.fn(() => observabilityState.runtime),
  startWebVitalsTracking: observabilityState.startWebVitalsTracking
}));

vi.mock("@mpa-forge/platform-frontend-observability/react", () => ({
  useFrontendObservabilityRuntime: () => observabilityState.runtime
}));

vi.mock("@mpa-forge/platform-frontend-observability/frontend-web", () => ({
  syncFrontendWebUserContext: observabilityState.syncFrontendWebUserContext
}));

vi.mock("./FrontendAuthProvider", () => ({
  useFrontendAuth: () => authState
}));

import { FrontendObservabilityBootstrap } from "./FrontendObservabilityBootstrap";

describe("FrontendObservabilityBootstrap", () => {
  beforeEach(() => {
    authState.isSignedIn = true;
    authState.sessionId = "session_123";
    authState.userDisplayName = "Casey Example";
    authState.userId = "user_123";
    observabilityState.cleanup.mockReset();
    observabilityState.runtime.captureError.mockReset();
    observabilityState.startWebVitalsTracking.mockReset();
    observabilityState.startWebVitalsTracking.mockReturnValue(
      observabilityState.cleanup
    );
    observabilityState.syncFrontendWebUserContext.mockReset();
    window.history.replaceState({}, "", "/profile?tab=security");
  });

  it("syncs auth state and starts shared Web Vitals tracking", () => {
    const { unmount } = render(<FrontendObservabilityBootstrap />);

    expect(observabilityState.syncFrontendWebUserContext).toHaveBeenCalledWith(
      observabilityState.runtime,
      {
        isSignedIn: true,
        sessionId: "session_123",
        userDisplayName: "Casey Example",
        userId: "user_123"
      }
    );
    expect(observabilityState.startWebVitalsTracking).toHaveBeenCalledWith(
      observabilityState.runtime
    );

    unmount();

    expect(observabilityState.cleanup).toHaveBeenCalledTimes(1);
  });

  it("captures window errors and unhandled promise rejections", () => {
    render(<FrontendObservabilityBootstrap />);

    window.dispatchEvent(
      new ErrorEvent("error", {
        error: new Error("boom"),
        message: "boom"
      })
    );

    const rejectionEvent = new Event("unhandledrejection");
    Object.defineProperty(rejectionEvent, "reason", {
      value: "promise exploded"
    });
    window.dispatchEvent(rejectionEvent);

    expect(observabilityState.runtime.captureError).toHaveBeenNthCalledWith(1, {
      error: expect.any(Error),
      message: "boom",
      route: "/profile?tab=security",
      attributes: {
        source: "window.error"
      }
    });
    expect(observabilityState.runtime.captureError).toHaveBeenNthCalledWith(2, {
      error: "promise exploded",
      message: "promise exploded",
      route: "/profile?tab=security",
      attributes: {
        source: "window.unhandledrejection"
      }
    });
  });
});
