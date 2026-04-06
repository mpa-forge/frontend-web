import { useReactRouterPageViews } from "@mpa-forge/platform-frontend-observability/react-router";

export function FrontendObservabilityRouteTracker() {
  useReactRouterPageViews({
    getPageName: (location) => location.pathname
  });

  return null;
}
