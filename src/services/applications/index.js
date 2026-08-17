import { getSupabaseServerClient } from "@/services/supabase/server";
export { applicationStatuses } from "./constants";

export async function getApplications() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("applications")
    .select("*, jobs(title,company,location,city,country,workplace_type,source,application_url,source_url)")
    .order("applied_at", { ascending: false });

  if (error) {
    console.error("Failed to load applications", error.message);
    return [];
  }

  return data || [];
}

export async function markJobAsApplied(jobId) {
  const supabase = getSupabaseServerClient();
  const payload = {
    job_id: jobId,
    status: "applied",
    applied_at: new Date().toISOString(),
  };

  if (!supabase) return { id: `local-${jobId}`, ...payload };

  const { data, error } = await supabase
    .from("applications")
    .upsert(payload, { onConflict: "job_id" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateApplication(id, updates) {
  const allowed = [
    "status",
    "next_action",
    "due_at",
    "recruiter_name",
    "recruiter_contact",
    "resume_version",
    "notes",
    "result",
  ];
  const payload = Object.fromEntries(Object.entries(updates).filter(([key]) => allowed.includes(key)));
  const supabase = getSupabaseServerClient();
  if (!supabase) return { id, ...payload };

  const { data, error } = await supabase.from("applications").update(payload).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data;
}
