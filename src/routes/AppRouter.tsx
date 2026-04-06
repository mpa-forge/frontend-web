import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ProtectedAppShell } from "../app/shell/ProtectedAppShell";
import { CurrentUserProfilePage } from "../features/current-user/pages/CurrentUserProfilePage";
import { AuthEntryRoute } from "./auth/AuthEntryRoute";
import { ProtectedRouteBoundary } from "./boundaries/ProtectedRouteBoundary";
import { FrontendObservabilityRouteTracker } from "./FrontendObservabilityRouteTracker";
import { protectedHomeRoute, signInRoute, signUpRoute } from "./paths";

export function AppRouter() {
  return (
    <BrowserRouter>
      <FrontendObservabilityRouteTracker />
      <Routes>
        <Route element={<ProtectedRouteBoundary />}>
          <Route element={<ProtectedAppShell />} path={protectedHomeRoute}>
            <Route element={<CurrentUserProfilePage />} index />
          </Route>
        </Route>
        <Route element={<AuthEntryRoute mode="sign-in" />} path={signInRoute} />
        <Route element={<AuthEntryRoute mode="sign-up" />} path={signUpRoute} />
        <Route
          path="*"
          element={<Navigate replace to={protectedHomeRoute} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
