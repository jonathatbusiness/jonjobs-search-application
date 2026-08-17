import { getSupabaseServerClient } from "@/services/supabase/server";
export { buildBooleanQuery } from "./query";

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
