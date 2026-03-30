import { SignIn, SignUp } from "@clerk/clerk-react";
import { Link, Navigate, useLocation } from "react-router-dom";

import { AppChrome } from "../../app/shell/AppChrome";
import { useFrontendAuth } from "../../app/providers/FrontendAuthProvider";
import { protectedHomeRoute, signInRoute, signUpRoute } from "../paths";

type AuthEntryRouteProps = {
  mode: "sign-in" | "sign-up";
};

function resolvePostAuthRoute(candidate: string | null) {
  if (!candidate?.startsWith("/") || candidate.startsWith("//")) {
    return protectedHomeRoute;
  }

  try {
    const url = new URL(candidate, "https://frontend-web.local");

    if (url.origin !== "https://frontend-web.local") {
      return protectedHomeRoute;
    }

    if (url.pathname === signInRoute || url.pathname === signUpRoute) {
      return protectedHomeRoute;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return protectedHomeRoute;
  }
}

export function AuthEntryRoute({ mode }: AuthEntryRouteProps) {
  const auth = useFrontendAuth();
  const location = useLocation();
  const redirectTo = resolvePostAuthRoute(
    new URLSearchParams(location.search).get("redirectTo")
  );

  if (auth.isLoaded && auth.isSignedIn) {
    return <Navigate replace to={redirectTo} />;
  }

  if (!auth.isAuthConfigured) {
    return (
      <AppChrome
        title="Authentication unavailable"
        summary="A usable Clerk publishable key is required before the auth-entry routes can launch the real Clerk flow."
      >
        <p>
          Authentication not configured. Set a real Clerk publishable key to
          exercise the sign-in and sign-up routes.
        </p>
      </AppChrome>
    );
  }

  const isSignIn = mode === "sign-in";
  const alternateUrl = isSignIn ? auth.signUpUrl : auth.signInUrl;
  const title = isSignIn ? "Sign in" : "Sign up";
  const summary = isSignIn
    ? "Use the real Clerk sign-in flow here, then return to the protected app route you requested."
    : "Use the real Clerk sign-up flow here, then return to the protected app route you requested.";

  return (
    <AppChrome title={title} summary={summary}>
      <p>Requested post-auth redirect target: {redirectTo}</p>
      {isSignIn ? (
        <SignIn
          fallbackRedirectUrl={protectedHomeRoute}
          forceRedirectUrl={redirectTo}
          path={auth.signInUrl}
          routing="path"
          signInUrl={auth.signInUrl}
          signUpFallbackRedirectUrl={protectedHomeRoute}
          signUpForceRedirectUrl={redirectTo}
          signUpUrl={auth.signUpUrl}
        />
      ) : (
        <SignUp
          fallbackRedirectUrl={protectedHomeRoute}
          forceRedirectUrl={redirectTo}
          path={auth.signUpUrl}
          routing="path"
          signInFallbackRedirectUrl={protectedHomeRoute}
          signInForceRedirectUrl={redirectTo}
          signInUrl={auth.signInUrl}
        />
      )}
      <p>
        <Link to={protectedHomeRoute}>Return to protected home</Link>
        {" or "}
        <Link to={alternateUrl}>
          {isSignIn ? "open sign up" : "open sign in"}
        </Link>
      </p>
    </AppChrome>
  );
}
