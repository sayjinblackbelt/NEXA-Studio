# NEXA Studio — Authentication & Authorization v1

## Status

`PROPOSED — Phase 3.7`

## Authentication

Use a managed identity provider compatible with the selected backend. Passwords and authentication secrets must not be stored in the NEXA application database.

For the first production architecture, Supabase Auth is the preferred candidate because it can pair authentication, PostgreSQL persistence, row-level security and storage without requiring a separate custom identity service. This is a technology choice for implementation, not a requirement to expose the database directly to untrusted clients.

## Authorization

Roles:

- OWNER
- ADMIN
- EDITOR
- VIEWER
- CLIENT

Authorization must be enforced by backend/service rules and database policies where appropriate.

### Client isolation

For a user with role `CLIENT`, effective scope is:

```text
user.clientId == resource.clientId
```

For Project descendants, scope is inherited through the project's client relationship.

### Internal roles

- OWNER: unrestricted studio administration.
- ADMIN: operational administration.
- EDITOR: operational create/read/update permissions within assigned studio scope.
- VIEWER: read-only access to permitted studio data.

## Security boundaries

```text
Browser
  ↓ authentication token
Application/API
  ↓ validate identity + role + resource scope
Domain rules
  ↓
Database / Storage
```

Never trust:

- hidden UI controls;
- localStorage role values;
- clientId supplied by the browser;
- frontend-only validation.

## Session and secrets

- Tokens handled by the authentication provider.
- No service-role or database admin key in browser code.
- Environment secrets stay server-side.
- Production logs must not contain passwords, access tokens or unnecessary personal data.

## Storage

Assets should use private storage by default. Public access requires an explicit publication state or signed/controlled delivery mechanism.

## Audit

Role changes, access-sensitive changes, approvals, publication and administrative operations generate AuditEvent records.

## Acceptance criteria

1. A client user can see only its own client scope.
2. Changing a URL/ID cannot bypass scope.
3. An editor cannot administer users unless explicitly granted admin privileges.
4. No secret backend key is shipped to the frontend.
5. Published portfolio content is separated from private project data.
