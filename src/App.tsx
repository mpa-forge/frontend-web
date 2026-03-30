import { useEffect, useState } from "react";

import { useFrontendAuth } from "./auth/FrontendAuthProvider";
import { loadCurrentUserProfile } from "./features/current-user/loadCurrentUserProfile";
import { useRuntimeStore } from "./stores/runtimeStore";

type ProfileState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "error";
      message: string;
    }
  | {
      status: "success";
      displayName: string;
      email: string;
      role: string;
      userId: string;
    };

export function App() {
  const envValues = useRuntimeStore((state) => state.envValues);
  const missingVars = useRuntimeStore((state) => state.missingVars);
  const auth = useFrontendAuth();
  const [profileState, setProfileState] = useState<ProfileState>({
    status: "idle"
  });

  useEffect(() => {
    let cancelled = false;

    if (missingVars.length > 0 || !auth.isAuthConfigured) {
      setProfileState({ status: "idle" });
      return () => {
        cancelled = true;
      };
    }

    if (!auth.isLoaded || !auth.isSignedIn) {
      setProfileState({ status: "idle" });
      return () => {
        cancelled = true;
      };
    }

    setProfileState({ status: "loading" });

    void loadCurrentUserProfile(auth.getToken)
      .then((profile) => {
        if (cancelled) {
          return;
        }

        setProfileState({
          status: "success",
          displayName: profile.displayName,
          email: profile.email,
          role: profile.role,
          userId: profile.userId
        });
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setProfileState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Protected profile request failed."
        });
      });

    return () => {
      cancelled = true;
    };
  }, [auth, missingVars.length]);

  return (
    <main>
      <h1>MPA Forge Blueprint</h1>
      <p>Phase 2 generated frontend contract-client baseline.</p>
      <section>
        <h2>Runtime</h2>
        <ul>
          <li>Environment: {envValues.VITE_APP_ENV}</li>
          <li>API base URL: {envValues.VITE_API_BASE_URL}</li>
          <li>
            Auth publishable key present:{" "}
            {envValues.VITE_CLERK_PUBLISHABLE_KEY ? "yes" : "no"}
          </li>
        </ul>
      </section>
      <section>
        <h2>Local stack</h2>
        <ul>
          <li>Frontend native mode uses `make run`.</li>
          <li>Compose support mode provides backend API and Postgres.</li>
        </ul>
      </section>
      <section>
        <h2>Protected profile</h2>
        {!auth.isAuthConfigured ? (
          <p>
            Authentication not configured. Set a real Clerk publishable key to
            exercise the protected API flow.
          </p>
        ) : !auth.isLoaded ? (
          <p>Loading authentication state...</p>
        ) : !auth.isSignedIn ? (
          <>
            <p>Sign in required to load the protected current-user profile.</p>
            <p>
              <a href={auth.signInUrl}>Sign in</a>
              {" or "}
              <a href={auth.signUpUrl}>sign up</a>
            </p>
          </>
        ) : profileState.status === "loading" ? (
          <p>Loading current user profile...</p>
        ) : profileState.status === "error" ? (
          <p>Protected API error: {profileState.message}</p>
        ) : profileState.status === "success" ? (
          <>
            <p>
              Signed in as {auth.userDisplayName || profileState.displayName}.
            </p>
            <ul>
              <li>User ID: {profileState.userId}</li>
              <li>Email: {profileState.email}</li>
              <li>Display name: {profileState.displayName}</li>
              <li>Role: {profileState.role}</li>
            </ul>
          </>
        ) : (
          <p>Protected profile flow is ready to run.</p>
        )}
      </section>
      {missingVars.length > 0 ? (
        <section>
          <h2>Missing configuration</h2>
          <p>{missingVars.join(", ")}</p>
        </section>
      ) : null}
    </main>
  );
}
