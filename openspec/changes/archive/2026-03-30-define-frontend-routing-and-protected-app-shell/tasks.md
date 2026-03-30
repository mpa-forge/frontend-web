## 1. Router foundation

- [x] 1.1 Add the frontend router dependency and move app bootstrap from a single `App` render to a router-owned entrypoint.
- [x] 1.2 Define the initial route map with public `/sign-in` and `/sign-up` auth-entry routes plus the protected `/` app-shell route.
- [x] 1.3 Implement a shared protected-route boundary that handles auth loading, auth-unavailable, unauthenticated handoff, and authorized render states.

## 2. Protected shell and page wiring

- [x] 2.1 Create the shared authenticated app-shell layout with baseline user context plus explicit sign-out handoff controls owned by the shell.
- [x] 2.2 Move the current-user profile proof into the protected shell as the first protected page while keeping the generated-client provisioning/read flow intact.
- [x] 2.3 Add route-local auth-entry surfaces for `/sign-in` and `/sign-up` that preserve the documented path contract until the full Clerk flow lands in `P2-T10D`.

## 3. Documentation and verification

- [x] 3.1 Update repo-local docs and runtime/auth guidance so the documented route map matches the implemented protected app-shell baseline.
- [x] 3.2 Update or add frontend tests that cover route ownership, shared protected-route behavior, the protected profile page inside the shell, and a Playwright smoke path for the routed shell entrypoint.
- [x] 3.3 Run repo validation (`make lint`, `make test`, `bun run test:e2e`, `make format-check`, and `bun run build`) and resolve any regressions from the routing/app-shell change.
