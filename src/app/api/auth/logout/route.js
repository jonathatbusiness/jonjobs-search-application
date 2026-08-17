import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/services/auth/session";

export async function POST() {
  const response = NextResponse.json({ success: true, data: {} });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
