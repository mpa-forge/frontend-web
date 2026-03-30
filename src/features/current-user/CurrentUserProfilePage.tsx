import { useEffect, useState } from "react";

import { useFrontendAuth } from "../../auth/FrontendAuthProvider";
import { loadCurrentUserProfile } from "./loadCurrentUserProfile";

type ProfileState =
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

export function CurrentUserProfilePage() {
  const auth = useFrontendAuth();
  const [profileState, setProfileState] = useState<ProfileState>({
    status: "loading"
  });

  useEffect(() => {
    let cancelled = false;

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
  }, [auth]);

  return (
    <section>
      <h3>Current user profile</h3>
      {profileState.status === "loading" ? (
        <p>Loading current user profile...</p>
      ) : profileState.status === "error" ? (
        <p>Protected API error: {profileState.message}</p>
      ) : (
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
      )}
    </section>
  );
}
