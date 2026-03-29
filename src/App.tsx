import { useRuntimeStore } from "./stores/runtimeStore";

export function App() {
  const envValues = useRuntimeStore((state) => state.envValues);
  const missingVars = useRuntimeStore((state) => state.missingVars);

  return (
    <main>
      <h1>MPA Forge Blueprint</h1>
      <p>Phase 1 local frontend baseline.</p>
      <section>
        <h2>Runtime</h2>
        <ul>
          <li>Environment: {envValues.VITE_APP_ENV}</li>
          <li>API base URL: {envValues.VITE_API_BASE_URL}</li>
          <li>
            Auth publishable key present:{" "}
            {envValues.VITE_CLERK_PUBLISHABLE_KEY ? "yes" : "no"}
          </li>
        </ul>
      </section>
      <section>
        <h2>Local stack</h2>
        <ul>
          <li>Frontend native mode uses `make run`.</li>
          <li>Compose support mode provides backend API and Postgres.</li>
        </ul>
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
