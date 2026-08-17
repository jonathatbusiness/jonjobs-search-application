import { NextResponse } from "next/server";
import { runDiscovery } from "@/services/discovery/run";

function isAuthorized(request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${expected}`;
}

export async function GET(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }
    const data = await runDiscovery({ automation: true });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Cron search failed." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }
    const data = await runDiscovery({ automation: true });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Cron search failed." }, { status: 500 });
  }
}
