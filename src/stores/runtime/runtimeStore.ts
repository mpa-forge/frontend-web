import { create } from "zustand";

export const requiredEnvVars = [
  "VITE_APP_ENV",
  "VITE_APP_RELEASE",
  "VITE_API_BASE_URL",
  "VITE_CLERK_PUBLISHABLE_KEY"
] as const;

export const envValues = {
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
  VITE_APP_RELEASE: import.meta.env.VITE_APP_RELEASE,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  VITE_CLERK_SIGN_IN_URL: import.meta.env.VITE_CLERK_SIGN_IN_URL,
  VITE_CLERK_SIGN_UP_URL: import.meta.env.VITE_CLERK_SIGN_UP_URL,
  VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: import.meta.env
    .VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
  VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: import.meta.env
    .VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
  VITE_OBSERVABILITY_ENABLED: import.meta.env.VITE_OBSERVABILITY_ENABLED,
  VITE_OBSERVABILITY_ENDPOINT: import.meta.env.VITE_OBSERVABILITY_ENDPOINT
};

type RuntimeStore = {
  envValues: typeof envValues;
  missingVars: string[];
};

export const useRuntimeStore = create<RuntimeStore>(() => ({
  envValues,
  missingVars: requiredEnvVars.filter((key) => !envValues[key])
}));
