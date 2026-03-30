# Frontend Auth Bootstrap

Use this guide when bootstrapping `frontend-web` locally or when copying this
baseline into a new frontend repo that uses Clerk-authenticated browser flows.

## What You Need

Create a local `.env` from `.env.example` and fill these frontend values:

```dotenv
VITE_APP_ENV=local
VITE_API_BASE_URL=http://localhost:8080
VITE_CLERK_PUBLISHABLE_KEY=pk_test_replace_me
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

Meaning:

- `VITE_APP_ENV`: frontend runtime environment label, usually `local`
- `VITE_API_BASE_URL`: browser-visible API base URL, usually
  `http://localhost:8080` for local work
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk frontend publishable key for the SPA
- `VITE_CLERK_SIGN_IN_URL`: SPA route that hosts the sign-in flow
- `VITE_CLERK_SIGN_UP_URL`: SPA route that hosts the sign-up flow
- `VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`: where Clerk returns after sign-in
- `VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`: where Clerk returns after sign-up

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
- `/sign-in`: public auth-entry route reserved for Clerk sign-in handoff
- `/sign-up`: public auth-entry route reserved for Clerk sign-up handoff

The shared authenticated shell also owns the baseline sign-out handoff and
returns signed-out browser sessions to the documented sign-in route.

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
- protected server data is bootstrapped through one root TanStack Query
  provider
- the current-user profile flow runs `EnsureCurrentUserProfile` before
  `GetCurrentUser`

If Clerk is configured but protected API calls still fail, check both the
frontend runtime values above and the matching backend issuer/audience config
before debugging page-level code.

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
