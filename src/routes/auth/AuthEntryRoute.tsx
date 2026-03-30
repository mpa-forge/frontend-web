import { Link, Navigate, useLocation } from "react-router-dom";

import { AppChrome } from "../../app/shell/AppChrome";
import { useFrontendAuth } from "../../app/providers/FrontendAuthProvider";
import { protectedHomeRoute } from "../paths";

type AuthEntryRouteProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthEntryRoute({ mode }: AuthEntryRouteProps) {
  const auth = useFrontendAuth();
  const location = useLocation();
  const redirectTo =
    new URLSearchParams(location.search).get("redirectTo") ||
    protectedHomeRoute;

  if (auth.isLoaded && auth.isSignedIn) {
    return <Navigate replace to={protectedHomeRoute} />;
  }

  const isSignIn = mode === "sign-in";
  const alternateUrl = isSignIn ? auth.signUpUrl : auth.signInUrl;
  const title = isSignIn ? "Sign in" : "Sign up";
  const summary = isSignIn
    ? "This route is reserved for the Clerk sign-in handoff that will host the real auth flow in P2-T10D."
    : "This route is reserved for the Clerk sign-up handoff that will host the real auth flow in P2-T10D.";

  return (
    <AppChrome title={title} summary={summary}>
      <p>
        {auth.isAuthConfigured
          ? `The frontend route exists now so the protected shell can redirect to a stable ${title.toLowerCase()} path.`
          : "Authentication is not configured in this workspace yet, so the route currently serves as a documented placeholder."}
      </p>
      <p>Requested post-auth redirect target: {redirectTo}</p>
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
