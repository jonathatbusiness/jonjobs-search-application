import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/services/auth/requireAuth";
import { createSearchProfile } from "@/services/search";

export async function POST(request) {
  try {
    if (!isRequestAuthenticated(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const profile = await request.json();
    const data = await createSearchProfile(profile);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || "Could not create search profile." }, { status: 500 });
  }
}
