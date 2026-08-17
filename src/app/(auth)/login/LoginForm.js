"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const payload = await response.json();

    setLoading(false);
    if (!response.ok) {
      setError(payload.error || "Could not sign in.");
      return;
    }

    router.push(payload.data?.redirectTo || "/jobs");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input label="User" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
      />
      {error ? <p className="rounded-md bg-[var(--danger-100)] px-3 py-2 text-sm text-[var(--danger-700)]">{error}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Entering..." : "Enter"}
      </Button>
    </form>
  );
}
