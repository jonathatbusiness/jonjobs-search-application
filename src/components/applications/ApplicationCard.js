import { FiExternalLink, FiMapPin } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { formatLocation, formatRelativeDate, getApplyUrl } from "@/services/jobs/format";
import ApplicationStatus from "./ApplicationStatus";

export default function ApplicationCard({ application }) {
  const job = application.jobs || application.job || {};
  const url = getApplyUrl(job);

  return (
    <article className="rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <ApplicationStatus status={application.status} />
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
          <dd className="mt-1 text-[var(--ink-800)]">{formatRelativeDate(application.applied_at)}</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--ink-500)]">Next action</dt>
          <dd className="mt-1 text-[var(--ink-800)]">{application.next_action || "Not defined"}</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--ink-500)]">Due</dt>
          <dd className="mt-1 text-[var(--ink-800)]">{application.due_at ? formatRelativeDate(application.due_at) : "Not defined"}</dd>
        </div>
      </dl>
    </article>
  );
}
