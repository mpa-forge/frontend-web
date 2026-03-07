const requiredEnvVars = [
  "VITE_APP_ENV",
  "VITE_API_BASE_URL",
  "VITE_CLERK_PUBLISHABLE_KEY"
] as const;

const envValues = {
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  VITE_CLERK_SIGN_IN_URL: import.meta.env.VITE_CLERK_SIGN_IN_URL,
  VITE_CLERK_SIGN_UP_URL: import.meta.env.VITE_CLERK_SIGN_UP_URL
};

const missingVars = requiredEnvVars.filter((key) => !envValues[key]);

export function App() {
  return (
    <main>
      <h1>MPA Forge Blueprint</h1>
      <p>Phase 1 local frontend baseline.</p>
      <section>
        <h2>Runtime</h2>
        <ul>
          <li>Environment: {envValues.VITE_APP_ENV}</li>
          <li>API base URL: {envValues.VITE_API_BASE_URL}</li>
          <li>Auth publishable key present: {envValues.VITE_CLERK_PUBLISHABLE_KEY ? "yes" : "no"}</li>
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
