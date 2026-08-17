import AppShell from "@/components/layout/AppShell";
import AutomationSettings from "@/components/settings/AutomationSettings";
import { requireAuth } from "@/services/auth/requireAuth";
import { getAutomationSettings, getSearchRuns } from "@/services/search";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAuth();
  const [automation, runs] = await Promise.all([getAutomationSettings(), getSearchRuns()]);

  return (
    <AppShell automationEnabled={automation.enabled}>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink-950)]">Settings</h1>
        <p className="mt-1 text-[var(--ink-600)]">Control automation and manual discovery runs.</p>
      </div>
      <AutomationSettings initialSettings={automation} initialRuns={runs} />
    </AppShell>
  );
}
