import {
  ClerkProvider,
  type ClerkProviderProps,
  useAuth,
  useClerk,
  useUser
} from "@clerk/clerk-react";
import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";

import { envValues } from "../stores/runtimeStore";
import { signInRoute, signUpRoute, signedOutRoute } from "../routes/routes";

type TokenProvider = () => Promise<string | null>;
type SignOutHandler = () => Promise<void>;

type FrontendAuthValue = {
  isAuthConfigured: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  getToken: TokenProvider;
  signOut: SignOutHandler;
  signInUrl: string;
  signUpUrl: string;
  userDisplayName: string | null;
};

const defaultAuthValue: FrontendAuthValue = {
  isAuthConfigured: false,
  isLoaded: true,
  isSignedIn: false,
  getToken: async () => null,
  signOut: async () => undefined,
  signInUrl: signInRoute,
  signUpUrl: signUpRoute,
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
  const clerk = useClerk();
  const { user } = useUser();

  return (
    <FrontendAuthContext.Provider
      value={{
        isAuthConfigured: true,
        isLoaded,
        isSignedIn: Boolean(isSignedIn),
        getToken: async () => (await getToken()) ?? null,
        signOut: async () => {
          const redirectUrl =
            typeof window === "undefined"
              ? signedOutRoute
              : new URL(signedOutRoute, window.location.origin).toString();

          await clerk.signOut({ redirectUrl });
        },
        signInUrl: signInRoute,
        signUpUrl: signUpRoute,
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
    signInUrl: signInRoute,
    signUpUrl: signUpRoute,
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
