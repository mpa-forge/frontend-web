import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

import { appQueryClient } from "../../api/query/queryClient";
import { FrontendAuthProvider } from "./FrontendAuthProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <FrontendAuthProvider>
      <QueryClientProvider client={appQueryClient}>
        {children}
      </QueryClientProvider>
    </FrontendAuthProvider>
  );
}
