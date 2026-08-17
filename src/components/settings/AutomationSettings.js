"use client";

import { useState } from "react";
import { FiPlay } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { formatRelativeDate } from "@/services/jobs/format";

export default function AutomationSettings({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState("");

  async function updateEnabled(enabled) {
    setSettings({ ...settings, enabled });
    await fetch("/api/settings/automation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
  }

  async function runNow() {
    setMessage("Running search job...");
    const response = await fetch("/api/cron/search-jobs", { method: "POST" });
    const payload = await response.json();
    setMessage(payload.success ? "Search job completed." : payload.error || "Search job failed.");
  }

  return (
    <div className="grid gap-5">
      <Toggle
        label="Global automation"
        description="Disable this to prevent all scheduled search profiles from running."
        checked={Boolean(settings.enabled)}
        onChange={updateEnabled}
      />

      <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink-950)]">Run status</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-[var(--ink-500)]">Last run</dt>
            <dd className="mt-1 text-sm text-[var(--ink-900)]">{formatRelativeDate(settings.last_run_at)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--ink-500)]">Next run</dt>
            <dd className="mt-1 text-sm text-[var(--ink-900)]">{settings.next_run_hint || "Managed by Vercel Cron"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--ink-500)]">Last result</dt>
            <dd className="mt-1 text-sm text-[var(--ink-900)]">{settings.last_status || "Not available"}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="button" onClick={runNow}>
            <FiPlay aria-hidden />
            Run now
          </Button>
          {message ? <p className="text-sm text-[var(--ink-600)]">{message}</p> : null}
        </div>
      </section>
    </div>
  );
}
