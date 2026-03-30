## 1. Real Auth-Entry Routes

- [x] 1.1 Replace the placeholder `/sign-in` and `/sign-up` route contents with the real Clerk SPA auth-entry flow while keeping the app-owned route modules and shared shell contract intact.
- [x] 1.2 Preserve explicit route-local handling for missing Clerk configuration and already-signed-in browser sessions so auth-entry routes do not fail silently or loop.

## 2. Redirect And Protected Flow Integration

- [x] 2.1 Resolve one canonical post-auth redirect target from the auth-entry route and pass it through the Clerk flow so protected-route redirects return users to the intended protected app path.
- [x] 2.2 Confirm the successful sign-in and sign-up flow can return to the protected home route and continue into the current-user profile proof without a manual shell reload.

## 3. Docs And Verification

- [x] 3.1 Update repo-local auth/runtime guidance and any route-related compatibility docs so they describe the real auth-entry flow instead of placeholder route behavior.
- [x] 3.2 Add or update frontend tests for auth-entry route rendering, redirect preservation, signed-in short-circuiting, and missing-config behavior.
- [x] 3.3 Run repo validation for the changed auth-entry flow, including lint, unit tests, browser coverage as appropriate, format checks, and a production build.
- [x] 3.4 Archive or sync the completed change back into canonical OpenSpec specs after implementation is verified.
