# NEXA Studio — Backend

Phase 4 execution baseline for the future production API.

## Current status

**STAGING SKELETON — no database or authentication configured yet.**

This directory establishes a small, dependency-free Node.js runtime boundary so the API layer can be implemented and tested before connecting PostgreSQL/Supabase.

## Scope of this step

- deterministic environment contract;
- HTTP health endpoint;
- explicit separation from the GitHub Pages frontend;
- no secrets committed to the repository;
- no production claims.

## Run

```bash
node backend/server.js
```

The server listens on `PORT` (default `3000`).

Health check:

```text
GET /health
```

Expected response:

```json
{"status":"ok","service":"nexa-api","phase":"4.1"}
```

## Next gates

1. provision staging PostgreSQL/Supabase;
2. execute `08_documentation/architecture/schema-v1.sql` against staging;
3. configure authentication and RLS;
4. implement repository/service boundaries;
5. expose the first authenticated Client → Project API;
6. integration-test authorization and persistence before migration.
