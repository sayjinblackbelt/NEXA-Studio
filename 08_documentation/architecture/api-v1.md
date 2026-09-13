# NEXA Studio — API Contract v1

## Status

`PROPOSED — Phase 3.6`

The API is the authoritative application boundary. The frontend must not contain the only implementation of business rules or permissions.

## Resource conventions

- JSON request/response bodies.
- UUID identifiers.
- ISO 8601 timestamps.
- Pagination for collections.
- `400` invalid input, `401` unauthenticated, `403` unauthorized, `404` missing resource, `409` integrity/conflict, `422` semantic validation failure.

## Core endpoints

### Clients

`GET /api/v1/clients`

`POST /api/v1/clients`

`GET /api/v1/clients/{id}`

`PATCH /api/v1/clients/{id}`

`POST /api/v1/clients/{id}/archive`

### Contacts

`GET /api/v1/clients/{clientId}/contacts`

`POST /api/v1/clients/{clientId}/contacts`

`PATCH /api/v1/contacts/{id}`

### Projects

`GET /api/v1/projects`

`POST /api/v1/projects`

`GET /api/v1/projects/{id}`

`PATCH /api/v1/projects/{id}`

`POST /api/v1/projects/{id}/transition`

`POST /api/v1/projects/{id}/archive`

### Project records

`GET/POST /api/v1/projects/{id}/briefings`

`GET/POST /api/v1/projects/{id}/diagnoses`

`GET/POST /api/v1/projects/{id}/proposals`

`GET/POST /api/v1/projects/{id}/tasks`

`GET/POST /api/v1/projects/{id}/milestones`

`GET/POST /api/v1/projects/{id}/deliverables`

`GET/POST /api/v1/projects/{id}/qa`

`GET/POST /api/v1/projects/{id}/decisions`

`GET/POST /api/v1/projects/{id}/notes`

### Portfolio

`GET /api/v1/portfolio-cases`

`POST /api/v1/portfolio-cases`

`PATCH /api/v1/portfolio-cases/{id}`

`POST /api/v1/portfolio-cases/{id}/publish`

`POST /api/v1/portfolio-cases/{id}/archive`

### Assets

`POST /api/v1/assets`

`GET /api/v1/assets/{id}`

`DELETE /api/v1/assets/{id}` — only where policy allows; otherwise archive.

## Transition command

`POST /api/v1/projects/{id}/transition`

```json
{
  "toStage": "QA",
  "reason": "Design package ready for review"
}
```

The server validates the transition against project state and required records.

## Idempotency

Mutating requests that can be retried by clients should accept an `Idempotency-Key` header. Duplicate requests with the same key must not create duplicate commercial or operational records.

## Security rules

- Authentication is required for all private API routes.
- Authorization is evaluated server-side.
- `CLIENT` access is constrained by `clientId`.
- Never accept a client identifier from the browser as proof of authorization.
- Private fields are omitted from public portfolio endpoints.
- Rate limiting and input validation apply to public-facing endpoints.

## Error shape

```json
{
  "error": {
    "code": "PROJECT_TRANSITION_INVALID",
    "message": "Project cannot move to production before proposal approval.",
    "details": {}
  }
}
```

## Versioning

The initial namespace is `/api/v1`. Breaking changes require a new major API version.
