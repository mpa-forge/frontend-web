## ADDED Requirements

### Requirement: Docker build accepts the baseline frontend configuration

The Docker build stage SHALL accept `VITE_APP_ENV`, `VITE_API_BASE_URL`,
`VITE_CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_SIGN_IN_URL`, and
`VITE_CLERK_SIGN_UP_URL` as build arguments, and it MUST export those values as
environment variables before the frontend build runs.

#### Scenario: Frontend build receives Vite configuration through build args

- **WHEN** the image is built with overridden frontend build arguments
- **THEN** the build stage exposes those values to `vite build` through
  environment variables

### Requirement: Runtime image serves the built static bundle with nginx

The runtime image SHALL copy the built `dist/` bundle into `nginx:1.29-alpine`,
expose port `80`, and keep nginx as the foreground process.

#### Scenario: Runtime image serves the compiled frontend bundle

- **WHEN** the container starts from the runtime stage
- **THEN** nginx serves the built frontend assets from the copied `dist/`
  directory on port `80`

### Requirement: Runtime image includes an HTTP healthcheck

The runtime image MUST define an HTTP healthcheck against
`http://127.0.0.1/`.

#### Scenario: Container healthcheck probes the nginx root path

- **WHEN** the runtime container is started
- **THEN** the image healthcheck probes the local nginx root URL
