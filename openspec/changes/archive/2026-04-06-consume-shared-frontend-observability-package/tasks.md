## 1. Runtime Contract And Dependency

- [x] 1.1 Add `@mpa-forge/platform-frontend-observability` to the frontend
      dependency set and extend `.env.example` plus
      `src/stores/runtime/runtimeStore.ts` with the required and optional
      browser-safe observability variables.
- [x] 1.2 Add app-owned observability bootstrap modules that create the shared
      runtime and browser-safe event emitter from the frontend runtime config.

## 2. App Bootstrap Integration

- [x] 2.1 Wrap the existing provider tree with the shared observability
      provider and add provider-owned auth-user-context, client-error, and Web
      Vitals bootstrap helpers.
- [x] 2.2 Mount a router-owned page-view tracker inside the existing route tree
      so authenticated SPA route transitions emit through the shared runtime.

## 3. Protected Flow Correlation

- [x] 3.1 Extend `src/api/protected/protectedApiClient.ts` so the shared
      generated-client transport attaches runtime-generated correlation headers
      alongside Clerk bearer tokens.
- [x] 3.2 Verify the current-user protected flow remains on the shared API
      client path and gains frontend-to-backend correlation without feature-page
      header wiring.

## 4. Validation And Sync

- [x] 4.1 Add or update automated coverage for the observability bootstrap and
      protected request-correlation behavior.
- [x] 4.2 Update the runtime/auth compatibility docs, run `make lint`,
      `make test`, `make format-check`, and `bun run build`, then archive or
      sync the completed change back into canonical OpenSpec specs.
