# frontend-local-stack Specification

## Purpose

TBD - created by archiving change migrate-docs-to-openspec-specs. Update Purpose after archive.

## Requirements

### Requirement: Support stack entrypoints delegate to platform-infra

The repository SHALL expose `make support-up`, `make support-down`,
`make support-logs`, and `make support-ps`, and those targets MUST delegate to
the sibling `../platform-infra` make entrypoints instead of defining a local
compose stack inside `frontend-web`.

#### Scenario: Frontend support commands use the shared infra repo

- **WHEN** a developer runs one of the frontend support targets from this repo
- **THEN** the command delegates to the corresponding `platform-infra` local
  stack target

#### Scenario: Frontend support-up can request a rebuild

- **WHEN** a developer runs `make support-up BUILD=1` from this repo
- **THEN** the delegated `platform-infra` target forces a Docker image rebuild
  before starting the support stack

### Requirement: Frontend-focused local mode keeps the frontend native

Frontend-focused local development SHALL run the frontend natively on
`http://localhost:3000` while the shared support stack provides `backend-api` at
`http://localhost:8080` and PostgreSQL on `localhost:5432`.

#### Scenario: Frontend-focused mode keeps service endpoints stable

- **WHEN** a developer follows the repo-local frontend development flow
- **THEN** the frontend runs from this repository and the support services use
  the documented local API and PostgreSQL endpoints

### Requirement: Repo guidance preserves the hybrid local workflow

Repo-local guidance SHALL preserve the hybrid local model in which
frontend-focused work starts support services from this repository, while
API-focused mode is orchestrated from `backend-api` and provides the containerized
frontend on `http://localhost:3000`.

#### Scenario: Repo guidance still points developers to the two local modes

- **WHEN** a reader consults repo-local documentation for local development
- **THEN** the documentation describes both the frontend-focused mode owned by
  this repo and the API-focused mode orchestrated from `backend-api`
