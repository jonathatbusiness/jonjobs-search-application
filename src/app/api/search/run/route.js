import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/services/auth/requireAuth";

export async function POST(request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();

  return NextResponse.json({
    success: true,
    data: {
      status: "queued",
      profile: body.profile?.name || "Manual search",
      query: body.query || "",
      message: "Discovery providers are not connected yet.",
    },
  });
}
