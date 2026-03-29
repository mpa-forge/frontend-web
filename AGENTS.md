# Agent Context

## Local Entry Point

This file is the repo-local entry point for agent context.

## Always Load

Before making changes:

1. Read `README.md`.
2. Read `Makefile` if present.
3. Read `../platform-blueprint-specs/common/AGENTS.md`.
4. Read `../platform-blueprint-specs/.codex/skills/automated-ai-worker/SKILL.md` when the repo is being changed by an automated AI worker or when following the same autonomous workflow manually.
5. Read `../platform-blueprint-specs/implementation/phases/phase-1-repository-and-local-development-baseline.md`.
6. Read `../platform-blueprint-specs/implementation/phases/phase-2-contracts-service-skeletons-and-data-baseline.md`.
7. Read `../platform-contracts/docs/typescript-client-usage.md`.
8. Read `../platform-contracts/docs/consumer-auth-usage.md`.
9. Check local repo docs under `docs/` if the task touches frontend runtime or build behavior.

## Repo Role

- Own the React SPA for the authenticated product application baseline.
- Consume generated TypeScript API clients from `platform-contracts`.
- In local development, usually run natively while support services come from `platform-infra`.

## Relevant Shared Constraints

- Frontend is an authenticated SPA, CDN-oriented in cloud deployment.
- Frontend should consume generated contract clients rather than hand-written DTOs once Phase 2 integration is in place.
- Local frontend work should respect the hybrid local stack model documented in `platform-infra`.

## Typical Validation

- `make lint`
- `make format-check`
- repo-local build command from `README.md` when task touches runtime behavior

## Priority of Instructions

Repo-local instructions override shared planning docs.

If local repo docs conflict with a shared planning file, the more specific repo or task instruction wins.
