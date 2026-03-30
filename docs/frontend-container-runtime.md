# Frontend Container Runtime

This file is a compatibility entry point. The canonical container runtime
requirements now live in `openspec/specs/frontend-container-runtime/spec.md`.

## OpenSpec Capability

- `frontend-container-runtime`

## Quick Reference

- the Docker build stage accepts the current Vite-oriented build arguments for
  app environment, API base URL, and Clerk route configuration
- the Docker build stage installs dependencies and runs the frontend build
  through Bun
- the runtime image remains `nginx:1.29-alpine` serving the built `dist/`
  bundle
- the container exposes port `80`
- the runtime image healthcheck probes `http://127.0.0.1/`

## Update Rule

When frontend container-image behavior changes, update the OpenSpec capability
first and keep this file as a lightweight reader-friendly summary.
