import { useMutation, useQuery } from "@tanstack/react-query";
import {
  EnsureCurrentUserProfileRequest,
  GetCurrentUserRequest,
  type UserProfile
} from "@mpa-forge/platform-contracts-client";
import { useEffect, useRef } from "react";

import { useFrontendAuth } from "../../../app/providers/FrontendAuthProvider";
import {
  ProtectedApiError,
  classifyProtectedApiError,
  createProtectedApiRequestError,
  createUserServiceClient,
  type TokenProvider
} from "../../../api/protected/protectedApiClient";

export const protectedQueryKeys = {
  currentUserProfile: () => ["protected-api", "current-user-profile"] as const
};

async function ensureCurrentUserProfile(getToken: TokenProvider) {
  const client = createUserServiceClient(getToken);

  await client.ensureCurrentUserProfile(new EnsureCurrentUserProfileRequest());
}

async function getCurrentUserProfile(getToken: TokenProvider) {
  const client = createUserServiceClient(getToken);
  const response = await client.getCurrentUser(new GetCurrentUserRequest());

  if (!response.user) {
    throw createProtectedApiRequestError(
      "Protected API response did not include a user profile."
    );
  }

  return response.user;
}

type CurrentUserProfileDataState =
  | { status: "loading" }
  | { status: "error"; error: ProtectedApiError }
  | { status: "success"; profile: UserProfile };

/**
 * useCurrentUserProfileData owns the canonical current-user query key and the
 * ensure-then-read sequence for the first protected generated flow.
 */
export function useCurrentUserProfileData(): CurrentUserProfileDataState {
  const auth = useFrontendAuth();
  const hasStartedBootstrapRef = useRef(false);
  const bootstrapMutation = useMutation({
    mutationFn: () => ensureCurrentUserProfile(auth.getToken)
  });
  const profileQuery = useQuery({
    queryKey: protectedQueryKeys.currentUserProfile(),
    queryFn: () => getCurrentUserProfile(auth.getToken),
    enabled: bootstrapMutation.isSuccess
  });

  useEffect(() => {
    if (
      !auth.isSignedIn ||
      hasStartedBootstrapRef.current ||
      bootstrapMutation.status !== "idle"
    ) {
      return;
    }

    hasStartedBootstrapRef.current = true;
    bootstrapMutation.mutate();
  }, [auth.isSignedIn, bootstrapMutation.mutate, bootstrapMutation.status]);

  if (
    !auth.isSignedIn ||
    bootstrapMutation.isPending ||
    profileQuery.isPending
  ) {
    return { status: "loading" };
  }

  const error = bootstrapMutation.error ?? profileQuery.error;

  if (error) {
    return {
      status: "error",
      error: classifyProtectedApiError(error)
    };
  }

  if (!profileQuery.data) {
    return { status: "loading" };
  }

  return {
    status: "success",
    profile: profileQuery.data
  };
}
