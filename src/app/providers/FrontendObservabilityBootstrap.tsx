import { startWebVitalsTracking } from "@mpa-forge/platform-frontend-observability";
import { useFrontendObservabilityRuntime } from "@mpa-forge/platform-frontend-observability/react";
import { syncFrontendWebUserContext } from "@mpa-forge/platform-frontend-observability/frontend-web";
import { useEffect } from "react";

import { getCurrentFrontendRoute } from "../observability/runtime";
import { useFrontendAuth } from "./FrontendAuthProvider";

function buildUnhandledRejectionMessage(reason: unknown) {
  if (reason instanceof Error) {
    return reason.message;
  }

  if (typeof reason === "string" && reason.length > 0) {
    return reason;
  }

  return "Unhandled promise rejection";
}

export function FrontendObservabilityBootstrap() {
  const auth = useFrontendAuth();
  const runtime = useFrontendObservabilityRuntime();

  useEffect(() => {
    syncFrontendWebUserContext(runtime, {
      isSignedIn: auth.isSignedIn,
      sessionId: auth.sessionId,
      userDisplayName: auth.userDisplayName,
      userId: auth.userId
    });
  }, [
    auth.isSignedIn,
    auth.sessionId,
    auth.userDisplayName,
    auth.userId,
    runtime
  ]);

  useEffect(() => {
    const removeWebVitalsTracking = startWebVitalsTracking(runtime);

    return () => {
      removeWebVitalsTracking();
    };
  }, [runtime]);

  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      runtime.captureError({
        error: event.error ?? new Error(event.message || "Window error"),
        message: event.message || undefined,
        route: getCurrentFrontendRoute(),
        attributes: {
          source: "window.error"
        }
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      runtime.captureError({
        error: event.reason,
        message: buildUnhandledRejectionMessage(event.reason),
        route: getCurrentFrontendRoute(),
        attributes: {
          source: "window.unhandledrejection"
        }
      });
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, [runtime]);

  return null;
}
