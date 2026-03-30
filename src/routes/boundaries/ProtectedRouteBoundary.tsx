import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useFrontendAuth } from "../../app/providers/FrontendAuthProvider";
import { AppChrome } from "../../app/shell/AppChrome";

function buildRedirectUrl(signInUrl: string, redirectTo: string) {
  const searchParams = new URLSearchParams({ redirectTo });

  return `${signInUrl}?${searchParams.toString()}`;
}

function AuthLoadingRoute() {
  return (
    <AppChrome
      title="Loading authentication"
      summary="The protected app shell is waiting for Clerk session state before it decides whether to render protected content."
    >
      <p>Loading authentication state...</p>
    </AppChrome>
  );
}

function AuthUnavailableRoute() {
  return (
    <AppChrome
      title="Authentication unavailable"
      summary="A usable Clerk publishable key is required before the protected app shell can run."
    >
      <p>
        Authentication not configured. Set a real Clerk publishable key to
        exercise the protected API flow.
      </p>
    </AppChrome>
  );
}

export function ProtectedRouteBoundary() {
  const auth = useFrontendAuth();
  const location = useLocation();
  const redirectTo = `${location.pathname}${location.search}`;

  if (!auth.isAuthConfigured) {
    return <AuthUnavailableRoute />;
  }

  if (!auth.isLoaded) {
    return <AuthLoadingRoute />;
  }

  if (!auth.isSignedIn) {
    return (
      <Navigate replace to={buildRedirectUrl(auth.signInUrl, redirectTo)} />
    );
  }

  return <Outlet />;
}
