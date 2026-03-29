## Context

`frontend-web` does not have durable repo-local behavior specs yet. The repo
documents its baseline mostly through `README.md`, while the actual runtime
contract is spread across `.env.example`, `src/App.tsx`, `vite.config.ts`,
`Dockerfile`, and the `Makefile`.

This migration needs to preserve three things at once:

- OpenSpec becomes the canonical behavior source for the frontend repo.
- `docs/` remains useful as a compatibility layer for humans and existing repo
  references.
- `AGENTS.md` becomes lighter-weight so frontend work does not always preload
  broad planning docs that are only sometimes relevant.

## Goals / Non-Goals

**Goals:**

- Capture the current frontend baseline as capability-sized OpenSpec specs.
- Add compatibility docs that summarize the canonical specs without duplicating
  them.
- Reclassify shared planning docs and shared skills in `AGENTS.md` so frontend
  sessions load only the minimum required default context.
- End the change with canonical specs under `openspec/specs/` and an archived
  OpenSpec change.

**Non-Goals:**

- Changing frontend runtime behavior, adding product features, or implementing
  the full Clerk and generated-client integration planned for later Phase 2
  work.
- Rewriting cross-repo planning files in `platform-blueprint-specs`.
- Replacing repo-local docs with long prose that duplicates the specs.

## Decisions

### Decision: Model the frontend baseline as three small capabilities

The migration uses:

- `frontend-runtime`
- `frontend-local-stack`
- `frontend-container-runtime`

This keeps the canonical contract close to the repo's actual ownership
boundaries: application runtime, local developer workflow, and container image
behavior.

Alternative considered:

- One umbrella `frontend-docs` capability. Rejected because it would mix runtime,
  local-stack, and container concerns into one harder-to-maintain spec.

### Decision: Convert repo behavior into normative requirements, not README copies

The specs restate the current repo behavior as SHALL-based requirements with
scenarios derived from the current code and repo entrypoints. Compatibility docs
keep the quick reader summary, but the canonical contract moves into
`openspec/specs/`.

Alternative considered:

- Copy README sections into docs and point OpenSpec at them. Rejected because it
  would preserve prose without creating a clean requirement surface for future
  changes.

### Decision: Create compatibility docs even though `docs/` was nearly empty

The repo still advertises `docs/` as the place for frontend-specific
documentation, and `AGENTS.md` points there for runtime/build behavior. Adding
small compatibility docs keeps that entrypoint useful while making OpenSpec the
real source of truth.

Alternative considered:

- Leave `docs/` empty and rely only on OpenSpec paths. Rejected because it would
  leave repo-local guidance awkward for readers following existing `docs/`
  references.

### Decision: Move broad guidance out of `Always Load`

`README.md`, `Makefile`, and `../platform-blueprint-specs/common/AGENTS.md`
stay permanently loaded. Phase docs, implementation-plan files, standards, and
shared workflows move to conditional sections or explicit shared skills.

Alternative considered:

- Keep the previous broad `Always Load` list. Rejected because it over-loads
  context for common frontend tasks and duplicates what the shared skills already
  encode operationally.

### Decision: Archive the completed change so canonical specs exist immediately

The migration is only complete once the delta specs are synced into
`openspec/specs/`. After validation, the change will be archived so the repo
ends in a canonical OpenSpec state instead of an active transitional change.

Alternative considered:

- Stop after authoring an active change. Rejected because it would leave the
  repo half-migrated.

## Risks / Trade-offs

- Missing useful repo detail while translating from README and config files ->
  compatibility docs retain the quick-reference material and point back to the
  specs.
- Future frontend work could accidentally spec unimplemented Phase 2 behavior ->
  the config rules and spec scope intentionally avoid documenting future
  generated-client or Clerk flow details that are not in this repo yet.
- `AGENTS.md` could become too sparse if shared references are removed
  aggressively -> conditional loads keep the phase docs, standards, and
  platform-contracts docs available when the task actually depends on them.

## Migration Plan

1. Add the repo-specific OpenSpec config and author the proposal, design, tasks,
   and three capability delta specs.
2. Add compatibility docs under `docs/` and update `README.md` plus `AGENTS.md`
   so the canonical-versus-compatibility split is explicit.
3. Validate the change, archive it into `openspec/changes/archive/`, and verify
   the synced specs under `openspec/specs/`.

## Open Questions

- None.
