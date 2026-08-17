import { getSupabaseServerClient } from "@/services/supabase/server";
import { profileToDb } from "./query";
export { buildBooleanQuery, profileFromDb, profileToDb } from "./query";

export async function getSearchProfiles() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("search_profiles").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to load search profiles", error.message);
    return [];
  }

  return data || [];
}

export async function createSearchProfile(profile) {
  const supabase = getSupabaseServerClient();
  const payload = profileToDb(profile);
  if (!payload.name) throw new Error("Profile name is required.");
  if (!supabase) return { id: crypto.randomUUID(), ...payload };

  const { data, error } = await supabase.from("search_profiles").insert(payload).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateSearchProfile(id, profile) {
  const supabase = getSupabaseServerClient();
  const payload = profileToDb(profile);
  if (!supabase) return { id, ...payload };

  const { data, error } = await supabase.from("search_profiles").update(payload).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function patchSearchProfile(id, updates) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { id, ...updates };

  const { data, error } = await supabase.from("search_profiles").update(updates).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSearchProfile(id) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { id };

  const { error } = await supabase.from("search_profiles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { id };
}

export async function duplicateSearchProfile(id) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: existing, error: readError } = await supabase.from("search_profiles").select("*").eq("id", id).single();
  if (readError) throw new Error(readError.message);

  const { id: _id, created_at, updated_at, ...copy } = existing;
  const { data, error } = await supabase
    .from("search_profiles")
    .insert({ ...copy, name: `${existing.name} copy`, enabled: false })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getAutomationSettings() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { enabled: false, last_run_at: null, next_run_hint: "Configure Supabase to enable automation." };
  }

  const { data, error } = await supabase.from("automation_settings").select("*").limit(1).maybeSingle();
  if (error) {
    console.error("Failed to load automation settings", error.message);
    return { enabled: false, last_run_at: null };
  }

  return data || { enabled: false, last_run_at: null };
}

export async function updateAutomationSettings(updates) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return updates;

  const { data: existing } = await supabase.from("automation_settings").select("id").limit(1).maybeSingle();
  const payload = { ...updates, updated_at: new Date().toISOString() };
  const query = existing
    ? supabase.from("automation_settings").update(payload).eq("id", existing.id)
    : supabase.from("automation_settings").insert(payload);
  const { data, error } = await query.select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getSearchRuns(limit = 20) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("search_runs")
    .select("*, search_profiles(name)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("Failed to load search runs", error.message);
    return [];
  }
  return data || [];
}
