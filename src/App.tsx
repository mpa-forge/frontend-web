import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import { AppChrome } from "./app/AppChrome";
import { useFrontendAuth } from "./auth/FrontendAuthProvider";
import { CurrentUserProfilePage } from "./features/current-user/CurrentUserProfilePage";
import { protectedHomeRoute, signInRoute, signUpRoute } from "./routes/routes";

function buildRedirectUrl(signInUrl: string, redirectTo: string) {
  const searchParams = new URLSearchParams({ redirectTo });

  return `${signInUrl}?${searchParams.toString()}`;
}

function AuthLoadingPage() {
  return (
    <AppChrome
      title="Loading authentication"
      summary="The protected app shell is waiting for Clerk session state before it decides whether to render protected content."
    >
      <p>Loading authentication state...</p>
    </AppChrome>
  );
}

function AuthUnavailablePage() {
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

function AuthEntryPage({ mode }: { mode: "sign-in" | "sign-up" }) {
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

function ProtectedRoute() {
  const auth = useFrontendAuth();
  const location = useLocation();
  const redirectTo = `${location.pathname}${location.search}`;

  if (!auth.isAuthConfigured) {
    return <AuthUnavailablePage />;
  }

  if (!auth.isLoaded) {
    return <AuthLoadingPage />;
  }

  if (!auth.isSignedIn) {
    return (
      <Navigate replace to={buildRedirectUrl(auth.signInUrl, redirectTo)} />
    );
  }

  return <Outlet />;
}

function ProtectedAppShell() {
  const auth = useFrontendAuth();

  return (
    <AppChrome
      title="Protected workspace"
      summary="Authenticated pages now live under a shared route-owned shell instead of a single top-level app screen."
      actions={
        <>
          <p>Signed in as {auth.userDisplayName || "Authenticated user"}.</p>
          <button onClick={() => void auth.signOut()} type="button">
            Sign out
          </button>
        </>
      }
    >
      <nav aria-label="Protected navigation">
        <ul>
          <li>
            <Link to={protectedHomeRoute}>Current user profile</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </AppChrome>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedAppShell />} path={protectedHomeRoute}>
            <Route element={<CurrentUserProfilePage />} index />
          </Route>
        </Route>
        <Route element={<AuthEntryPage mode="sign-in" />} path={signInRoute} />
        <Route element={<AuthEntryPage mode="sign-up" />} path={signUpRoute} />
        <Route
          path="*"
          element={<Navigate replace to={protectedHomeRoute} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
