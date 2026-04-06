import { beforeEach, describe, expect, it, vi } from "vitest";

const { createFrontendObservabilityMock, runtimeEnv } = vi.hoisted(() => ({
  createFrontendObservabilityMock: vi.fn(() => ({
    captureError: vi.fn(),
    createRequestContext: vi.fn(),
    reportWebVital: vi.fn(),
    setUserContext: vi.fn(),
    trackPageView: vi.fn()
  })),
  runtimeEnv: {
    VITE_APP_ENV: "local",
    VITE_APP_RELEASE: "2026.04.06-dev",
    VITE_API_BASE_URL: "http://localhost:8080",
    VITE_CLERK_PUBLISHABLE_KEY: "pk_test_live_configured",
    VITE_CLERK_SIGN_IN_URL: "/sign-in",
    VITE_CLERK_SIGN_UP_URL: "/sign-up",
    VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: "/",
    VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: "/",
    VITE_OBSERVABILITY_ENABLED: "true",
    VITE_OBSERVABILITY_ENDPOINT: "https://frontend.example.test/collect",
    VITE_OBSERVABILITY_TRANSPORT: "otlp_http",
    VITE_OBSERVABILITY_DATASET: "frontend-web"
  }
}));

vi.mock("@mpa-forge/platform-frontend-observability", () => ({
  createFrontendObservability: createFrontendObservabilityMock
}));

vi.mock("../../stores/runtime/runtimeStore", () => ({
  envValues: runtimeEnv
}));

import {
  buildFrontendObservabilityConfig,
  getCurrentFrontendRoute
} from "./runtime";

describe("frontend observability runtime config", () => {
  beforeEach(() => {
    runtimeEnv.VITE_APP_ENV = "local";
    runtimeEnv.VITE_APP_RELEASE = "2026.04.06-dev";
    runtimeEnv.VITE_OBSERVABILITY_ENABLED = "true";
    runtimeEnv.VITE_OBSERVABILITY_ENDPOINT =
      "https://frontend.example.test/collect";
    runtimeEnv.VITE_OBSERVABILITY_TRANSPORT = "otlp_http";
    runtimeEnv.VITE_OBSERVABILITY_DATASET = "frontend-web";
  });

  it("builds browser-safe config for the shared package", () => {
    expect(buildFrontendObservabilityConfig()).toEqual({
      app: {
        name: "frontend-web",
        environment: "local",
        release: "2026.04.06-dev"
      },
      enabled: true,
      ingest: {
        dataset: "frontend-web",
        endpoint: "https://frontend.example.test/collect",
        transport: "otlp_http"
      }
    });
    expect(createFrontendObservabilityMock).toHaveBeenCalled();
  });

  it("disables provider delivery when required identity values are missing", () => {
    runtimeEnv.VITE_APP_RELEASE = "";

    expect(buildFrontendObservabilityConfig()).toEqual({
      app: {
        name: "frontend-web",
        environment: "local",
        release: "dev"
      },
      enabled: false,
      ingest: {
        dataset: "frontend-web",
        endpoint: "https://frontend.example.test/collect",
        transport: "otlp_http"
      }
    });
  });

  it("reads the current browser route for shared request correlation", () => {
    window.history.replaceState({}, "", "/profile?tab=security#details");

    expect(getCurrentFrontendRoute()).toBe("/profile?tab=security#details");
  });
});
