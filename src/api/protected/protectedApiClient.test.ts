import { vi } from "vitest";

const { clientState, observabilityState, transportState } = vi.hoisted(() => ({
  transportState: {
    config: null as {
      baseUrl: string;
      interceptors: Array<
        (
          next: (req: unknown) => Promise<unknown>
        ) => (req: unknown) => Promise<unknown>
      >;
    } | null
  },
  clientState: {
    service: null as unknown,
    transport: null as unknown
  },
  observabilityState: {
    applyRequestCorrelationHeaders: vi.fn(),
    runtime: { name: "frontend-observability-runtime" }
  }
}));

vi.mock("@connectrpc/connect", () => ({
  Code: {},
  ConnectError: class ConnectError extends Error {
    rawMessage = this.message;
    code = "unknown";
  },
  createClient: (service: unknown, transport: unknown) => {
    clientState.service = service;
    clientState.transport = transport;

    return { service, transport };
  }
}));

vi.mock("@connectrpc/connect-web", () => ({
  createConnectTransport: (config: typeof transportState.config) => {
    transportState.config = config;

    return { kind: "connect-transport", config };
  }
}));

vi.mock("@mpa-forge/platform-contracts-client", () => ({
  UserService: { typeName: "blueprint.user.v1.UserService" }
}));

vi.mock("@mpa-forge/platform-frontend-observability/frontend-web", () => ({
  applyRequestCorrelationHeaders:
    observabilityState.applyRequestCorrelationHeaders
}));

vi.mock("../../app/observability/runtime", () => ({
  frontendObservabilityRuntime: observabilityState.runtime,
  getCurrentBrowserPath: () =>
    `${window.location.pathname}${window.location.search}`,
  getCurrentRouteTemplate: () => window.location.pathname
}));

vi.mock("../../stores/runtime/runtimeStore", () => ({
  envValues: {
    VITE_API_BASE_URL: "http://localhost:8080"
  }
}));

import { createUserServiceClient } from "./protectedApiClient";

describe("createUserServiceClient", () => {
  beforeEach(() => {
    transportState.config = null;
    clientState.service = null;
    clientState.transport = null;
    observabilityState.applyRequestCorrelationHeaders.mockReset();
    window.history.replaceState({}, "", "/profile?tab=security");
  });

  it("configures the shared transport with correlation and auth interceptors", async () => {
    const getToken = vi.fn(async () => "test-token");

    createUserServiceClient(getToken);

    expect(transportState.config?.baseUrl).toBe("http://localhost:8080");
    expect(transportState.config?.interceptors).toHaveLength(3);

    const request = {
      header: new Headers(),
      method: { name: "GetCurrentUser" },
      service: { typeName: "blueprint.user.v1.UserService" }
    };
    const next = vi.fn(async () => ({ ok: true }));
    const handler =
      transportState.config?.interceptors.reduceRight(
        (currentNext, interceptor) => interceptor(currentNext),
        next
      ) ?? next;

    await handler(request);

    expect(
      observabilityState.applyRequestCorrelationHeaders
    ).toHaveBeenCalledWith(request.header, observabilityState.runtime, {
      route: "/profile?tab=security",
      routeTemplate: "/profile",
      operation: "UserService.GetCurrentUser"
    });
    expect(request.header.get("Authorization")).toBe("Bearer test-token");
    expect(getToken).toHaveBeenCalledTimes(1);
  });
});
