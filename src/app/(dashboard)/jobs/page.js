import AppShell from "@/components/layout/AppShell";
import JobsWorkspace from "@/components/jobs/JobsWorkspace";
import { requireAuth } from "@/services/auth/requireAuth";
import { getJobs } from "@/services/jobs";
import { getAutomationSettings } from "@/services/search";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  await requireAuth();
  const [jobs, automation] = await Promise.all([getJobs(), getAutomationSettings()]);

  return (
    <AppShell automationEnabled={automation.enabled}>
      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink-950)]">Jobs</h1>
          <p className="mt-1 text-[var(--ink-600)]">Manage discovered opportunities.</p>
        </div>
        <p className="text-sm text-[var(--ink-600)]">{jobs.length} stored jobs</p>
      </div>
      <JobsWorkspace initialJobs={jobs} />
    </AppShell>
  );
}
