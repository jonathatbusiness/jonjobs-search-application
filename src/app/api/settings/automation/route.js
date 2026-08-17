import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/services/auth/requireAuth";
import { getSupabaseServerClient } from "@/services/supabase/server";

export async function PATCH(request) {
  try {
    if (!isRequestAuthenticated(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { enabled } = await request.json();
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json({ success: true, data: { enabled } });
    }

    const { data: existing } = await supabase.from("automation_settings").select("id").limit(1).maybeSingle();
    const payload = { enabled: Boolean(enabled), updated_at: new Date().toISOString() };
    const query = existing
      ? supabase.from("automation_settings").update(payload).eq("id", existing.id)
      : supabase.from("automation_settings").insert(payload);

    const { data, error } = await query.select().single();
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Could not update automation settings." }, { status: 500 });
  }
}
