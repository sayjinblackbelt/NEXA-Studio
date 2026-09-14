# NEXA Studio — Backend

Phase 4 execution baseline for the future production API.

## Current status

**STAGING DATABASE READY — PostgreSQL adapter implemented; authentication/RLS and hosted API deployment are still pending.**

The runtime supports two modes:

- `MemoryRepository` when `DATABASE_URL` is absent (local fallback/rollback);
- `PostgresRepository` when `DATABASE_URL` is configured (staging persistence).

The PostgreSQL schema v1 has been applied to the NEXA-Studio Supabase Free project. No production credentials are committed to the repository.

## Run

```bash
npm install
node backend/server.js
```

For PostgreSQL/Supabase staging, configure `DATABASE_URL` and `CORS_ORIGIN` from environment variables. See `backend/.env.example`.

Health check:

```text
GET /health
```

The response reports the active persistence mode (`memory` or `postgres`).

## Current gates

1. PostgreSQL/Supabase staging schema — complete;
2. repository/service persistence adapter — complete;
3. authenticated API deployment — pending;
4. authentication and RLS — pending;
5. integration-test authorization and persistence — pending;
6. controlled migration of Lab data — pending.
