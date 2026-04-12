import type { AnyMessage } from "@bufbuild/protobuf";
import type { Interceptor } from "@connectrpc/connect";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  applyRequestCorrelationHeadersMock,
  createClientMock,
  createConnectTransportMock,
  frontendObservabilityRuntime,
  getCurrentFrontendRouteMock,
  runtimeEnv
} = vi.hoisted(() => ({
  applyRequestCorrelationHeadersMock: vi.fn((headers: Headers) => {
    headers.set("x-platform-correlation-id", "req-123");

    return {
      correlationId: "req-123",
      headers: {
        "x-platform-correlation-id": "req-123"
      }
    };
  }),
  createClientMock: vi.fn(),
  createConnectTransportMock: vi.fn((options) => options),
  frontendObservabilityRuntime: {
    createRequestContext: vi.fn()
  },
  getCurrentFrontendRouteMock: vi.fn(() => "/profile?tab=security"),
  runtimeEnv: {
    VITE_API_BASE_URL: "http://localhost:8080"
  }
}));

vi.mock("@connectrpc/connect", async () => {
  const actual = await vi.importActual<typeof import("@connectrpc/connect")>(
    "@connectrpc/connect"
  );

  return {
    ...actual,
    createClient: createClientMock
  };
});

vi.mock("@connectrpc/connect-web", () => ({
  createConnectTransport: createConnectTransportMock
}));

vi.mock("@mpa-forge/platform-frontend-observability/frontend-web", () => ({
  applyRequestCorrelationHeaders: applyRequestCorrelationHeadersMock
}));

vi.mock("../../app/observability/runtime", () => ({
  frontendObservabilityRuntime,
  getCurrentFrontendRoute: getCurrentFrontendRouteMock
}));

vi.mock("../../stores/runtime/runtimeStore", () => ({
  envValues: runtimeEnv
}));

import {
  createUserServiceClient
} from "./protectedApiClient";

type InterceptorRequest = Parameters<ReturnType<Interceptor>>[0];
type InterceptorNext = (req: InterceptorRequest) => Promise<unknown>;

function composeInterceptors(interceptors: Interceptor[]) {
  const next = vi.fn(async (req: InterceptorRequest) => ({
    stream: false as const,
    service: req.service,
    method: req.method,
    header: new Headers(),
    trailer: new Headers(),
    message:
      (req.stream ? undefined : req.message) as InterceptorRequest["message"]
  })) as unknown as ReturnType<typeof vi.fn<InterceptorNext>>;

  return {
    invoke: interceptors.reduceRight<InterceptorNext>((current, interceptor) => {
      return interceptor(current as never) as InterceptorNext;
    }, next as unknown as InterceptorNext),
    next
  };
}

function createRequest(): InterceptorRequest {
  return {
    stream: false,
    service: {
      typeName: "blueprint.user.v1.UserService"
    } as InterceptorRequest["service"],
    method: {
      name: "GetCurrentUser"
    } as InterceptorRequest["method"],
    url: "http://localhost:8080/blueprint.user.v1.UserService/GetCurrentUser",
    init: {},
    signal: new AbortController().signal,
    header: new Headers(),
    contextValues: {} as InterceptorRequest["contextValues"],
    message: {} as AnyMessage
  };
}

describe("protectedApiClient", () => {
  beforeEach(() => {
    runtimeEnv.VITE_API_BASE_URL = "http://localhost:8080";
    applyRequestCorrelationHeadersMock.mockClear();
    createClientMock.mockReset();
    createConnectTransportMock.mockClear();
    getCurrentFrontendRouteMock.mockClear();
  });

  it("wires the shared transport with the configured API base URL", () => {
    createUserServiceClient(async () => "token-123");

    expect(createConnectTransportMock).toHaveBeenCalledWith(
      expect.objectContaining({
        baseUrl: "http://localhost:8080",
        interceptors: expect.any(Array),
        useBinaryFormat: false
      })
    );
  });

  it("adds bearer auth and observability correlation headers to protected requests", async () => {
    createUserServiceClient(async () => "token-123");

    const interceptors = createConnectTransportMock.mock.calls[0]?.[0]
      .interceptors as Interceptor[];
    const { invoke, next } = composeInterceptors(interceptors);
    const req = createRequest();

    await invoke(req);

    expect(req.header.get("Authorization")).toBe("Bearer token-123");
    expect(applyRequestCorrelationHeadersMock).toHaveBeenCalledWith(
      req.header,
      frontendObservabilityRuntime,
      {
        operation: "UserService.GetCurrentUser",
        route: "/profile?tab=security"
      }
    );
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("classifies Clerk token acquisition failures for protected requests", async () => {
    createUserServiceClient(async () => {
      throw new Error("session unavailable");
    });

    const interceptors = createConnectTransportMock.mock.calls[0]?.[0]
      .interceptors as Interceptor[];
    const { invoke } = composeInterceptors(interceptors);

    await expect(invoke(createRequest())).rejects.toMatchObject({
      kind: "auth",
      message:
        "Unable to acquire a Clerk session token for the protected API request."
    });
  });
});
