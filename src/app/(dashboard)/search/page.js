import BooleanBuilder from "@/components/search/BooleanBuilder";
import SavedSearches from "@/components/search/SavedSearches";
import AppShell from "@/components/layout/AppShell";
import { requireAuth } from "@/services/auth/requireAuth";
import { getAutomationSettings, getSearchProfiles } from "@/services/search";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  await requireAuth();
  const [profiles, automation] = await Promise.all([getSearchProfiles(), getAutomationSettings()]);

  return (
    <AppShell automationEnabled={automation.enabled}>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink-950)]">Search</h1>
        <p className="mt-1 text-[var(--ink-600)]">Build reusable job discovery profiles.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <BooleanBuilder />
        <section>
          <h2 className="mb-3 text-lg font-semibold text-[var(--ink-950)]">Saved searches</h2>
          <SavedSearches profiles={profiles} />
        </section>
      </div>
    </AppShell>
  );
}
