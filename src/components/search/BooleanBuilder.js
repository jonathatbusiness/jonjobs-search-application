"use client";

import { useMemo, useState } from "react";
import { FiPlay } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import { buildBooleanQuery } from "@/services/search/query";
import KeywordChips from "./KeywordChips";

export default function BooleanBuilder() {
  const [profile, setProfile] = useState({
    name: "Instructional design remote",
    primaryTitle: "Instructional Designer",
    titleVariants: ["Learning Experience Designer", "E-learning Developer"],
    includeKeywords: ["Storyline", "LMS", "SCORM"],
    excludeKeywords: ["teacher", "professor"],
    location: "Ireland OR Canada",
    enabled: true,
  });
  const [message, setMessage] = useState("");

  const query = useMemo(() => buildBooleanQuery(profile), [profile]);

  async function runNow() {
    setMessage("Search run queued. Discovery providers can be connected next.");
    await fetch("/api/search/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, query }),
    });
  }

  return (
    <section className="grid gap-5 rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Profile name" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
        <Input
          label="Primary title"
          value={profile.primaryTitle}
          onChange={(event) => setProfile({ ...profile, primaryTitle: event.target.value })}
        />
      </div>

      <KeywordChips
        label="Title variants"
        values={profile.titleVariants}
        placeholder="Learning Designer"
        onChange={(titleVariants) => setProfile({ ...profile, titleVariants })}
      />
      <KeywordChips
        label="Include keywords"
        values={profile.includeKeywords}
        placeholder="Rise"
        onChange={(includeKeywords) => setProfile({ ...profile, includeKeywords })}
      />
      <KeywordChips
        label="Exclude keywords"
        values={profile.excludeKeywords}
        placeholder="internship"
        onChange={(excludeKeywords) => setProfile({ ...profile, excludeKeywords })}
      />
      <Input label="Location" value={profile.location} onChange={(event) => setProfile({ ...profile, location: event.target.value })} />

      <Toggle
        label="Run automatically"
        description="Allow this profile to run during scheduled discovery."
        checked={profile.enabled}
        onChange={(enabled) => setProfile({ ...profile, enabled })}
      />

      <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
        <p className="text-sm font-semibold text-[var(--ink-800)]">Query preview</p>
        <code className="mt-2 block whitespace-pre-wrap text-sm leading-6 text-[var(--brand-900)]">{query || "Start adding terms."}</code>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" onClick={runNow}>
          <FiPlay aria-hidden />
          Run now
        </Button>
        {message ? <p className="text-sm text-[var(--success-700)]">{message}</p> : null}
      </div>
    </section>
  );
}
