-- NEXA Studio — PostgreSQL/Supabase-ready schema v1
-- Phase 3.5 / 3.8. Review before applying to production.

create extension if not exists pgcrypto;

do $$ begin create type client_status as enum ('LEAD','ACTIVE','RECURRENT','ARCHIVED'); exception when duplicate_object then null; end $$;
do $$ begin create type project_stage as enum ('BRIEFING','DIAGNOSIS','PROPOSAL','PRODUCTION','QA','DELIVERY','COMPLETED'); exception when duplicate_object then null; end $$;
do $$ begin create type project_health as enum ('ON_TRACK','ATTENTION','BLOCKED','ARCHIVED'); exception when duplicate_object then null; end $$;
do $$ begin create type project_status as enum ('ACTIVE','DONE','ARCHIVED'); exception when duplicate_object then null; end $$;
do $$ begin create type user_role as enum ('OWNER','ADMIN','EDITOR','VIEWER','CLIENT'); exception when duplicate_object then null; end $$;
do $$ begin create type user_status as enum ('ACTIVE','INVITED','SUSPENDED','ARCHIVED'); exception when duplicate_object then null; end $$;
do $$ begin create type proposal_status as enum ('DRAFT','SENT','APPROVED','REJECTED','EXPIRED'); exception when duplicate_object then null; end $$;
do $$ begin create type task_status as enum ('TODO','IN_PROGRESS','REVIEW','BLOCKED','DONE'); exception when duplicate_object then null; end $$;
do $$ begin create type task_priority as enum ('LOW','MEDIUM','HIGH','CRITICAL'); exception when duplicate_object then null; end $$;
do $$ begin create type qa_status as enum ('PENDING','PASSED','FAILED'); exception when duplicate_object then null; end $$;
do $$ begin create type publication_status as enum ('DRAFT','REVIEW','PUBLISHED','ARCHIVED'); exception when duplicate_object then null; end $$;

create table if not exists clients (
  id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 2 and 160),
  status client_status not null default 'LEAD', notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(), client_id uuid not null references clients(id), name text not null,
  email text, phone text, role text, is_primary boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index if not exists one_primary_contact_per_client on contacts(client_id) where is_primary;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(), client_id uuid not null references clients(id), name text not null check (char_length(name) between 2 and 160),
  type text not null, stage project_stage not null default 'BRIEFING', health project_health not null default 'ON_TRACK', status project_status not null default 'ACTIVE',
  owner_user_id uuid, start_date date, due_date date, summary text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (due_date is null or start_date is null or due_date >= start_date)
);
create table if not exists users (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null unique, role user_role not null, client_id uuid references clients(id),
  status user_status not null default 'INVITED', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (role <> 'CLIENT' or client_id is not null)
);
alter table projects add constraint projects_owner_fk foreign key (owner_user_id) references users(id);

create table if not exists briefings (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references projects(id) on delete restrict, version integer not null check(version > 0),
  context text not null, problem text not null, objective text not null, audience text not null, message text, references_text text, constraints_text text,
  deliverables text not null, deadline date, success_criteria text, status text not null default 'DRAFT', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(project_id, version)
);
create table if not exists diagnoses (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references projects(id), context text not null, problem text not null, cause text,
  opportunity text not null, strategic_direction text not null, solution_hypothesis text not null, next_steps text not null, status text not null default 'DRAFT',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists proposals (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references projects(id), version integer not null check(version > 0), objective text not null,
  solution text not null, scope text not null, deliverables text not null, schedule text not null, assumptions text, investment_minor bigint not null check(investment_minor >= 0),
  currency char(3) not null default 'BRL', valid_until date, status proposal_status not null default 'DRAFT', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(project_id, version)
);
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references projects(id), title text not null, description text,
  assignee_user_id uuid references users(id), status task_status not null default 'TODO', priority task_priority not null default 'MEDIUM', due_date date,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists milestones (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references projects(id), name text not null, due_date date,
  status text not null default 'PLANNED', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists deliverables (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references projects(id), name text not null, description text,
  status text not null default 'DRAFT', approved_at timestamptz, delivered_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists qa_results (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references projects(id), version integer not null check(version > 0),
  criteria jsonb not null default '{}'::jsonb, overall_status qa_status not null default 'PENDING', notes text, reviewed_by uuid references users(id), reviewed_at timestamptz,
  created_at timestamptz not null default now(), unique(project_id, version)
);
create table if not exists portfolio_cases (
  id uuid primary key default gen_random_uuid(), project_id uuid references projects(id), slug text not null unique, name text not null, type text not null,
  summary text not null, featured boolean not null default false, publication_status publication_status not null default 'DRAFT', published_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists assets (
  id uuid primary key default gen_random_uuid(), project_id uuid references projects(id), deliverable_id uuid references deliverables(id), portfolio_case_id uuid references portfolio_cases(id),
  name text not null, storage_key text not null, mime_type text not null, size_bytes bigint not null check(size_bytes >= 0), status text not null default 'DRAFT',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check(project_id is not null or deliverable_id is not null or portfolio_case_id is not null)
);
create table if not exists decisions (
  id uuid primary key default gen_random_uuid(), project_id uuid references projects(id), title text not null, decision text not null, rationale text not null,
  decided_by uuid not null references users(id), decided_at timestamptz not null default now(), created_at timestamptz not null default now()
);
create table if not exists notes (
  id uuid primary key default gen_random_uuid(), project_id uuid references projects(id), client_id uuid references clients(id), title text not null, body text not null,
  visibility text not null default 'INTERNAL', created_by uuid not null references users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check(project_id is not null or client_id is not null)
);
create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(), actor_user_id uuid not null references users(id), action text not null, entity_type text not null,
  entity_id uuid not null, before_data jsonb, after_data jsonb, created_at timestamptz not null default now()
);

create index if not exists projects_client_idx on projects(client_id);
create index if not exists projects_stage_idx on projects(stage);
create index if not exists tasks_project_idx on tasks(project_id);
create index if not exists assets_project_idx on assets(project_id);
create index if not exists audit_entity_idx on audit_events(entity_type, entity_id, created_at desc);
