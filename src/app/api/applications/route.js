import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/services/auth/requireAuth";
import { markJobAsApplied } from "@/services/applications";

export async function POST(request) {
  try {
    if (!isRequestAuthenticated(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json({ success: false, error: "jobId is required." }, { status: 400 });
    }

    const data = await markJobAsApplied(jobId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Could not mark job as applied." }, { status: 500 });
  }
}
