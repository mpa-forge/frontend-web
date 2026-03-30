import { QueryClient } from "@tanstack/react-query";

// Protected API failures should surface quickly in the UI instead of retrying
// hidden auth/configuration problems in the background.
export const appQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    },
    mutations: {
      retry: false
    }
  }
});
