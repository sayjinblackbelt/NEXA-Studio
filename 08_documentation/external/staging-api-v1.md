# NEXA Studio — Staging API v1

## Purpose

Define the first deployable staging contract between the GitHub Pages Lab and the NEXA API without creating a production database or Supabase project yet.

## Environment

- **Frontend:** GitHub Pages prototype.
- **API:** Node.js service under `backend/`.
- **Persistence:** MemoryRepository for this gate only.
- **Database:** deferred to the next persistence gate.
- **Authentication:** deferred until persistence and environment are ready.
- **Secrets:** environment variables only; never commit credentials.

## Required staging variables

```text
PORT=3000
CORS_ORIGIN=https://<github-pages-host>
```

`CORS_ORIGIN` may contain a comma-separated allowlist when multiple controlled origins are required. It must not be set to `*` for a real authenticated environment.

## Browser boundary

The Lab may call the API from another origin only when that origin is explicitly allowed by `CORS_ORIGIN`. The API supports the required preflight methods and headers for the current Client/Project integration.

## Health gate

```text
GET /health
```

Expected staging response includes:

```json
{"status":"ok","service":"nexa-api","phase":"4.9"}
```

## Current limitations

1. Data is not persistent; restarting the process clears clients and projects.
2. Authentication and authorization are not enabled yet.
3. Supabase/PostgreSQL has not been provisioned.
4. GitHub Pages cannot use `localhost` as its deployed API; a real staging URL is required before browser-to-API validation.

## Gate 4.9 acceptance criteria

- API has an explicit staging configuration contract.
- CORS is deny-by-default unless an origin is configured.
- OPTIONS preflight is supported for `/api/v1/*`.
- Existing API validation and domain tests remain green.
- No database or production credentials are introduced.

## Next gate

**4.10 — persistence staging:** provision a staging PostgreSQL/Supabase environment only after confirming the target organization and cost implications, then execute the canonical schema and replace the memory repository behind the existing service boundary.
