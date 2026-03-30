import { create } from "zustand";

export const requiredEnvVars = [
  "VITE_APP_ENV",
  "VITE_API_BASE_URL",
  "VITE_CLERK_PUBLISHABLE_KEY"
] as const;

export const envValues = {
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  VITE_CLERK_SIGN_IN_URL: import.meta.env.VITE_CLERK_SIGN_IN_URL,
  VITE_CLERK_SIGN_UP_URL: import.meta.env.VITE_CLERK_SIGN_UP_URL,
  VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: import.meta.env
    .VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
  VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: import.meta.env
    .VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
};

type RuntimeStore = {
  envValues: typeof envValues;
  missingVars: string[];
};

export const useRuntimeStore = create<RuntimeStore>(() => ({
  envValues,
  missingVars: requiredEnvVars.filter((key) => !envValues[key])
}));
