import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { appQueryClient } from "./api/queryClient";
import { FrontendAuthProvider } from "./auth/FrontendAuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FrontendAuthProvider>
      <QueryClientProvider client={appQueryClient}>
        <App />
      </QueryClientProvider>
    </FrontendAuthProvider>
  </React.StrictMode>
);
