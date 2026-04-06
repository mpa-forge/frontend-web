# Frontend Auth Bootstrap

Use this guide when bootstrapping `frontend-web` locally or when copying this
baseline into a new frontend repo that uses Clerk-authenticated browser flows.

## What You Need

Create a local `.env` from `.env.example` and fill these frontend values:

```dotenv
VITE_APP_ENV=local
VITE_APP_RELEASE=local-dev
VITE_API_BASE_URL=http://localhost:8080
VITE_CLERK_PUBLISHABLE_KEY=pk_test_replace_me
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
VITE_OBSERVABILITY_ENABLED=false
VITE_OBSERVABILITY_ENDPOINT=
```

Meaning:

- `VITE_APP_ENV`: frontend runtime environment label, usually `local`
- `VITE_APP_RELEASE`: browser-visible release label used by shared frontend
  observability metadata, usually `local-dev` for local work
- `VITE_API_BASE_URL`: browser-visible API base URL, usually
  `http://localhost:8080` for local work
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk frontend publishable key for the SPA
- `VITE_CLERK_SIGN_IN_URL`: SPA route that hosts the sign-in flow
- `VITE_CLERK_SIGN_UP_URL`: SPA route that hosts the sign-up flow
- `VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`: where Clerk returns after sign-in
- `VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`: where Clerk returns after sign-up
- `VITE_OBSERVABILITY_ENABLED`: browser-safe toggle for the shared frontend
  observability runtime
- `VITE_OBSERVABILITY_ENDPOINT`: optional browser-safe endpoint used by the
  shared frontend observability emitter

## Where To Get The Clerk Values

Use the same Clerk application that the local `backend-api` is configured to
validate.

### Publishable Key

Get `VITE_CLERK_PUBLISHABLE_KEY` from:

1. Clerk Dashboard
2. Select the correct application
3. Open the API keys or Developers/API Keys area
4. Copy the Publishable key

Do not use the secret key in the frontend.

### Sign-In And Sign-Up Routes

For this repo, keep these values unless the app intentionally changes its auth
route structure:

- `VITE_CLERK_SIGN_IN_URL=/sign-in`
- `VITE_CLERK_SIGN_UP_URL=/sign-up`
- `VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/`
- `VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/`

These are repo-local SPA routes, not values copied from the Clerk dashboard.

Current route ownership:

- `/`: protected app-shell home for the first authenticated feature flow
- `/sign-in`: public auth-entry route that renders the Clerk sign-in SPA flow
- `/sign-up`: public auth-entry route that renders the Clerk sign-up SPA flow

The shared authenticated shell also owns the baseline sign-out handoff and
returns signed-out browser sessions to the documented sign-in route.

## Auth-Entry Route Behavior

The frontend now keeps one explicit route-local auth-entry contract:

- signed-out visits to protected routes are redirected to `/sign-in` with a
  `redirectTo` query string that preserves the intended protected destination
- `/sign-in` and `/sign-up` resolve one safe in-app post-auth target before
  they render the real Clerk components
- already-signed-in visits to `/sign-in` or `/sign-up` short-circuit back to
  the resolved protected target instead of showing auth UI again
- if the Clerk publishable key is still the placeholder or missing, the
  auth-entry routes render an explicit "Authentication unavailable" state
  instead of failing silently

Keep the documented local route values above unless the router contract itself
changes. The Clerk components are mounted inside these app-owned React Router
pages, not on separate hosted callback URLs.

## Backend Alignment Requirement

The frontend alone is not enough for a working protected flow. The local
`backend-api` must be configured with the matching Clerk values, especially:

- `AUTH_ISSUER_URL`
- `AUTH_AUDIENCE`

Those backend values come from the same Clerk application and token setup. If
the frontend and backend point at different Clerk apps or audiences, sign-in
may succeed while protected API calls still fail.

## Shared Protected API Flow

The repo now owns one shared protected API access path for generated browser
clients:

- `VITE_API_BASE_URL` is resolved by the shared generated-client transport
- Clerk session tokens are attached in that shared transport instead of
  feature-local request code
- frontend-to-backend correlation headers are attached in that same shared
  transport through `@mpa-forge/platform-frontend-observability`
- protected server data is bootstrapped through one root TanStack Query
  provider
- the current-user profile flow runs `EnsureCurrentUserProfile` before
  `GetCurrentUser`

## Shared Frontend Observability Flow

`frontend-web` now consumes the sibling
`@mpa-forge/platform-frontend-observability` package for the browser telemetry
baseline:

- one app-owned runtime is created from browser-safe `VITE_*` values
- auth state updates the shared observability user context
- React Router route transitions emit shared page views
- browser errors, unhandled promise rejections, and Web Vitals are captured
  from app bootstrap instead of feature pages

Do not add provider secrets, tokens, or static auth headers to frontend
observability config. The shared package accepts browser-safe endpoint metadata
only.

If Clerk is configured but protected API calls still fail, check both the
frontend runtime values above and the matching backend issuer/audience config
before debugging page-level code.

## Source Layout Baseline

The frontend baseline now separates ownership by scope:

- app-wide providers and shell modules live in `src/app/`
- route paths, auth boundaries, and route-tree composition live in `src/routes/`
- feature-owned pages, local components, and feature-specific API wrappers live
  in `src/features/<feature>/`
- shared generated-client/query infrastructure lives in `src/api/`
- app-wide Zustand stores live in `src/stores/`
- shared promoted UI lives in `src/ui/`

Use `docs/frontend-module-boundaries.md` for the detailed promotion rules. Keep
single-feature code inside the owning feature folder until it has real
cross-feature reuse or clear app-wide ownership.

## Local Bootstrap Sequence

1. Copy `.env.example` to `.env`
2. Fill the real `VITE_CLERK_PUBLISHABLE_KEY`
3. Keep the local auth routes unless the frontend router changes
4. Confirm `backend-api/.env` is already filled with matching Clerk auth values
5. Export `GITHUB_PACKAGES_TOKEN` if the repo consumes published
   `@mpa-forge/*` packages
6. Run `make bootstrap`
7. Start local services and frontend using the repo-local workflow

## Future Frontend Repos Forked From This One

When a future frontend repo copies this baseline:

1. keep the same env-variable names unless the runtime contract intentionally
   changes
2. keep a committed `.env.example` with placeholder values only
3. add a repo-local bootstrap doc that tells developers where the Clerk
   publishable key comes from
4. make it explicit which values are copied from Clerk and which are repo-local
   routes
5. document the backend alignment requirement for issuer and audience
6. keep a documented sign-out destination for the protected app shell
