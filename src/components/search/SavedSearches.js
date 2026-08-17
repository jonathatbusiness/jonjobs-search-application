import Badge from "@/components/ui/Badge";

export default function SavedSearches({ profiles }) {
  if (!profiles.length) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--line-strong)] bg-white p-6 text-center">
        <h2 className="text-lg font-semibold text-[var(--ink-900)]">No saved search profiles yet.</h2>
        <p className="mt-2 text-sm text-[var(--ink-600)]">Create your first search profile.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {profiles.map((profile) => (
        <article key={profile.id} className="rounded-lg border border-[var(--line)] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-[var(--ink-950)]">{profile.name}</h2>
              <p className="mt-1 text-sm text-[var(--ink-600)]">{profile.location || "Any location"}</p>
            </div>
            <Badge variant={profile.enabled ? "success" : "default"}>{profile.enabled ? "Enabled" : "Disabled"}</Badge>
          </div>
          {profile.query ? <code className="mt-3 block text-sm text-[var(--brand-900)]">{profile.query}</code> : null}
        </article>
      ))}
    </div>
  );
}
