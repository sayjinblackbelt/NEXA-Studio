# NEXA Studio — Staging API v1

## Purpose

Document the staging boundary between the GitHub Pages Lab, the Node.js API and PostgreSQL/Supabase.

## Current state

- **Frontend:** GitHub Pages prototype.
- **API:** Node.js service under `backend/`.
- **Local fallback:** MemoryRepository remains available when `DATABASE_URL` is absent.
- **Persistent adapter:** PostgreSQL repository is implemented and wired when `DATABASE_URL` is present.
- **Database:** NEXA-Studio Supabase project exists on the Free plan; canonical schema v1 has been applied and validated.
- **Authentication:** designed, not yet implemented.
- **Secrets:** environment variables only; never commit credentials.

## Runtime variables

```text
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
CORS_ORIGIN=https://sayjinblackbelt.github.io
DATABASE_URL=<secret>
DATABASE_SSL=true
DATABASE_POOL_MAX=5
DATABASE_IDLE_TIMEOUT_MS=10000
DATABASE_CONNECTION_TIMEOUT_MS=5000
```

`DATABASE_URL` must be entered only in the hosting provider's secret/environment configuration. `CORS_ORIGIN` must remain restricted to approved browser origins.

## Health gate

```text
GET /health
```

Current local API response identifies `phase: 4.10.3-A` and reports the active persistence mode (`memory` or `postgres`).

## 4.10.1 — PostgreSQL repository

**PASS** — asynchronous PostgreSQL repository implemented for clients and projects, including UUID validation and database conflict/foreign-key mapping.

## 4.10.2 — API → PostgreSQL wiring

**PASS** — `DATABASE_URL` selects the PostgreSQL data layer; absence of the variable preserves the memory fallback. No database credentials are committed.

## 4.10.3-A — Hosting preparation

**IN VALIDATION** — server binds to `0.0.0.0`, supports external hosting, CORS remains configurable, and health output identifies the preparation stage.

## Acceptance criteria before 4.10.3-B

- CI green after the hosting-preparation change.
- Node syntax/tests green.
- No secrets committed.
- Render Free remains the planned hosting option with target cost US$0.

## Next stages

### 4.10.3-B — Render Free deployment

Create the Web Service from `sayjinblackbelt/NEXA-Studio`, configure Node 20, `npm install`, `node backend/server.js`, health check `/health`, and the environment variables above.

### 4.10.3-C — Render → Supabase

Set `DATABASE_URL` as a Render secret and verify that the public API actually uses PostgreSQL rather than the memory fallback.

### 4.10.3-D — Lab → public API

Configure the Lab API base URL to the Render service and validate CORS, client/project creation and workflow transitions from GitHub Pages.

### 4.10.4 — persistence/integration validation

Restart the service and confirm records remain available. Validate the complete path: Lab → API → PostgreSQL → API → Lab.

### 4.11 — authentication and RLS

Only after persistence and public API integration are proven: implement Supabase Auth, roles, client isolation, RLS and authenticated API access.

## Cost rule

The NEXA deployment remains constrained to **US$0** until explicit approval is given for any paid resource. Do not upgrade Supabase or Render and do not add payment information as part of this roadmap.
