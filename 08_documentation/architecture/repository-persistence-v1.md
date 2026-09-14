# NEXA Studio — Persistence Repository v1

## Phase

4.10.1 — PostgreSQL repository boundary.

## Objective

Introduce a PostgreSQL-backed repository contract without forcing the API to use the database before integration tests, credentials and rollback are ready.

## Repositories

- `MemoryRepository`: current default/fallback for local prototype execution.
- `PostgresRepository`: persistence adapter for `clients` and `projects` using an injected PostgreSQL pool.

## Safety boundary

The server does not automatically switch to PostgreSQL in this phase. No database credentials are committed. Production persistence will be enabled only after a dedicated integration stage.

## Identifier rule

PostgreSQL/Supabase v1 uses UUID primary keys. The persistent adapter therefore rejects non-UUID identifiers instead of silently transforming IDs and breaking relations.

## Rollback

Rollback remains simple: keep `MemoryRepository` as the active adapter until the API integration stage passes. The repository boundary allows the service layer to remain independent of the persistence implementation.

## Next gate

4.10.2 — connect the API service to the PostgreSQL adapter using environment-based credentials, then run real staging persistence tests. Authentication and RLS remain separate gates.
