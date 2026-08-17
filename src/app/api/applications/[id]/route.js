import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/services/auth/requireAuth";
import { updateApplication } from "@/services/applications";

export async function PATCH(request, { params }) {
  try {
    if (!isRequestAuthenticated(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();
    const data = await updateApplication(id, updates);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Could not update application." }, { status: 500 });
  }
}
