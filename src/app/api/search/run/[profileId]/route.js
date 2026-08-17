import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/services/auth/requireAuth";
import { runDiscovery } from "@/services/discovery/run";

export async function POST(request, { params }) {
  try {
    if (!isRequestAuthenticated(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { profileId } = await params;
    const data = await runDiscovery({ profileId });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Could not run search profile." }, { status: 500 });
  }
}
