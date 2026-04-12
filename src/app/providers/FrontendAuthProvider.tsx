import { ClerkProvider, useAuth, useClerk, useUser } from "@clerk/clerk-react";
import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";

import { signInRoute, signUpRoute, signedOutRoute } from "../../routes/paths";
import { envValues } from "../../stores/runtime/runtimeStore";

type TokenProvider = () => Promise<string | null>;
type SignOutHandler = () => Promise<void>;

type FrontendAuthValue = {
  isAuthConfigured: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  getToken: TokenProvider;
  sessionId: string | null;
  signOut: SignOutHandler;
  signInUrl: string;
  signUpUrl: string;
  userDisplayName: string | null;
  userId: string | null;
};

const defaultAuthValue: FrontendAuthValue = {
  isAuthConfigured: false,
  isLoaded: true,
  isSignedIn: false,
  getToken: async () => null,
  sessionId: null,
  signOut: async () => undefined,
  signInUrl: signInRoute,
  signUpUrl: signUpRoute,
  userDisplayName: null,
  userId: null
};

const FrontendAuthContext = createContext<FrontendAuthValue>(defaultAuthValue);

function navigateWithWindow(
  to: string,
  mode: "push" | "replace"
): Promise<void> | void {
  if (typeof window === "undefined") {
    return;
  }

  const destination = new URL(to, window.location.origin).toString();

  if (mode === "replace") {
    window.location.replace(destination);
    return;
  }

  window.location.assign(destination);
}

function hasConfiguredClerkPublishableKey(
  publishableKey: string | undefined
): publishableKey is string {
  return Boolean(publishableKey && publishableKey !== "pk_test_replace_me");
}

function ClerkSessionAuthProvider({ children }: PropsWithChildren) {
  const { getToken, isLoaded, isSignedIn, sessionId } = useAuth();
  const clerk = useClerk();
  const { user } = useUser();

  return (
    <FrontendAuthContext.Provider
      value={{
        isAuthConfigured: true,
        isLoaded,
        isSignedIn: Boolean(isSignedIn),
        getToken: async () => (await getToken()) ?? null,
        sessionId: sessionId ?? null,
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
          user?.fullName || user?.primaryEmailAddress?.emailAddress || null,
        userId: user?.id ?? null
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

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      routerPush={(to) => navigateWithWindow(to, "push")}
      routerReplace={(to) => navigateWithWindow(to, "replace")}
      signInUrl={signInRoute}
      signUpUrl={signUpRoute}
      signInFallbackRedirectUrl={
        envValues.VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
      }
      signUpFallbackRedirectUrl={
        envValues.VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
      }
    >
      <ClerkSessionAuthProvider>{children}</ClerkSessionAuthProvider>
    </ClerkProvider>
  );
}

export function useFrontendAuth() {
  return useContext(FrontendAuthContext);
}
