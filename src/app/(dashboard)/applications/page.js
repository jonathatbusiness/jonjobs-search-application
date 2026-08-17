import ApplicationsWorkspace from "@/components/applications/ApplicationsWorkspace";
import AppShell from "@/components/layout/AppShell";
import { requireAuth } from "@/services/auth/requireAuth";
import { getApplications } from "@/services/applications";
import { getAutomationSettings } from "@/services/search";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  await requireAuth();
  const [applications, automation] = await Promise.all([getApplications(), getAutomationSettings()]);

  return (
    <AppShell automationEnabled={automation.enabled}>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink-950)]">Applications</h1>
        <p className="mt-1 text-[var(--ink-600)]">Track every application as its own workflow.</p>
      </div>
      <ApplicationsWorkspace initialApplications={applications} />
    </AppShell>
  );
}
