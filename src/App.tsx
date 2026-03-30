import type { PropsWithChildren } from "react";

import { AppProviders } from "./app/providers/AppProviders";
import { AppRouter } from "./routes/AppRouter";

function RootApp({ children }: PropsWithChildren) {
  return <AppProviders>{children}</AppProviders>;
}

export function App() {
  return (
    <RootApp>
      <AppRouter />
    </RootApp>
  );
}
