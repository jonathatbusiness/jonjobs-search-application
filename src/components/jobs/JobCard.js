"use client";

import { FiBriefcase, FiClock, FiExternalLink, FiMapPin, FiStar, FiTrash2 } from "react-icons/fi";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatLocation, formatRelativeDate } from "@/services/jobs/format";
import JobBadges from "./JobBadges";
import JobStatus from "./JobStatus";

function matchVariant(score) {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  if (score >= 40) return "accent";
  return "default";
}

export default function JobCard({ job, onOpen, onToggleFavorite, onDiscard }) {
  const applicationStatus = job.application_status || job.application?.status;
  const skills = job.skills || [];

  return (
    <article className="flex h-full flex-col rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm transition hover:border-[var(--line-strong)] hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="accent">{job.source || "Other"}</Badge>
          <JobStatus status={applicationStatus || job.status} />
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label={job.is_favorite ? "Remove favorite" : "Favorite job"}
            onClick={() => onToggleFavorite(job)}
            className={`rounded-md p-2 transition hover:bg-[var(--accent-050)] ${
              job.is_favorite ? "text-[var(--accent-600)]" : "text-[var(--ink-400)]"
            }`}
          >
            <FiStar aria-hidden className={job.is_favorite ? "fill-current" : ""} />
          </button>
          <button
            type="button"
            aria-label="Discard job"
            onClick={() => onDiscard(job)}
            className="rounded-md p-2 text-[var(--ink-400)] transition hover:bg-[var(--danger-100)] hover:text-[var(--danger-700)]"
          >
            <FiTrash2 aria-hidden />
          </button>
        </div>
      </div>

      <button type="button" onClick={() => onOpen(job)} className="text-left">
        <h3 className="line-clamp-2 text-lg font-semibold leading-6 text-[var(--ink-950)]">{job.title}</h3>
        <p className="mt-1 font-medium text-[var(--ink-700)]">{job.company}</p>
      </button>

      <div className="mt-4 grid gap-2 text-sm text-[var(--ink-600)]">
        <span className="flex items-center gap-2">
          <FiMapPin aria-hidden className="shrink-0" />
          {formatLocation(job)}
        </span>
        <span className="flex items-center gap-2">
          <FiBriefcase aria-hidden className="shrink-0" />
          {job.workplace_type || "Workplace not informed"}
        </span>
        <span className="flex items-center gap-2">
          <FiClock aria-hidden className="shrink-0" />
          Published {formatRelativeDate(job.published_at)}. Found {formatRelativeDate(job.discovered_at)}.
        </span>
      </div>

      <div className="mt-4">
        <JobBadges job={job} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {skills.slice(0, 4).map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
        {skills.length > 4 ? <Badge>+{skills.length - 4}</Badge> : null}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        {typeof job.match_score === "number" ? (
          <Badge variant={matchVariant(job.match_score)}>{job.match_score}% match</Badge>
        ) : (
          <span />
        )}
        <Button type="button" variant="secondary" size="sm" onClick={() => onOpen(job)}>
          View details
          <FiExternalLink aria-hidden />
        </Button>
      </div>
    </article>
  );
}
