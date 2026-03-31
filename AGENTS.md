# Agent Context

## Local Entry Point

This file is the repo-local entry point for agent context.

## Always Load

Before making changes:

1. Read `README.md`.
2. Read `Makefile` if present.
3. Run `make sync-agent-skills` before starting major changes or when shared skill guidance may have changed.
4. Read `../platform-blueprint-specs/common/AGENTS.md`.

## Repo Role

- Own the React SPA for the authenticated product application baseline.
- Consume generated TypeScript API clients from `platform-contracts`.
- In local development, usually run natively while support services come from `platform-infra`.
- Treat OpenSpec specs in `openspec/specs/` as the canonical behavior source for
  documented frontend runtime, local-stack, toolchain, testing, state, and
  container behavior.

## Relevant Shared Constraints

- Frontend is an authenticated SPA, CDN-oriented in cloud deployment.
- Frontend should consume generated contract clients rather than hand-written DTOs once Phase 2 integration is in place.
- Local frontend work should respect the hybrid local stack model documented in `platform-infra`.
- Frontend package management and repo script execution use Bun.
- Frontend unit/component tests use Vitest and browser tests use Playwright.
- Shared client state uses Zustand when state outgrows local component variables.

## Consult Conditionally

- `openspec/specs/frontend-runtime/spec.md` when the task touches frontend
  environment variables, app shell runtime status, `make run`, or the health
  endpoint.
- `openspec/specs/frontend-local-stack/spec.md` when the task touches support
  stack targets, local service URLs, or the hybrid frontend/API local workflow.
- `openspec/specs/frontend-container-runtime/spec.md` when the task touches the
  Dockerfile, frontend build arguments, static serving behavior, or container
  healthchecks.
- `openspec/specs/frontend-toolchain/spec.md` when the task touches Bun,
  toolchain pins, bootstrap behavior, or repo-local script/test entrypoints.
- `openspec/specs/frontend-testing/spec.md` when the task touches Vitest,
  Playwright, or repo-local test coverage expectations.
- `openspec/specs/frontend-state-management/spec.md` when the task touches
  shared client state, store design, or Zustand usage.
- `docs/frontend-runtime.md`, `docs/frontend-local-stack.md`, and
  `docs/frontend-container-runtime.md` when following existing `docs/`
  references or when a lightweight compatibility summary is enough.
- `../platform-blueprint-specs/platform-specification.md` only when the task
  needs broader platform architecture context or locked platform decisions
  beyond the frontend baseline.
- `../platform-blueprint-specs/implementation/implementation-plan.md` when the
  task depends on roadmap sequencing, phase ownership, or baseline MVP scope.
- `../platform-blueprint-specs/common/standards/environment-variable-strategy.md`
  when the task touches `.env.example`, browser-exposed `VITE_*` variables, or
  frontend env-contract design.
- `../platform-blueprint-specs/common/standards/environment-and-region.md` when
  the task touches `local` vs `rc` vs `prod` behavior, region defaults, CDN or
  ingress topology, or frontend deployment-path assumptions.
- `../platform-blueprint-specs/common/standards/access-model.md` when the task
  touches auth scope, role-driven UX, privileged frontend behavior, or secret
  and identity ownership boundaries.
- `../backend-api/openspec/specs/api-runtime/spec.md` when the task needs the current
  browser-facing API surface, local API expectations, or runtime behavior that
  frontend integration depends on.
- `../backend-api/openspec/specs/api-authentication/spec.md` or
  `../backend-api/docs/auth-implementation.md` when the task needs the
  canonical protected API auth behavior, Clerk claim mapping, or `401`/`403`
  semantics.
- `../platform-contracts/docs/typescript-client-usage.md` when the task touches
  generated TypeScript client consumption, package imports, or frontend
  contract-client wiring.
- `../platform-contracts/docs/consumer-auth-usage.md` when the task touches
  protected API calls, bearer-token handling, or the consumer-facing auth
  contract.
- `../platform-contracts/docs/contract-release-workflow.md` when the task
  touches released contract versions, GitHub Packages installs, version pinning,
  or switching frontend consumption from sibling-workspace usage to published
  package usage.

## Shared Skills

Run `make sync-agent-skills` before major changes so the local common skill
copies stay current.

- `automated-ai-worker` at `.codex/skills/automated-ai-worker/SKILL.md` when
  the repo is being changed by an automated AI worker or when following the same
  autonomous workflow manually.
- `platform-code-documentation` at
  `.codex/skills/platform-code-documentation/SKILL.md` when updating docs,
  comments, OpenSpec material, or deciding the correct documentation layer.
- `platform-env-contracts` at
  `.codex/skills/platform-env-contracts/SKILL.md` when creating or changing
  `.env.example`, browser-exposed config contracts, or startup/runtime
  validation guidance.
- `platform-validation-workflow` at
  `.codex/skills/platform-validation-workflow/SKILL.md` when deciding which
  repo-local validation commands to run or whether pre-commit should run.
- `platform-git-release-workflow` at
  `.codex/skills/platform-git-release-workflow/SKILL.md` when branch, merge,
  release, or clean-worktree decisions are involved.
- `platform-windows-tooling` at
  `.codex/skills/platform-windows-tooling/SKILL.md` when the task involves
  Windows workstation setup, PATH/tool resolution, or `make`/`bash`/`python`
  troubleshooting.
- `platform-blueprint-repo-workflow` at
  `.codex/skills/platform-blueprint-repo-workflow/SKILL.md` when work is driven
  by `platform-blueprint-specs` and spans this repo plus sibling implementation
  repositories.
- `openspec-propose` at
  `../platform-blueprint-specs/.codex/skills/openspec-propose/SKILL.md` when
  creating a new OpenSpec change proposal and its initial artifacts.
- `openspec-apply-change` at
  `../platform-blueprint-specs/.codex/skills/openspec-apply-change/SKILL.md`
  when implementing or continuing tasks from an OpenSpec change.
- `openspec-archive-change` at
  `../platform-blueprint-specs/.codex/skills/openspec-archive-change/SKILL.md`
  when a completed OpenSpec change needs to be validated, synced into canonical
  specs, and archived.

## Typical Validation

- `make lint`
- `make test`
- `make format-check`
- `bun run build` when the task touches runtime or container behavior

## Priority of Instructions

Repo-local instructions override shared planning docs.

If local repo docs conflict with a shared planning file, the more specific repo or task instruction wins.
