import { createClient, type Interceptor } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import {
  EnsureCurrentUserProfileRequest,
  GetCurrentUserRequest,
  type UserProfile,
  UserService
} from "@mpa-forge/platform-contracts-client";

import { envValues } from "../../stores/runtimeStore";

type TokenProvider = () => Promise<string | null>;

function createAuthInterceptor(getToken: TokenProvider): Interceptor {
  return (next) => async (req) => {
    const token = await getToken();

    if (token) {
      req.header.set("Authorization", `Bearer ${token}`);
    }

    return next(req);
  };
}

export function createUserServiceClient(getToken: TokenProvider) {
  const transport = createConnectTransport({
    baseUrl: envValues.VITE_API_BASE_URL,
    useBinaryFormat: false,
    interceptors: [createAuthInterceptor(getToken)]
  });

  return createClient(UserService, transport);
}

export async function loadCurrentUserProfile(
  getToken: TokenProvider
): Promise<UserProfile> {
  const client = createUserServiceClient(getToken);

  await client.ensureCurrentUserProfile(new EnsureCurrentUserProfileRequest());

  const response = await client.getCurrentUser(new GetCurrentUserRequest());

  if (!response.user) {
    throw new Error("Protected API response did not include a user profile.");
  }

  return response.user;
}
