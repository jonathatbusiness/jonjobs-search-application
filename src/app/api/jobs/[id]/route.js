import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/services/auth/requireAuth";
import { updateJob } from "@/services/jobs";

const allowedFields = new Set(["status", "is_favorite"]);

export async function PATCH(request, { params }) {
  try {
    if (!isRequestAuthenticated(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const updates = Object.fromEntries(Object.entries(body).filter(([key]) => allowedFields.has(key)));

    if (!Object.keys(updates).length) {
      return NextResponse.json({ success: false, error: "No valid fields to update." }, { status: 400 });
    }

    const data = await updateJob(id, updates);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Could not update job." }, { status: 500 });
  }
}
