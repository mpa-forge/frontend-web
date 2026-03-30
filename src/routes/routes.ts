import { envValues } from "../stores/runtimeStore";

function resolveLocalRoute(
  configuredRoute: string | undefined,
  fallbackRoute: string
) {
  return configuredRoute?.startsWith("/") ? configuredRoute : fallbackRoute;
}

export const protectedHomeRoute = "/";
export const signInRoute = resolveLocalRoute(
  envValues.VITE_CLERK_SIGN_IN_URL,
  "/sign-in"
);
export const signUpRoute = resolveLocalRoute(
  envValues.VITE_CLERK_SIGN_UP_URL,
  "/sign-up"
);
export const signedOutRoute = signInRoute;
