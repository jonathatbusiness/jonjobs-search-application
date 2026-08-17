"use client";

import { useState } from "react";
import { FiExternalLink, FiMapPin, FiSave } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { applicationStatuses } from "@/services/applications/constants";
import { formatLocation, formatRelativeDate, getApplyUrl } from "@/services/jobs/format";
import ApplicationStatus from "./ApplicationStatus";

export default function ApplicationCard({ application }) {
  const [draft, setDraft] = useState(application);
  const [saving, setSaving] = useState(false);
  const job = application.jobs || application.job || {};
  const url = getApplyUrl(job);

  async function saveApplication() {
    setSaving(true);
    await fetch(`/api/applications/${application.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: draft.status,
        next_action: draft.next_action || null,
        due_at: draft.due_at || null,
        recruiter_name: draft.recruiter_name || null,
        recruiter_contact: draft.recruiter_contact || null,
        resume_version: draft.resume_version || null,
        notes: draft.notes || null,
        result: draft.result || null,
      }),
    });
    setSaving(false);
  }

  return (
    <article className="rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <ApplicationStatus status={draft.status} />
          </div>
          <h2 className="text-lg font-semibold text-[var(--ink-950)]">{job.title || "Untitled job"}</h2>
          <p className="mt-1 font-medium text-[var(--ink-700)]">{job.company || "Company not informed"}</p>
          <p className="mt-3 flex items-center gap-2 text-sm text-[var(--ink-600)]">
            <FiMapPin aria-hidden />
            {formatLocation(job)}
          </p>
        </div>
        {url ? (
          <Button as="a" href={url} target="_blank" rel="noopener noreferrer" variant="secondary" size="sm">
            Open job
            <FiExternalLink aria-hidden />
          </Button>
        ) : null}
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="font-medium text-[var(--ink-500)]">Applied</dt>
          <dd className="mt-1 text-[var(--ink-800)]">{formatRelativeDate(draft.applied_at)}</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--ink-500)]">Next action</dt>
          <dd className="mt-1 text-[var(--ink-800)]">{draft.next_action || "Not defined"}</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--ink-500)]">Due</dt>
          <dd className="mt-1 text-[var(--ink-800)]">{draft.due_at ? formatRelativeDate(draft.due_at) : "Not defined"}</dd>
        </div>
      </dl>

      <div className="mt-5 grid gap-4 border-t border-[var(--line)] pt-4 md:grid-cols-2">
        <Select label="Status" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
          {applicationStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        <Input
          label="Next action"
          value={draft.next_action || ""}
          onChange={(event) => setDraft({ ...draft, next_action: event.target.value })}
          placeholder="Follow up with recruiter"
        />
        <Input
          label="Due date"
          type="date"
          value={draft.due_at?.slice(0, 10) || ""}
          onChange={(event) => setDraft({ ...draft, due_at: event.target.value })}
        />
        <Input label="Recruiter" value={draft.recruiter_name || ""} onChange={(event) => setDraft({ ...draft, recruiter_name: event.target.value })} />
        <Input
          label="Recruiter contact"
          value={draft.recruiter_contact || ""}
          onChange={(event) => setDraft({ ...draft, recruiter_contact: event.target.value })}
        />
        <Input
          label="Resume version"
          value={draft.resume_version || ""}
          onChange={(event) => setDraft({ ...draft, resume_version: event.target.value })}
        />
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-[var(--ink-700)]">Notes</span>
        <textarea
          value={draft.notes || ""}
          onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
          rows={3}
          className="w-full rounded-md border border-[var(--line-strong)] bg-white px-3 py-2 text-sm shadow-sm focus:border-[var(--brand-600)] focus:outline-2"
        />
      </label>

      <div className="mt-4 flex justify-end">
        <Button type="button" size="sm" onClick={saveApplication} disabled={saving}>
          <FiSave aria-hidden />
          {saving ? "Saving..." : "Save application"}
        </Button>
      </div>
    </article>
  );
}
