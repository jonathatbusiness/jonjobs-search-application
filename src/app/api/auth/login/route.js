import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, verifyPassword } from "@/services/auth/session";

export async function POST(request) {
  const { username, password } = await request.json();
  const expectedUser = process.env.APP_USERNAME;
  const expectedHash = process.env.APP_PASSWORD_HASH;

  if (!expectedUser || !expectedHash) {
    return NextResponse.json(
      { success: false, error: "Authentication is not configured." },
      { status: 500 },
    );
  }

  if (username !== expectedUser || !verifyPassword(password, expectedHash)) {
    return NextResponse.json(
      { success: false, error: "Invalid username or password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true, data: { redirectTo: "/jobs" } });
  response.cookies.set(SESSION_COOKIE, createSessionToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
