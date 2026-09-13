# NEXA Studio — Persistence & Migration v1

## Status

`PROPOSED — Phase 3.8–3.9`

## Persistence decision

**PostgreSQL** is the canonical database model. **Supabase** is the preferred first implementation candidate because it can provide managed PostgreSQL, authentication, storage and row-level security in one platform.

The application should still treat the database schema and service layer as the architecture, so the domain is not irreversibly coupled to a vendor.

## Environment separation

- Development: isolated project/database.
- Staging: production-like test environment.
- Production: real client data.

No real client data should be introduced into the current GitHub Pages/localStorage MVP.

## Migration strategy

Migration must be explicit and one-way per release:

```text
localStorage v1
      ↓ validate
normalized export
      ↓ transform
canonical entities
      ↓ seed/import
PostgreSQL
      ↓ verify
production records
```

### Current mapping

- `clients[]` → `clients`
- `projects[].client` → `projects.client_id`
- `projects[].stage` → `projects.stage`
- `projects[].status` → `projects.status`
- `projects[].type` → `projects.type`
- `portfolio[]` → `portfolio_cases`
- `qa[projectId]` → `qa_results.criteria`
- `nexa-notes[]` → `notes`

### Migration rules

1. Generate new UUIDs for canonical entities.
2. Maintain an old-ID → new-ID mapping during migration.
3. Reject projects referencing nonexistent clients.
4. Recalculate all derived counts.
5. Convert legacy stage/status values to canonical enums.
6. Treat demo data as seed data, not production client data.
7. Validate counts and relationships before marking migration successful.
8. Keep the exported source immutable as a migration artifact.

## Rollback

The first production migration should be reversible at the application-release level. Do not delete the source export after migration. Database rollback should use backups/snapshots rather than ad-hoc destructive SQL.

## Persistence acceptance criteria

- CRUD survives page refresh and independent sessions.
- Two authenticated users can see the same persisted project state according to permissions.
- Client isolation is enforced.
- Project/client relationships remain valid.
- Proposal versions remain intact.
- QA history remains intact.
- Assets remain addressable in storage.
- Audit events survive application restart.

## Important boundary

Until a backend is actually provisioned and connected, the NEXA Lab remains a local prototype. This document does not claim that GitHub Pages now has server persistence.
