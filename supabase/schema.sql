-- VAPS diagnosis analytics schema
-- Run this in Supabase SQL Editor.
-- This schema is designed for public static hosting:
-- anon users can INSERT, but cannot SELECT saved responses.

create extension if not exists pgcrypto;

create table if not exists public.diagnosis_responses (
  id uuid primary key default gen_random_uuid(),
  response_id text not null unique,
  source text not null check (source in ('beta', 'official')),
  consent_version text,
  submitted_at timestamptz not null default now(),
  type_code text not null,
  type_name text not null,
  group_code text not null,
  group_name text not null,
  state text not null,
  value_type_code text not null,
  value_type_name text not null,
  identity_match text not null,
  axis_scores jsonb not null,
  axis_ranking text[] not null,
  simple_profile jsonb not null default '{}'::jsonb,
  simple_answers jsonb not null default '{}'::jsonb,
  detail_answers jsonb not null default '{}'::jsonb,
  survey jsonb not null default '{}'::jsonb
);

create table if not exists public.result_feedback (
  id uuid primary key default gen_random_uuid(),
  response_id text not null,
  source text not null check (source in ('beta', 'official')),
  consent_version text,
  submitted_at timestamptz not null default now(),
  type_code text not null,
  rating integer not null check (rating between 1 and 5)
);

create index if not exists diagnosis_responses_submitted_at_idx on public.diagnosis_responses (submitted_at desc);
create index if not exists diagnosis_responses_source_idx on public.diagnosis_responses (source);
create index if not exists diagnosis_responses_type_code_idx on public.diagnosis_responses (type_code);
create index if not exists diagnosis_responses_group_code_idx on public.diagnosis_responses (group_code);
create index if not exists diagnosis_responses_state_idx on public.diagnosis_responses (state);
create index if not exists diagnosis_responses_identity_match_idx on public.diagnosis_responses (identity_match);
create index if not exists diagnosis_responses_detail_answers_gin_idx on public.diagnosis_responses using gin (detail_answers);
create index if not exists result_feedback_response_id_idx on public.result_feedback (response_id);
create index if not exists result_feedback_submitted_at_idx on public.result_feedback (submitted_at desc);
create index if not exists result_feedback_source_idx on public.result_feedback (source);

alter table public.diagnosis_responses enable row level security;
alter table public.result_feedback enable row level security;

grant insert on public.diagnosis_responses to anon;
grant insert on public.result_feedback to anon;

drop policy if exists "Anon can insert diagnosis responses" on public.diagnosis_responses;
create policy "Anon can insert diagnosis responses"
  on public.diagnosis_responses
  for insert
  to anon
  with check (true);

drop policy if exists "Anon can insert result feedback" on public.result_feedback;
create policy "Anon can insert result feedback"
  on public.result_feedback
  for insert
  to anon
  with check (true);
