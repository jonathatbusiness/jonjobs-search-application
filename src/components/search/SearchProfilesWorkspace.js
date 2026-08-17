"use client";

import { useMemo, useState } from "react";
import { FiCopy, FiEdit2, FiPlay, FiSave, FiTrash2 } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Toggle from "@/components/ui/Toggle";
import { buildBooleanQuery, profileFromDb } from "@/services/search/query";
import KeywordChips from "./KeywordChips";
import SearchBar from "./SearchBar";

const emptyProfile = {
  name: "",
  primaryTitle: "",
  titleVariants: [],
  includeKeywords: [],
  excludeKeywords: [],
  keywordMode: "ALL",
  location: "",
  workplaceTypes: [],
  sources: ["LinkedIn", "Indeed", "Company"],
  countries: [],
  enabled: true,
};

const workplaceOptions = ["Remote", "Hybrid", "On-site", "Unknown"];
const sourceOptions = ["LinkedIn", "Indeed", "Company", "Other"];

function toggleArrayValue(values, value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export default function SearchProfilesWorkspace({ initialProfiles }) {
  const [profiles, setProfiles] = useState(initialProfiles.map(profileFromDb));
  const [selectedId, setSelectedId] = useState(profiles[0]?.id || null);
  const [draft, setDraft] = useState(profiles[0] || emptyProfile);
  const [internalQuery, setInternalQuery] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackVariant, setFeedbackVariant] = useState("default");
  const [runningProfileId, setRunningProfileId] = useState(null);
  const [profileFeedback, setProfileFeedback] = useState({});

  const query = useMemo(() => buildBooleanQuery(draft), [draft]);
  const filteredProfiles = useMemo(() => {
    const normalized = internalQuery.trim().toLowerCase();
    if (!normalized) return profiles;
    return profiles.filter((profile) =>
      [profile.name, profile.primaryTitle, profile.location, profile.query, ...(profile.includeKeywords || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [profiles, internalQuery]);

  function editProfile(profile) {
    setSelectedId(profile.id);
    setDraft(profile);
    setMessage("");
    setFeedbackVariant("default");
  }

  function newProfile() {
    setSelectedId(null);
    setDraft(emptyProfile);
    setMessage("");
    setFeedbackVariant("default");
  }

  async function saveProfile() {
    const url = selectedId ? `/api/search-profiles/${selectedId}` : "/api/search-profiles";
    const response = await fetch(url, {
      method: selectedId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error || "Could not save profile.");
      setFeedbackVariant("danger");
      return;
    }
    const saved = profileFromDb(payload.data);
    setProfiles((current) => (selectedId ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current]));
    setSelectedId(saved.id);
    setDraft(saved);
    setMessage("Search profile saved.");
    setFeedbackVariant("success");
  }

  async function deleteProfile(profile) {
    await fetch(`/api/search-profiles/${profile.id}`, { method: "DELETE" });
    setProfiles((current) => current.filter((item) => item.id !== profile.id));
    if (selectedId === profile.id) newProfile();
  }

  async function duplicateProfile(profile) {
    const response = await fetch(`/api/search-profiles/${profile.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate" }),
    });
    const payload = await response.json();
    if (response.ok) {
      const copy = profileFromDb(payload.data);
      setProfiles((current) => [copy, ...current]);
      editProfile(copy);
    }
  }

  async function toggleEnabled(profile, enabled) {
    setProfiles((current) => current.map((item) => (item.id === profile.id ? { ...item, enabled } : item)));
    await fetch(`/api/search-profiles/${profile.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
  }

  async function runProfile(profile) {
    setRunningProfileId(profile.id);
    setMessage(`Running ${profile.name}...`);
    setFeedbackVariant("default");
    setProfileFeedback((current) => ({ ...current, [profile.id]: { variant: "default", message: "Running search..." } }));

    try {
      const response = await fetch(`/api/search/run/${profile.id}`, { method: "POST" });
      const payload = await response.json();
      const providerNote = payload.data?.providerResults?.[0]?.message;
      const nextMessage = payload.success
        ? providerNote || payload.data.message || "Search run completed."
        : payload.error || "Search run failed.";
      const nextVariant = payload.success ? (payload.data.jobsInserted > 0 ? "success" : "warning") : "danger";

      setMessage(nextMessage);
      setFeedbackVariant(nextVariant);
      setProfileFeedback((current) => ({ ...current, [profile.id]: { variant: nextVariant, message: nextMessage } }));
    } catch {
      const nextMessage = "Search run failed. Check your connection and try again.";
      setMessage(nextMessage);
      setFeedbackVariant("danger");
      setProfileFeedback((current) => ({ ...current, [profile.id]: { variant: "danger", message: nextMessage } }));
    } finally {
      setRunningProfileId(null);
    }
  }

  const feedbackClasses = {
    default: "border-[var(--line)] bg-[var(--surface-muted)] text-[var(--ink-700)]",
    success: "border-[var(--success-100)] bg-[var(--success-100)] text-[var(--success-700)]",
    warning: "border-[var(--warning-100)] bg-[var(--warning-100)] text-[var(--warning-700)]",
    danger: "border-[var(--danger-100)] bg-[var(--danger-100)] text-[var(--danger-700)]",
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
      <section className="grid gap-5 rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--ink-950)]">Boolean Search Builder</h2>
            <p className="text-sm text-[var(--ink-600)]">Build reusable external discovery profiles.</p>
          </div>
          <Button type="button" variant="secondary" onClick={newProfile}>
            New profile
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Profile name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          <Input
            label="Main title"
            value={draft.primaryTitle}
            onChange={(event) => setDraft({ ...draft, primaryTitle: event.target.value })}
          />
        </div>

        <KeywordChips
          label="Title variants"
          values={draft.titleVariants}
          placeholder="Learning Experience Designer"
          onChange={(titleVariants) => setDraft({ ...draft, titleVariants })}
        />
        <div className="grid gap-4 md:grid-cols-[1fr_150px]">
          <KeywordChips
            label="Include keywords"
            values={draft.includeKeywords}
            placeholder="Storyline"
            onChange={(includeKeywords) => setDraft({ ...draft, includeKeywords })}
          />
          <Select label="Keyword mode" value={draft.keywordMode} onChange={(event) => setDraft({ ...draft, keywordMode: event.target.value })}>
            <option value="ALL">ALL</option>
            <option value="ANY">ANY</option>
          </Select>
        </div>
        <KeywordChips
          label="Exclude terms"
          values={draft.excludeKeywords}
          placeholder="teacher"
          onChange={(excludeKeywords) => setDraft({ ...draft, excludeKeywords })}
        />
        <Input label="Location" value={draft.location || ""} onChange={(event) => setDraft({ ...draft, location: event.target.value })} />

        <div className="grid gap-4 md:grid-cols-2">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-[var(--ink-700)]">Workplace</legend>
            <div className="flex flex-wrap gap-2">
              {workplaceOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDraft({ ...draft, workplaceTypes: toggleArrayValue(draft.workplaceTypes, option) })}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    draft.workplaceTypes.includes(option)
                      ? "border-[var(--brand-700)] bg-[var(--brand-700)] text-white"
                      : "border-[var(--line)] bg-white text-[var(--ink-700)]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-[var(--ink-700)]">Sources</legend>
            <div className="flex flex-wrap gap-2">
              {sourceOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDraft({ ...draft, sources: toggleArrayValue(draft.sources, option) })}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    draft.sources.includes(option)
                      ? "border-[var(--brand-700)] bg-[var(--brand-700)] text-white"
                      : "border-[var(--line)] bg-white text-[var(--ink-700)]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <Toggle
          label="Run automatically"
          description="Allow this profile to run during scheduled discovery."
          checked={draft.enabled}
          onChange={(enabled) => setDraft({ ...draft, enabled })}
        />

        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
          <p className="text-sm font-semibold text-[var(--ink-800)]">Query preview</p>
          <code className="mt-2 block whitespace-pre-wrap text-sm leading-6 text-[var(--brand-900)]">{query || "Start adding terms."}</code>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={saveProfile}>
              <FiSave aria-hidden />
              Save
            </Button>
            {selectedId ? (
              <Button type="button" variant="secondary" onClick={() => runProfile(draft)}>
                <FiPlay aria-hidden />
                Run now
              </Button>
            ) : null}
          </div>
          {message ? (
            <p className={`rounded-md border px-3 py-2 text-sm ${feedbackClasses[feedbackVariant]}`}>{message}</p>
          ) : null}
        </div>
      </section>

      <section className="grid content-start gap-4">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-[var(--ink-950)]">Search profiles</h2>
          <SearchBar value={internalQuery} onChange={setInternalQuery} placeholder="Search saved profiles" />
        </div>
        {filteredProfiles.length ? (
          filteredProfiles.map((profile) => (
            <article key={profile.id} className="rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[var(--ink-950)]">{profile.name}</h3>
                  <p className="mt-1 text-sm text-[var(--ink-600)]">{profile.location || "Any location"}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={profile.enabled}
                  aria-label={`${profile.enabled ? "Disable" : "Enable"} ${profile.name}`}
                  onClick={() => toggleEnabled(profile, !profile.enabled)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${profile.enabled ? "bg-[var(--brand-700)]" : "bg-[var(--ink-300)]"}`}
                >
                  <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${profile.enabled ? "left-6" : "left-1"}`} />
                </button>
              </div>
              <code className="mt-3 line-clamp-3 block text-xs leading-5 text-[var(--brand-900)]">{profile.query || buildBooleanQuery(profile)}</code>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => editProfile(profile)}>
                  <FiEdit2 aria-hidden />
                  Edit
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => duplicateProfile(profile)}>
                  <FiCopy aria-hidden />
                  Duplicate
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => runProfile(profile)} disabled={runningProfileId === profile.id}>
                  <FiPlay aria-hidden />
                  {runningProfileId === profile.id ? "Running..." : "Run"}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => deleteProfile(profile)}>
                  <FiTrash2 aria-hidden />
                  Delete
                </Button>
              </div>
              {profileFeedback[profile.id] ? (
                <p className={`mt-3 rounded-md border px-3 py-2 text-sm ${feedbackClasses[profileFeedback[profile.id].variant]}`}>
                  {profileFeedback[profile.id].message}
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-[var(--line-strong)] bg-white p-6 text-center">
            <h2 className="text-lg font-semibold text-[var(--ink-900)]">No saved search profiles yet.</h2>
            <p className="mt-2 text-sm text-[var(--ink-600)]">Create your first search profile.</p>
          </div>
        )}
      </section>
    </div>
  );
}
