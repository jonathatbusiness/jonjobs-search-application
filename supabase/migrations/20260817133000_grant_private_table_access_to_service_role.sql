grant usage on schema public to service_role;

grant select, insert, update, delete on table job_sources to service_role;
grant select, insert, update, delete on table jobs to service_role;
grant select, insert, update, delete on table applications to service_role;
grant select, insert, update, delete on table search_profiles to service_role;
grant select, insert, update, delete on table search_runs to service_role;
grant select, insert, update, delete on table automation_settings to service_role;

grant usage, select on all sequences in schema public to service_role;

revoke all on table job_sources from anon, authenticated;
revoke all on table jobs from anon, authenticated;
revoke all on table applications from anon, authenticated;
revoke all on table search_profiles from anon, authenticated;
revoke all on table search_runs from anon, authenticated;
revoke all on table automation_settings from anon, authenticated;
