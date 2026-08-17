import { calculateMatch } from "./match";
import { deduplicateJobs, normalizeJob } from "./normalize";
import { getDiscoveryProviders } from "./providers/index";
import { upsertDiscoveredJobs } from "@/services/jobs";
import { getSupabaseServerClient } from "@/services/supabase/server";

async function createRun(profileId, status = "running") {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("search_runs")
    .insert({ search_profile_id: profileId || null, status, started_at: new Date().toISOString() })
    .select()
    .single();
  return data;
}

async function finishRun(runId, updates) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !runId) return null;
  const { data } = await supabase
    .from("search_runs")
    .update({ ...updates, completed_at: new Date().toISOString() })
    .eq("id", runId)
    .select()
    .single();
  return data;
}

export async function runDiscoveryForProfile(profile) {
  const run = await createRun(profile.id);
  const providerResults = [];

  try {
    const providers = getDiscoveryProviders(profile);
    const rawJobs = [];

    for (const provider of providers) {
      const result = await provider.discover(profile);
      providerResults.push({ provider: provider.name, status: result.status, message: result.message, query: result.query });
      rawJobs.push(...(result.jobs || []).map((job) => ({ ...job, source: provider.source })));
    }

    const normalized = deduplicateJobs(
      rawJobs
        .filter((job) => job.title && job.company)
        .map((job) => {
          const normalizedJob = normalizeJob(job, job.source);
          return { ...normalizedJob, ...calculateMatch(normalizedJob, profile) };
        }),
    );
    const writeResult = await upsertDiscoveredJobs(normalized);
    const status = providerResults.some((item) => item.status === "pending") && !normalized.length ? "skipped" : "completed";
    const message = normalized.length
      ? `Inserted or updated ${normalized.length} jobs.`
      : "No jobs inserted. Discovery providers need a configured public-index/search API.";

    await finishRun(run?.id, {
      status,
      jobs_found: rawJobs.length,
      jobs_inserted: writeResult.inserted,
      jobs_updated: writeResult.updated,
      message,
    });

    return { status, jobsFound: rawJobs.length, jobsInserted: writeResult.inserted, providerResults, message };
  } catch (error) {
    await finishRun(run?.id, { status: "failed", error_message: error.message, message: "Discovery run failed." });
    throw error;
  }
}

export async function runDiscovery({ profileId = null, automation = false } = {}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      status: "skipped",
      jobsFound: 0,
      jobsInserted: 0,
      message: "Supabase is not configured.",
      providerResults: [],
    };
  }

  let query = supabase.from("search_profiles").select("*").eq("enabled", true);
  if (profileId) query = supabase.from("search_profiles").select("*").eq("id", profileId);
  const { data: profiles, error } = await query;
  if (error) throw new Error(error.message);

  if (automation) {
    const { data: settings } = await supabase.from("automation_settings").select("*").limit(1).maybeSingle();
    if (settings && !settings.enabled) {
      await supabase.from("search_runs").insert({
        status: "skipped",
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        message: "Automation is disabled.",
      });
      return { status: "skipped", jobsFound: 0, jobsInserted: 0, message: "Automation is disabled.", providerResults: [] };
    }
  }

  const results = [];
  for (const profile of profiles || []) {
    results.push(await runDiscoveryForProfile(profile));
  }

  const summary = {
    status: results.some((result) => result.status === "failed") ? "failed" : "completed",
    profilesRun: results.length,
    jobsFound: results.reduce((sum, result) => sum + result.jobsFound, 0),
    jobsInserted: results.reduce((sum, result) => sum + result.jobsInserted, 0),
    providerResults: results.flatMap((result) => result.providerResults),
    message: results.length ? "Discovery run completed." : "No enabled search profiles found.",
  };

  await supabase
    .from("automation_settings")
    .update({ last_run_at: new Date().toISOString(), last_status: summary.status, updated_at: new Date().toISOString() })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  return summary;
}
