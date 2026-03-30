import {
  ClerkProvider,
  type ClerkProviderProps,
  useAuth,
  useUser
} from "@clerk/clerk-react";
import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";

import { envValues } from "../stores/runtimeStore";

type TokenProvider = () => Promise<string | null>;

type FrontendAuthValue = {
  isAuthConfigured: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  getToken: TokenProvider;
  signInUrl: string;
  signUpUrl: string;
  userDisplayName: string | null;
};

const defaultAuthValue: FrontendAuthValue = {
  isAuthConfigured: false,
  isLoaded: true,
  isSignedIn: false,
  getToken: async () => null,
  signInUrl: envValues.VITE_CLERK_SIGN_IN_URL || "/sign-in",
  signUpUrl: envValues.VITE_CLERK_SIGN_UP_URL || "/sign-up",
  userDisplayName: null
};

const FrontendAuthContext = createContext<FrontendAuthValue>(defaultAuthValue);

function hasConfiguredClerkPublishableKey(
  publishableKey: string | undefined
): publishableKey is string {
  return Boolean(publishableKey && publishableKey !== "pk_test_replace_me");
}

function ClerkSessionAuthProvider({ children }: PropsWithChildren) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <FrontendAuthContext.Provider
      value={{
        isAuthConfigured: true,
        isLoaded,
        isSignedIn: Boolean(isSignedIn),
        getToken: async () => (await getToken()) ?? null,
        signInUrl: envValues.VITE_CLERK_SIGN_IN_URL || "/sign-in",
        signUpUrl: envValues.VITE_CLERK_SIGN_UP_URL || "/sign-up",
        userDisplayName:
          user?.fullName || user?.primaryEmailAddress?.emailAddress || null
      }}
    >
      {children}
    </FrontendAuthContext.Provider>
  );
}

export function FrontendAuthProvider({ children }: PropsWithChildren) {
  const publishableKey = envValues.VITE_CLERK_PUBLISHABLE_KEY;

  if (!hasConfiguredClerkPublishableKey(publishableKey)) {
    return (
      <FrontendAuthContext.Provider value={defaultAuthValue}>
        {children}
      </FrontendAuthContext.Provider>
    );
  }

  const clerkProps: ClerkProviderProps = {
    publishableKey,
    signInUrl: envValues.VITE_CLERK_SIGN_IN_URL,
    signUpUrl: envValues.VITE_CLERK_SIGN_UP_URL,
    signInFallbackRedirectUrl:
      envValues.VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
    signUpFallbackRedirectUrl:
      envValues.VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
  };

  return (
    <ClerkProvider {...clerkProps}>
      <ClerkSessionAuthProvider>{children}</ClerkSessionAuthProvider>
    </ClerkProvider>
  );
}

export function useFrontendAuth() {
  return useContext(FrontendAuthContext);
}
