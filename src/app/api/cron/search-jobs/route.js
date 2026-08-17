import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/services/supabase/server";

function isAuthorized(request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return true;
  const header = request.headers.get("authorization");
  return header === `Bearer ${expected}`;
}

async function runSearchJob() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      providersConnected: false,
      jobsFound: 0,
      message: "Supabase is not configured. Discovery providers are not connected yet.",
    };
  }

  const { data: settings } = await supabase.from("automation_settings").select("*").limit(1).maybeSingle();
  if (settings && !settings.enabled) {
    return { providersConnected: false, jobsFound: 0, message: "Automation is disabled." };
  }

  await supabase.from("search_runs").insert({
    status: "completed",
    started_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    jobs_found: 0,
    jobs_inserted: 0,
    message: "Discovery providers are not connected yet.",
  });

  return { providersConnected: false, jobsFound: 0, message: "Discovery providers are not connected yet." };
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  const data = await runSearchJob();
  return NextResponse.json({ success: true, data });
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  const data = await runSearchJob();
  return NextResponse.json({ success: true, data });
}
