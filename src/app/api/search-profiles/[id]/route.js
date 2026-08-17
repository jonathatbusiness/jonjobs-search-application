import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/services/auth/requireAuth";
import { deleteSearchProfile, duplicateSearchProfile, patchSearchProfile, updateSearchProfile } from "@/services/search";

export async function PUT(request, { params }) {
  try {
    if (!isRequestAuthenticated(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const profile = await request.json();
    const data = await updateSearchProfile(id, profile);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || "Could not update search profile." }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    if (!isRequestAuthenticated(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();
    const data = updates.action === "duplicate" ? await duplicateSearchProfile(id) : await patchSearchProfile(id, updates);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || "Could not update search profile." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!isRequestAuthenticated(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const data = await deleteSearchProfile(id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Could not delete search profile." }, { status: 500 });
  }
}
