# NEXA Studio — Data Contract v1

## Status

`DRAFT — Phase 3.4`

This contract defines the minimum canonical data model for the first persistent version of NEXA Studio. Field names use camelCase. IDs are opaque strings and must not encode business meaning.

## Conventions

| Type | Convention |
|---|---|
| ID | string, unique, immutable |
| Date/time | ISO 8601 UTC |
| Money | integer minor units + currency, never floating point |
| Boolean | true / false |
| Enum | controlled values documented below |
| Relation | stores the target entity ID |
| Optional | nullable unless a rule says otherwise |

## 1. Client

Represents a company, organization, professional or other contracting party.

| Field | Type | Required | Rule |
|---|---|---:|---|
| id | string | yes | immutable |
| name | string | yes | 2–160 chars |
| status | enum | yes | LEAD, ACTIVE, RECURRENT, ARCHIVED |
| notes | text | no | internal; no secrets |
| createdAt | datetime | yes | system generated |
| updatedAt | datetime | yes | system generated |
| createdBy | UserId | yes | system generated |
| updatedBy | UserId | yes | system generated |

## 2. Contact

A person associated with a client.

| Field | Type | Required | Rule |
|---|---|---:|---|
| id | string | yes | immutable |
| clientId | ClientId | yes | existing Client |
| name | string | yes | 2–160 chars |
| email | string | no | validated when present |
| phone | string | no | normalized when possible |
| role | string | no | e.g. owner, marketing, approval |
| isPrimary | boolean | yes | at most one primary contact per client |
| createdAt | datetime | yes | system generated |
| updatedAt | datetime | yes | system generated |

## 3. Project

Central unit of studio work.

| Field | Type | Required | Rule |
|---|---|---:|---|
| id | string | yes | immutable |
| clientId | ClientId | yes | existing Client |
| name | string | yes | 2–160 chars |
| type | string | yes | service/project category |
| stage | enum | yes | BRIEFING, DIAGNOSIS, PROPOSAL, PRODUCTION, QA, DELIVERY, COMPLETED |
| health | enum | yes | ON_TRACK, ATTENTION, BLOCKED, ARCHIVED |
| status | enum | yes | ACTIVE, DONE, ARCHIVED |
| ownerUserId | UserId | no | responsible user |
| startDate | date | no | cannot be after dueDate |
| dueDate | date | no | project target date |
| summary | text | no | concise operational summary |
| createdAt | datetime | yes | system generated |
| updatedAt | datetime | yes | system generated |
| createdBy | UserId | yes | system generated |
| updatedBy | UserId | yes | system generated |

`clientId` is the canonical relationship. Do not persist a `projects` count on Client.

## 4. Briefing

Structured discovery record for a project.

| Field | Type | Required | Rule |
|---|---|---:|---|
| id | string | yes | immutable |
| projectId | ProjectId | yes | one active briefing per project; revisions may be versioned |
| version | integer | yes | starts at 1 |
| context | text | yes | minimum project context |
| problem | text | yes | communication/problem statement |
| objective | text | yes | desired outcome |
| audience | text | yes | intended audience |
| message | text | no | core message |
| references | text | no | references/links |
| constraints | text | no | scope/technical/brand constraints |
| deliverables | text | yes | expected outputs |
| deadline | date | no | requested deadline |
| successCriteria | text | no | measurable/observable criteria |
| status | enum | yes | DRAFT, READY, APPROVED, ARCHIVED |
| createdAt | datetime | yes | system generated |
| updatedAt | datetime | yes | system generated |
| createdBy | UserId | yes | system generated |
| updatedBy | UserId | yes | system generated |

## 5. Diagnosis

Strategic interpretation of the project problem.

| Field | Type | Required |
|---|---|---:|
| id | string | yes |
| projectId | ProjectId | yes |
| context | text | yes |
| problem | text | yes |
| cause | text | no |
| opportunity | text | yes |
| strategicDirection | text | yes |
| solutionHypothesis | text | yes |
| nextSteps | text | yes |
| status | enum | yes: DRAFT, APPROVED, ARCHIVED |
| createdAt | datetime | yes |
| updatedAt | datetime | yes |
| createdBy | UserId | yes |
| updatedBy | UserId | yes |

## 6. Proposal

Commercial proposal with immutable historical versions.

| Field | Type | Required |
|---|---|---:|
| id | string | yes |
| projectId | ProjectId | yes |
| version | integer | yes |
| objective | text | yes |
| solution | text | yes |
| scope | text | yes |
| deliverables | text | yes |
| schedule | text | yes |
| assumptions | text | no |
| investmentMinor | integer | yes |
| currency | string | yes |
| validUntil | date | no |
| status | enum | yes: DRAFT, SENT, APPROVED, REJECTED, EXPIRED |
| createdAt | datetime | yes |
| updatedAt | datetime | yes |
| createdBy | UserId | yes |
| updatedBy | UserId | yes |

A commercial revision creates a new version; previous approved/sent versions remain readable.

## 7. Task

| Field | Type | Required |
|---|---|---:|
| id | string | yes |
| projectId | ProjectId | yes |
| title | string | yes |
| description | text | no |
| assigneeUserId | UserId | no |
| status | enum | yes: TODO, IN_PROGRESS, REVIEW, BLOCKED, DONE |
| priority | enum | yes: LOW, MEDIUM, HIGH, CRITICAL |
| dueDate | date | no |
| createdAt | datetime | yes |
| updatedAt | datetime | yes |
| createdBy | UserId | yes |
| updatedBy | UserId | yes |

