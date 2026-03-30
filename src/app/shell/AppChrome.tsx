import type { PropsWithChildren, ReactNode } from "react";

import { DetailList } from "../../ui/data/DetailList";
import { useRuntimeStore } from "../../stores/runtime/runtimeStore";

type AppChromeProps = {
  title: string;
  summary: string;
  actions?: ReactNode;
};

export function AppChrome({
  title,
  summary,
  actions,
  children
}: PropsWithChildren<AppChromeProps>) {
  const envValues = useRuntimeStore((state) => state.envValues);
  const missingVars = useRuntimeStore((state) => state.missingVars);

  return (
    <main>
      <header>
        <h1>MPA Forge Blueprint</h1>
        <p>Phase 2 frontend routing and protected app-shell baseline.</p>
        <h2>{title}</h2>
        <p>{summary}</p>
        {actions ? <div>{actions}</div> : null}
      </header>
      {children}
      <section>
        <h2>Runtime</h2>
        <DetailList
          items={[
            { label: "Environment", value: envValues.VITE_APP_ENV },
            { label: "API base URL", value: envValues.VITE_API_BASE_URL },
            {
              label: "Auth publishable key present",
              value: envValues.VITE_CLERK_PUBLISHABLE_KEY ? "yes" : "no"
            }
          ]}
        />
      </section>
      <section>
        <h2>Local stack</h2>
        <DetailList
          items={[
            {
              label: "Frontend mode",
              value: "Frontend native mode uses `make run`."
            },
            {
              label: "Compose support",
              value: "Compose support mode provides backend API and Postgres."
            }
          ]}
        />
      </section>
      {missingVars.length > 0 ? (
        <section>
          <h2>Missing configuration</h2>
          <p>{missingVars.join(", ")}</p>
        </section>
      ) : null}
    </main>
  );
}
