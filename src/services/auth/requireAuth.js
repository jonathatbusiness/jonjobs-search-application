import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "./session";

export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!verifySessionToken(token)) {
    redirect("/login");
  }
}

export function isRequestAuthenticated(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${SESSION_COOKIE}=`))
    ?.split("=")[1];

  return verifySessionToken(token);
}
