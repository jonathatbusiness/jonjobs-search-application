create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists job_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  source_type text not null default 'other' check (source_type in ('job_board', 'career_page', 'public_index', 'other')),
  base_url text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references job_sources(id) on delete set null,
  source text,
  source_job_id text,
  source_url text,
  direct_application_url text,
  application_url text,
  canonical_key text unique,
  title text not null,
  company text not null,
  location text,
  city text,
  country text,
  workplace_type text default 'Unknown',
  employment_type text default 'Unknown',
  seniority text default 'Unknown',
  salary_min numeric,
  salary_max numeric,
  salary_currency text,
  salary_period text,
  description text,
  requirements text[] not null default '{}',
  skills text[] not null default '{}',
  matched_skills text[] not null default '{}',
  missing_skills text[] not null default '{}',
  keywords text[] not null default '{}',
  match_score integer check (match_score is null or (match_score >= 0 and match_score <= 100)),
  status text not null default 'new' check (status in ('new', 'viewed', 'discarded')),
  is_favorite boolean not null default false,
  published_at timestamptz,
  discovered_at timestamptz not null default now(),
  source_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  status text not null default 'applied' check (status in ('applied', 'screening', 'interview', 'case', 'offer', 'rejected', 'withdrawn')),
  applied_at timestamptz not null default now(),
  next_action text,
  due_at timestamptz,
  recruiter_name text,
  recruiter_contact text,
  resume_version text,
  notes text,
  result text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id)
);

create table if not exists search_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  primary_title text,
  title_variants text[] not null default '{}',
  include_keywords text[] not null default '{}',
  exclude_keywords text[] not null default '{}',
  keyword_mode text not null default 'ALL' check (keyword_mode in ('ALL', 'ANY')),
  location text,
  workplace_types text[] not null default '{}',
  countries text[] not null default '{}',
  sources text[] not null default '{}',
  query text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists search_runs (
  id uuid primary key default gen_random_uuid(),
  search_profile_id uuid references search_profiles(id) on delete set null,
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed', 'skipped')),
  started_at timestamptz,
  completed_at timestamptz,
  jobs_found integer not null default 0,
  jobs_inserted integer not null default 0,
  jobs_updated integer not null default 0,
  error_message text,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists automation_settings (
  id uuid primary key default gen_random_uuid(),
  enabled boolean not null default false,
  schedule text not null default '0 10 * * *',
  last_run_at timestamptz,
  last_status text,
  next_run_hint text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_job_sources_updated_at on job_sources;
create trigger set_job_sources_updated_at
before update on job_sources
for each row execute function set_updated_at();

drop trigger if exists set_jobs_updated_at on jobs;
create trigger set_jobs_updated_at
before update on jobs
for each row execute function set_updated_at();

drop trigger if exists set_applications_updated_at on applications;
create trigger set_applications_updated_at
before update on applications
for each row execute function set_updated_at();

drop trigger if exists set_search_profiles_updated_at on search_profiles;
create trigger set_search_profiles_updated_at
before update on search_profiles
for each row execute function set_updated_at();

drop trigger if exists set_automation_settings_updated_at on automation_settings;
create trigger set_automation_settings_updated_at
before update on automation_settings
for each row execute function set_updated_at();

create index if not exists idx_jobs_discovered_at on jobs(discovered_at desc);
create index if not exists idx_jobs_published_at on jobs(published_at desc);
create index if not exists idx_jobs_status on jobs(status);
create index if not exists idx_jobs_favorite on jobs(is_favorite);
create index if not exists idx_jobs_match_score on jobs(match_score desc);
create index if not exists idx_jobs_country on jobs(country);
create index if not exists idx_jobs_source on jobs(source);
create index if not exists idx_jobs_canonical_key on jobs(canonical_key);
create index if not exists idx_jobs_search_text on jobs using gin (
  to_tsvector(
    'english',
    coalesce(title, '') || ' ' ||
    coalesce(company, '') || ' ' ||
    coalesce(location, '') || ' ' ||
    coalesce(description, '')
  )
);
create index if not exists idx_applications_status on applications(status);
create index if not exists idx_applications_applied_at on applications(applied_at desc);
create index if not exists idx_search_profiles_enabled on search_profiles(enabled);
create index if not exists idx_search_runs_created_at on search_runs(created_at desc);

alter table job_sources enable row level security;
alter table jobs enable row level security;
alter table applications enable row level security;
alter table search_profiles enable row level security;
alter table search_runs enable row level security;
alter table automation_settings enable row level security;

drop policy if exists "deny public job_sources access" on job_sources;
create policy "deny public job_sources access" on job_sources for all to anon, authenticated using (false) with check (false);

drop policy if exists "deny public jobs access" on jobs;
create policy "deny public jobs access" on jobs for all to anon, authenticated using (false) with check (false);

drop policy if exists "deny public applications access" on applications;
create policy "deny public applications access" on applications for all to anon, authenticated using (false) with check (false);

drop policy if exists "deny public search_profiles access" on search_profiles;
create policy "deny public search_profiles access" on search_profiles for all to anon, authenticated using (false) with check (false);

drop policy if exists "deny public search_runs access" on search_runs;
create policy "deny public search_runs access" on search_runs for all to anon, authenticated using (false) with check (false);

drop policy if exists "deny public automation_settings access" on automation_settings;
create policy "deny public automation_settings access" on automation_settings for all to anon, authenticated using (false) with check (false);

insert into job_sources (name, source_type, base_url)
values
  ('LinkedIn', 'job_board', 'https://www.linkedin.com/jobs'),
  ('Indeed', 'job_board', 'https://www.indeed.com'),
  ('Public Index', 'public_index', null),
  ('Company', 'career_page', null),
  ('Other', 'other', null)
on conflict (name) do nothing;

insert into automation_settings (enabled, next_run_hint)
select false, 'Managed by Vercel Cron'
where not exists (select 1 from automation_settings);
