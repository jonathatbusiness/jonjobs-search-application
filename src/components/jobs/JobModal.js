"use client";

import { FiExternalLink } from "react-icons/fi";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatLocation, formatRelativeDate, formatSalary, getApplyUrl } from "@/services/jobs/format";
import JobBadges from "./JobBadges";

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-[var(--ink-500)]">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-[var(--ink-900)]">{value || "Not informed"}</dd>
    </div>
  );
}

export default function JobModal({ job, isOpen, onClose, onDiscard, onMarkApplied }) {
  if (!job) return null;
  const applyUrl = getApplyUrl(job);

  return (
    <Modal
      isOpen={isOpen}
      title={job.title}
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="danger" onClick={() => onDiscard(job)}>
            Discard
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="secondary" onClick={() => onMarkApplied(job)}>
              Mark as applied
            </Button>
            {applyUrl ? (
              <Button as="a" href={applyUrl} target="_blank" rel="noopener noreferrer">
                Apply
                <FiExternalLink aria-hidden />
              </Button>
            ) : (
              <Button type="button" disabled>
                Apply
                <FiExternalLink aria-hidden />
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="grid gap-6">
        <section>
          <p className="text-lg font-medium text-[var(--ink-800)]">{job.company}</p>
          <p className="mt-1 text-sm text-[var(--ink-600)]">{formatLocation(job)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="accent">{job.source || "Other"}</Badge>
            <JobBadges job={job} />
          </div>
        </section>

        <dl className="grid gap-4 rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4 sm:grid-cols-4">
          <Detail label="Published" value={formatRelativeDate(job.published_at)} />
          <Detail label="Found" value={formatRelativeDate(job.discovered_at)} />
          <Detail label="Match" value={typeof job.match_score === "number" ? `${job.match_score}%` : "Not informed"} />
          <Detail label="Salary" value={formatSalary(job)} />
        </dl>

        <section className="grid gap-4 sm:grid-cols-2">
          <Detail label="Workplace" value={job.workplace_type} />
          <Detail label="Employment" value={job.employment_type} />
          <Detail label="Seniority" value={job.seniority} />
          <Detail label="Country" value={job.country} />
        </section>

        <section>
          <h3 className="text-base font-semibold text-[var(--ink-950)]">Job description</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--ink-700)]">
            {job.description || "No description available."}
          </p>
        </section>

        {job.requirements?.length ? (
          <section>
            <h3 className="text-base font-semibold text-[var(--ink-950)]">Requirements</h3>
            <ul className="mt-2 grid gap-2 text-sm text-[var(--ink-700)]">
              {job.requirements.map((requirement) => (
                <li key={requirement}>- {requirement}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {job.skills?.length ? (
          <section>
            <h3 className="text-base font-semibold text-[var(--ink-950)]">Required / detected skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-lg border border-[var(--line)] p-4">
          <h3 className="text-base font-semibold text-[var(--ink-950)]">Match analysis</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-[var(--success-700)]">Matched</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(job.matched_skills || []).map((skill) => (
                  <Badge key={skill} variant="success">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--warning-700)]">Missing / unclear</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(job.missing_skills || []).map((skill) => (
                  <Badge key={skill} variant="warning">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
}
