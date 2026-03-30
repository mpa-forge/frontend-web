import { Link, Outlet } from "react-router-dom";

import { protectedHomeRoute } from "../../routes/paths";
import { useFrontendAuth } from "../providers/FrontendAuthProvider";
import { AppChrome } from "./AppChrome";

export function ProtectedAppShell() {
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
