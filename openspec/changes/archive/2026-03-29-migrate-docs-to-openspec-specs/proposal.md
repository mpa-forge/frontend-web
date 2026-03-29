## Why

Important frontend behavior currently lives in `README.md`, `.env.example`,
`Dockerfile`, and repo configuration, but none of it is represented as
OpenSpec capabilities. Capturing that baseline in OpenSpec makes the repo's
runtime and local-stack expectations reviewable and gives future frontend
changes a canonical spec surface to modify.

## What Changes

- Add OpenSpec capability specs for the frontend runtime contract, local stack
  orchestration, and container runtime baseline.
- Create lightweight compatibility docs under `docs/` that point readers to the
  new canonical OpenSpec specs.
- Add a repo-specific `openspec/config.yaml` with stable frontend context and
  artifact rules for future changes.
- Trim `AGENTS.md` so only repo-local context plus the shared common agent
  context are always loaded, while broader planning docs and workflow guidance
  move to conditional references and shared skills.

## Capabilities

### New Capabilities

- `frontend-runtime`: browser-exposed environment contract, app shell status
  surface, and local run plus health endpoint behavior.
- `frontend-local-stack`: hybrid local development expectations and delegated
  support-stack entrypoints.
- `frontend-container-runtime`: Docker build-time configuration flow and nginx
  runtime image behavior.

### Modified Capabilities

- None.

## Impact

- `openspec/config.yaml`
- `openspec/changes/migrate-docs-to-openspec-specs/`
- `openspec/specs/`
- `docs/frontend-runtime.md`
- `docs/frontend-local-stack.md`
- `docs/frontend-container-runtime.md`
- `AGENTS.md`
- `README.md`
