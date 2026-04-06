## MODIFIED Requirements

### Requirement: Browser environment contract

The frontend runtime SHALL treat `VITE_APP_ENV`, `VITE_APP_RELEASE`,
`VITE_API_BASE_URL`, and `VITE_CLERK_PUBLISHABLE_KEY` as required
browser-exposed configuration. The committed `.env.example` MUST document those
required values together with the optional Clerk route placeholders
`VITE_CLERK_SIGN_IN_URL`, `VITE_CLERK_SIGN_UP_URL`,
`VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`, and
`VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`, plus the browser-safe observability
placeholders `VITE_OBSERVABILITY_ENABLED` and `VITE_OBSERVABILITY_ENDPOINT`.

#### Scenario: `.env.example` documents the baseline runtime contract

- **WHEN** a developer opens the committed `.env.example`
- **THEN** the required frontend runtime variables, the optional Clerk route
  placeholders, and the optional browser-safe observability placeholders are
  listed as the local configuration template
