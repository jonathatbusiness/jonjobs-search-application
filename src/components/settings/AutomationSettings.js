"use client";

import { useState } from "react";
import { FiPlay } from "react-icons/fi";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { formatRelativeDate } from "@/services/jobs/format";

export default function AutomationSettings({ initialSettings, initialRuns = [] }) {
  const [settings, setSettings] = useState(initialSettings);
  const [runs, setRuns] = useState(initialRuns);
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
    const response = await fetch("/api/search/run", { method: "POST" });
    const payload = await response.json();
    setMessage(payload.success ? payload.data.message : payload.error || "Search job failed.");
    if (payload.success) {
      setSettings((current) => ({ ...current, last_status: payload.data.status, last_run_at: new Date().toISOString() }));
      setRuns((current) => [
        {
          id: crypto.randomUUID(),
          status: payload.data.status,
          jobs_found: payload.data.jobsFound,
          jobs_inserted: payload.data.jobsInserted,
          message: payload.data.message,
          created_at: new Date().toISOString(),
        },
        ...current,
      ]);
    }
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

      <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--ink-950)]">Search run history</h2>
        {runs.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-[var(--line)] text-xs uppercase text-[var(--ink-500)]">
                <tr>
                  <th className="py-2 pr-4">Run</th>
                  <th className="py-2 pr-4">Profile</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Found</th>
                  <th className="py-2 pr-4">Inserted</th>
                  <th className="py-2 pr-4">Message</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr key={run.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="py-3 pr-4 text-[var(--ink-700)]">{formatRelativeDate(run.created_at)}</td>
                    <td className="py-3 pr-4 text-[var(--ink-700)]">{run.search_profiles?.name || "Global"}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={run.status === "completed" ? "success" : run.status === "failed" ? "danger" : "warning"}>{run.status}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-[var(--ink-700)]">{run.jobs_found || 0}</td>
                    <td className="py-3 pr-4 text-[var(--ink-700)]">{run.jobs_inserted || 0}</td>
                    <td className="py-3 pr-4 text-[var(--ink-600)]">{run.message || run.error_message || "No details"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--ink-600)]">No search runs yet.</p>
        )}
      </section>
    </div>
  );
}
