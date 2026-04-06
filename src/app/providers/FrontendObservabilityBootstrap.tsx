import { startWebVitalsTracking } from "@mpa-forge/platform-frontend-observability";
import { useFrontendWebUserContext } from "@mpa-forge/platform-frontend-observability/frontend-web";
import { useEffect } from "react";

import {
  frontendObservabilityRuntime,
  getCurrentBrowserPath,
  getCurrentRouteTemplate
} from "../observability/runtime";
import { useFrontendAuth } from "./FrontendAuthProvider";

let hasStartedWebVitalsTracking = false;

function normalizePromiseRejectionReason(reason: unknown) {
  if (reason instanceof Error) {
    return reason;
  }

  if (typeof reason === "string") {
    return new Error(reason);
  }

  return new Error("Unhandled promise rejection");
}

export function FrontendObservabilityBootstrap() {
  const auth = useFrontendAuth();

  useFrontendWebUserContext(
    {
      isSignedIn: auth.isSignedIn,
      userId: auth.userId,
      sessionId: auth.sessionId,
      userDisplayName: auth.userDisplayName
    },
    frontendObservabilityRuntime
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleError = (event: ErrorEvent) => {
      frontendObservabilityRuntime.captureError({
        error: event.error ?? event.message,
        route: getCurrentBrowserPath(),
        routeTemplate: getCurrentRouteTemplate()
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      frontendObservabilityRuntime.captureError({
        error: normalizePromiseRejectionReason(event.reason),
        message: "Unhandled promise rejection",
        route: getCurrentBrowserPath(),
        routeTemplate: getCurrentRouteTemplate()
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  useEffect(() => {
    if (hasStartedWebVitalsTracking) {
      return;
    }

    hasStartedWebVitalsTracking = true;
    startWebVitalsTracking(frontendObservabilityRuntime);
  }, []);

  return null;
}
