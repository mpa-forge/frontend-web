import {
  createFrontendObservability,
  type FrontendObservabilityConfig
} from "@mpa-forge/platform-frontend-observability";

import { envValues } from "../../stores/runtime/runtimeStore";

function trimOptional(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function buildIngestConfig() {
  const endpoint = trimOptional(envValues.VITE_OBSERVABILITY_ENDPOINT);
  const transport = trimOptional(envValues.VITE_OBSERVABILITY_TRANSPORT);
  const dataset = trimOptional(envValues.VITE_OBSERVABILITY_DATASET);

  if (!endpoint && !transport && !dataset) {
    return undefined;
  }

  return {
    endpoint,
    transport,
    dataset
  };
}

export function buildFrontendObservabilityConfig(): FrontendObservabilityConfig {
  const environment = trimOptional(envValues.VITE_APP_ENV);
  const release = trimOptional(envValues.VITE_APP_RELEASE);

  return {
    app: {
      name: "frontend-web",
      environment: environment ?? "unknown",
      release: release ?? "dev"
    },
    enabled:
      envValues.VITE_OBSERVABILITY_ENABLED === "true" &&
      Boolean(environment && release),
    ingest: buildIngestConfig()
  };
}

export function getCurrentFrontendRoute() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const route = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  return route || "/";
}

export const frontendObservabilityRuntime = createFrontendObservability(
  buildFrontendObservabilityConfig()
);
