"use client";

import Button from "@/components/ui/Button";

export default function DashboardError({ reset }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="max-w-md rounded-lg border border-[var(--line)] bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-[var(--ink-950)]">We could not load this area.</h1>
        <p className="mt-2 text-sm text-[var(--ink-600)]">Try again. If the problem continues, check the Supabase environment variables.</p>
        <Button type="button" className="mt-4" onClick={reset}>
          Retry
        </Button>
      </div>
    </div>
  );
}
