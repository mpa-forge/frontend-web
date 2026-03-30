import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { FrontendAuthProvider } from "./auth/FrontendAuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FrontendAuthProvider>
      <App />
    </FrontendAuthProvider>
  </React.StrictMode>
);
