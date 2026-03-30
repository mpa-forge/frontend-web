import { useFrontendAuth } from "../../../app/providers/FrontendAuthProvider";
import { CurrentUserProfileDetails } from "../components/CurrentUserProfileDetails";
import { useCurrentUserProfileData } from "../api/useCurrentUserProfileData";

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
          <CurrentUserProfileDetails profile={profileState.profile} />
        </>
      )}
    </section>
  );
}
