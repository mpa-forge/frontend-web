import { useReactRouterPageViews } from "@mpa-forge/platform-frontend-observability/react-router";

import { protectedHomeRoute } from "./paths";

function getPageName(pathname: string) {
  if (pathname === protectedHomeRoute) {
    return "Current User Profile";
  }

  return pathname;
}

export function FrontendObservabilityRouteTracker() {
  useReactRouterPageViews({
    getPageName: (location) => getPageName(location.pathname)
  });

  return null;
}