## 8. Milestone

| Field | Type | Required |
|---|---|---:|
| id | string | yes |
| projectId | ProjectId | yes |
| name | string | yes |
| dueDate | date | no |
| status | enum | yes: PLANNED, IN_PROGRESS, DONE, MISSED |
| createdAt | datetime | yes |
| updatedAt | datetime | yes |

## 9. Deliverable

| Field | Type | Required |
|---|---|---:|
| id | string | yes |
| projectId | ProjectId | yes |
| name | string | yes |
| description | text | no |
| status | enum | yes: DRAFT, INTERNAL_REVIEW, APPROVED, DELIVERED |
| approvedAt | datetime | no |
| deliveredAt | datetime | no |
| createdAt | datetime | yes |
| updatedAt | datetime | yes |

## 10. QAResult

QA is a project result, not merely six booleans.

| Field | Type | Required |
|---|---|---:|
| id | string | yes |
| projectId | ProjectId | yes |
| version | integer | yes |
| criteria | JSON/object | yes | keyed controlled criteria |
| overallStatus | enum | yes: PENDING, PASSED, FAILED |
| notes | text | no |
| reviewedBy | UserId | no |
| reviewedAt | datetime | no |
| createdAt | datetime | yes |

Initial criteria keys:

`strategy`, `visual`, `functional`, `technical`, `license`, `delivery`.

## 11. PortfolioCase

Public-facing representation separated from operational project data.

| Field | Type | Required |
|---|---|---:|
| id | string | yes |
| projectId | ProjectId | no | optional link to source project |
| slug | string | yes | unique public identifier |
| name | string | yes |
| type | string | yes |
| summary | text | yes |
| featured | boolean | yes |
| publicationStatus | enum | yes: DRAFT, REVIEW, PUBLISHED, ARCHIVED |
| publishedAt | datetime | no |
| createdAt | datetime | yes |
| updatedAt | datetime | yes |

No private project fields should be exposed by default.

## 12. Asset

| Field | Type | Required |
|---|---|---:|
| id | string | yes |
| projectId | ProjectId | no |
| deliverableId | DeliverableId | no |
| portfolioCaseId | PortfolioCaseId | no |
| name | string | yes |
| storageKey | string | yes | backend storage reference, not public path by default |
| mimeType | string | yes |
| sizeBytes | integer | yes |
| status | enum | yes: DRAFT, APPROVED, ARCHIVED |
| createdAt | datetime | yes |
| updatedAt | datetime | yes |

At least one parent relation is required.

## 13. Decision

| Field | Type | Required |
|---|---|---:|
| id | string | yes |
| projectId | ProjectId | no |
| title | string | yes |
| decision | text | yes |
| rationale | text | yes |
| decidedBy | UserId | yes |
| decidedAt | datetime | yes |
| createdAt | datetime | yes |

## 14. Note

| Field | Type | Required |
|---|---|---:|
| id | string | yes |
| projectId | ProjectId | no |
| clientId | ClientId | no |
| title | string | yes |
| body | text | yes |
| visibility | enum | yes: INTERNAL, CLIENT_SHARED |
| createdBy | UserId | yes |
| createdAt | datetime | yes |
| updatedAt | datetime | yes |

At least one context relation (`projectId`, `clientId`, or future `studioId`) is required.

## 15. User

| Field | Type | Required |
|---|---|---:|
| id | string | yes |
| name | string | yes |
| email | string | yes |
| role | enum | yes: OWNER, ADMIN, EDITOR, VIEWER, CLIENT |
| clientId | ClientId | no | required for CLIENT role |
| status | enum | yes: ACTIVE, INVITED, SUSPENDED, ARCHIVED |
| createdAt | datetime | yes |
| updatedAt | datetime | yes |

Authentication credentials are not stored in this domain object; authentication provider handles them.

## 16. AuditEvent

| Field | Type | Required |
|---|---|---:|
| id | string | yes |
| actorUserId | UserId | yes |
| action | string | yes |
| entityType | string | yes |
| entityId | string | yes |
| before | JSON/object | no |
| after | JSON/object | no |
| createdAt | datetime | yes |

Audit events should be append-only from the application perspective.

## Integrity rules

1. A Project must reference an existing Client.
2. A Contact must reference an existing Client.
3. A CLIENT user must have a clientId.
4. A client-scoped user may access only records belonging to that client.
5. A PortfolioCase is not automatically public because a Project exists.
6. A Project cannot be completed without a passed QA and delivery record, unless an explicit administrative exception is recorded.
7. Proposal versions are immutable after being sent; corrections create a new version.
8. Historical records should be archived instead of physically deleted when they have operational, commercial or audit value.
9. Derived counts are calculated from relations and are never canonical fields.
10. Backend validation is authoritative; frontend validation is supplementary.

## MVP migration mapping

| Current MVP | Canonical v1 |
|---|---|
| `clients[]` | Client |
| `projects[].client` | Project.clientId |
| `projects[].stage` | Project.stage |
| `projects[].status` | Project.status |
| `projects[].type` | Project.type |
| `portfolio[]` | PortfolioCase |
| `qa[projectId]` | QAResult.criteria |
| `nexa-notes` | Note |
| tool templates | templates used to create Briefing/Diagnosis/Proposal/Case records |

The current `localStorage` format remains a prototype format and should not be treated as the canonical database schema.
