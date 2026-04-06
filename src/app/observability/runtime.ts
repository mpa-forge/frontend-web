import {
  createFrontendObservability,
  type FrontendObservabilityEmitter,
  type FrontendObservabilityEvent
} from "@mpa-forge/platform-frontend-observability";

import { envValues } from "../../stores/runtime/runtimeStore";

const appName = "frontend-web";
const unknownEnvironment = "unknown";
const unknownRelease = "unknown-release";

function trimOptional(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function createEventPayload(event: FrontendObservabilityEvent) {
  return JSON.stringify(event);
}

function emitToConfiguredEndpoint(
  endpoint: string,
  event: FrontendObservabilityEvent
) {
  const payload = createEventPayload(event);

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function"
  ) {
    const body = new Blob([payload], { type: "application/json" });

    if (navigator.sendBeacon(endpoint, body)) {
      return;
    }
  }

  if (typeof fetch !== "function") {
    return;
  }

  void fetch(endpoint, {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json"
    },
    keepalive: true,
    mode: "no-cors"
  }).catch(() => undefined);
}

function createBrowserSafeEmitter(): FrontendObservabilityEmitter {
  const endpoint = trimOptional(envValues.VITE_OBSERVABILITY_ENDPOINT);

  return (event) => {
    if (endpoint) {
      emitToConfiguredEndpoint(endpoint, event);
      return;
    }

    if (import.meta.env.DEV || envValues.VITE_APP_ENV === "local") {
      console.info("frontend observability event", event);
    }
  };
}

export function getCurrentBrowserPath() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return `${window.location.pathname}${window.location.search}`;
}

export function getCurrentRouteTemplate() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.location.pathname;
}

export const frontendObservabilityRuntime = createFrontendObservability({
  app: {
    name: appName,
    environment: trimOptional(envValues.VITE_APP_ENV) ?? unknownEnvironment,
    release: trimOptional(envValues.VITE_APP_RELEASE) ?? unknownRelease
  },
  enabled:
    envValues.VITE_OBSERVABILITY_ENABLED === "true" &&
    Boolean(trimOptional(envValues.VITE_APP_ENV)) &&
    Boolean(trimOptional(envValues.VITE_APP_RELEASE)),
  ingest: {
    endpoint: trimOptional(envValues.VITE_OBSERVABILITY_ENDPOINT),
    transport: "browser_http"
  },
  emit: createBrowserSafeEmitter()
});
