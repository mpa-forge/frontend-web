import type { UserProfile } from "@mpa-forge/platform-contracts-client";

import { DetailList } from "../../../ui/data/DetailList";

type CurrentUserProfileDetailsProps = {
  profile: UserProfile;
};

export function CurrentUserProfileDetails({
  profile
}: CurrentUserProfileDetailsProps) {
  return (
    <DetailList
      items={[
        { label: "User ID", value: profile.userId },
        { label: "Email", value: profile.email },
        { label: "Display name", value: profile.displayName },
        { label: "Role", value: profile.role }
      ]}
    />
  );
}
