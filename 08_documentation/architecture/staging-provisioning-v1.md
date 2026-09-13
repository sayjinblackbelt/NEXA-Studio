# NEXA Studio — Staging Provisioning v1

**Status:** BLOCKED ON EXTERNAL CONNECTION — Phase 4.2

## Objective

Provision an isolated staging PostgreSQL environment and execute `schema-v1.sql` before any production integration or migration.

## Preferred provider

Supabase is the preferred candidate because the Phase 3 architecture already anticipates PostgreSQL, authentication, storage and row-level security.

## Required staging sequence

1. Create a dedicated staging project/database.
2. Obtain the staging connection details through the provider's secure integration.
3. Apply `08_documentation/architecture/schema-v1.sql`.
4. Confirm all expected tables, enums, indexes and constraints exist.
5. Run integrity probes:
   - create client;
   - create project referencing that client;
   - reject project with nonexistent client;
   - verify proposal/briefing/QA version uniqueness;
   - verify client-scoped relationships;
   - verify audit event is append-only at service level.
6. Record the resulting schema/database version.

## Security rules

- Never commit database URLs, passwords, service-role keys or JWT secrets.
- Staging data must remain separate from production.
- Service-role credentials must never be exposed to the browser.
- Do not import real client data during this gate.

## Current result

The repository contains the backend execution baseline, but this gate cannot honestly be marked PASS until a real PostgreSQL/Supabase staging connection is available and the schema is executed against it.
