import {
  Code,
  ConnectError,
  createClient,
  type Interceptor
} from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { UserService } from "@mpa-forge/platform-contracts-client";

import { envValues } from "../../stores/runtime/runtimeStore";

export type TokenProvider = () => Promise<string | null>;

export type ProtectedApiErrorKind = "configuration" | "auth" | "request";

type ProtectedApiErrorOptions = {
  kind: ProtectedApiErrorKind;
  message: string;
  cause?: unknown;
  connectCode?: Code;
};

/**
 * ProtectedApiError gives protected features one stable error contract for
 * missing config, Clerk token acquisition failures, and request-level API
 * errors.
 */
export class ProtectedApiError extends Error {
  readonly kind: ProtectedApiErrorKind;
  readonly connectCode?: Code;
  override readonly cause: unknown;

  constructor({ kind, message, cause, connectCode }: ProtectedApiErrorOptions) {
    super(message);
    this.name = "ProtectedApiError";
    this.kind = kind;
    this.connectCode = connectCode;
    this.cause = cause;
  }
}

export function createProtectedApiConfigurationError() {
  return new ProtectedApiError({
    kind: "configuration",
    message:
      "Protected API configuration is incomplete. Set VITE_API_BASE_URL before loading protected data."
  });
}

export function createProtectedApiAuthError(message: string, cause?: unknown) {
  return new ProtectedApiError({
    kind: "auth",
    message,
    cause
  });
}

export function createProtectedApiRequestError(
  message: string,
  cause?: unknown,
  connectCode?: Code
) {
  return new ProtectedApiError({
    kind: "request",
    message,
    cause,
    connectCode
  });
}

export function classifyProtectedApiError(error: unknown): ProtectedApiError {
  if (error instanceof ProtectedApiError) {
    return error;
  }

  if (error instanceof ConnectError) {
    return createProtectedApiRequestError(
      error.rawMessage || "Protected API request failed.",
      error,
      error.code
    );
  }

  if (error instanceof Error) {
    return createProtectedApiRequestError(
      error.message || "Protected API request failed.",
      error
    );
  }

  return createProtectedApiRequestError("Protected API request failed.", error);
}

function resolveProtectedApiBaseUrl() {
  if (!envValues.VITE_API_BASE_URL) {
    throw createProtectedApiConfigurationError();
  }

  return envValues.VITE_API_BASE_URL;
}

function createProtectedApiErrorInterceptor(): Interceptor {
  return (next) => async (req) => {
    try {
      return await next(req);
    } catch (error) {
      throw classifyProtectedApiError(error);
    }
  };
}

function createClerkBearerTokenInterceptor(
  getToken: TokenProvider
): Interceptor {
  return (next) => async (req) => {
    let token: string | null;

    try {
      token = await getToken();
    } catch (error) {
      throw createProtectedApiAuthError(
        "Unable to acquire a Clerk session token for the protected API request.",
        error
      );
    }

    if (!token) {
      throw createProtectedApiAuthError(
        "A Clerk session token is required before the protected API request can run."
      );
    }

    req.header.set("Authorization", `Bearer ${token}`);

    return next(req);
  };
}

/**
 * createUserServiceClient centralizes the generated browser transport so
 * protected feature code does not duplicate API base URL or bearer-token
 * wiring.
 */
export function createUserServiceClient(getToken: TokenProvider) {
  const transport = createConnectTransport({
    baseUrl: resolveProtectedApiBaseUrl(),
    useBinaryFormat: false,
    interceptors: [
      createProtectedApiErrorInterceptor(),
      createClerkBearerTokenInterceptor(getToken)
    ]
  });

  return createClient(UserService, transport);
}
