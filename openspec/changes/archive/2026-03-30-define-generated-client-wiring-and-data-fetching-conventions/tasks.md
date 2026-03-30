## 1. Shared Client Wiring

- [x] 1.1 Add or update the shared generated-client integration module so it builds the Connect transport and `UserService` client from `@mpa-forge/platform-contracts-client` using `VITE_API_BASE_URL`.
- [x] 1.2 Add shared Clerk bearer-token injection and protected API error classification to the generated-client transport path.

## 2. TanStack Query Bootstrap

- [x] 2.1 Add `@tanstack/react-query` to the repo and bootstrap one root `QueryClientProvider` from the frontend entrypoint.
- [x] 2.2 Define the shared TanStack Query baseline for protected generated API calls, including canonical query-key ownership and the standard mutation-then-query sequence.

## 3. First Protected Consumer

- [x] 3.1 Refactor the protected current-user profile flow to call `EnsureCurrentUserProfile` before `GetCurrentUser` through the shared generated-client and query conventions.
- [x] 3.2 Ensure the protected profile page renders explicit loading, classified API-error, and success states using the shared data-fetching pattern.

## 4. Validation And Sync

- [x] 4.1 Update the relevant frontend compatibility docs and OpenSpec-linked references for the new client-wiring baseline.
- [x] 4.2 Run the repo-local validation commands for the changed frontend flow.
- [x] 4.3 Archive or sync the completed change back into canonical OpenSpec specs once implementation is finished.
