import { FrontendObservabilityProvider } from "@mpa-forge/platform-frontend-observability/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

import { appQueryClient } from "../../api/query/queryClient";
import { frontendObservabilityRuntime } from "../observability/runtime";
import { FrontendAuthProvider } from "./FrontendAuthProvider";
import { FrontendObservabilityBootstrap } from "./FrontendObservabilityBootstrap";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <FrontendObservabilityProvider runtime={frontendObservabilityRuntime}>
      <FrontendAuthProvider>
        <FrontendObservabilityBootstrap />
        <QueryClientProvider client={appQueryClient}>
          {children}
        </QueryClientProvider>
      </FrontendAuthProvider>
    </FrontendObservabilityProvider>
  );
}
