## MODIFIED Requirements

### Requirement: Browser environment contract

The frontend runtime SHALL treat `VITE_APP_ENV`, `VITE_API_BASE_URL`, `VITE_CLERK_PUBLISHABLE_KEY`, and `VITE_APP_RELEASE` as required browser-exposed configuration. The committed `.env.example` MUST document those required values together with the optional Clerk route placeholders `VITE_CLERK_SIGN_IN_URL`, `VITE_CLERK_SIGN_UP_URL`, `VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`, and `VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`, plus the optional browser-safe observability inputs `VITE_OBSERVABILITY_ENABLED`, `VITE_OBSERVABILITY_ENDPOINT`, `VITE_OBSERVABILITY_TRANSPORT`, and `VITE_OBSERVABILITY_DATASET`.

#### Scenario: `.env.example` documents the baseline runtime contract

- **WHEN** a developer opens the committed `.env.example`
- **THEN** the required frontend runtime variables, the optional Clerk route placeholders, and the optional browser-safe observability values are listed as the local configuration template

#### Scenario: Browser observability config remains browser-safe

- **WHEN** a developer configures frontend observability through the documented runtime variables
- **THEN** the contract exposes only browser-safe release and ingest values and does not require committed secrets, tokens, or prebuilt auth headers
