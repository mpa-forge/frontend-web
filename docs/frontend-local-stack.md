# Frontend Local Stack

This file is a compatibility entry point. The canonical local-stack
requirements now live in `openspec/specs/frontend-local-stack/spec.md`.

## OpenSpec Capability

- `frontend-local-stack`

## Quick Reference

- `make support-up`, `make support-down`, `make support-logs`, and
  `make support-ps` delegate to the sibling `platform-infra` repo
- frontend-focused local development keeps the frontend native on
  `http://localhost:3000`
- the shared support stack provides `backend-api` on `http://localhost:8080`
  and PostgreSQL on `localhost:5432`
- API-focused mode is still orchestrated from `backend-api`, where the
  containerized frontend is exposed on `http://localhost:3000`

## Update Rule

When frontend local-stack behavior changes, update the OpenSpec capability
first and keep this file as a lightweight reader-friendly summary.
