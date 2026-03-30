import { useFrontendAuth } from "../../auth/FrontendAuthProvider";
import { useCurrentUserProfileData } from "../../api/currentUserProfile";

function getProtectedApiErrorHeading(
  errorKind: "configuration" | "auth" | "request"
) {
  switch (errorKind) {
    case "configuration":
      return "Protected API configuration error";
    case "auth":
      return "Protected API auth error";
    case "request":
      return "Protected API request error";
  }
}

export function CurrentUserProfilePage() {
  const auth = useFrontendAuth();
  const profileState = useCurrentUserProfileData();

  return (
    <section>
      <h3>Current user profile</h3>
      {profileState.status === "loading" ? (
        <p>Loading current user profile...</p>
      ) : profileState.status === "error" ? (
        <>
          <p>{getProtectedApiErrorHeading(profileState.error.kind)}</p>
          <p>{profileState.error.message}</p>
        </>
      ) : (
        <>
          <p>
            Signed in as{" "}
            {auth.userDisplayName || profileState.profile.displayName}.
          </p>
          <ul>
            <li>User ID: {profileState.profile.userId}</li>
            <li>Email: {profileState.profile.email}</li>
            <li>Display name: {profileState.profile.displayName}</li>
            <li>Role: {profileState.profile.role}</li>
          </ul>
        </>
      )}
    </section>
  );
}
