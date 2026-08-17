import "server-only";
import { createClient } from "@supabase/supabase-js";

function decodeJwtRole(key) {
  try {
    const [, payload] = key.split(".");
    if (!payload) return null;
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")).role || null;
  } catch {
    return null;
  }
}

function assertPrivilegedServerKey(key) {
  if (!key) return;

  if (key.startsWith("sb_publishable_")) {
    throw new Error("SUPABASE_SECRET_KEY must be a Supabase secret key, not a publishable key.");
  }

  if (key.startsWith("sb_secret_")) return;

  const role = decodeJwtRole(key);
  if (role && role !== "service_role") {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY must use the service_role role, not anon/authenticated.");
  }
}

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;
  assertPrivilegedServerKey(key);

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
