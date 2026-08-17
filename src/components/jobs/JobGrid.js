"use client";

import JobCard from "./JobCard";

export default function JobGrid({ jobs, onOpen, onToggleFavorite, onDiscard }) {
  if (!jobs.length) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--line-strong)] bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-[var(--ink-900)]">No jobs found.</h2>
        <p className="mt-2 text-sm text-[var(--ink-600)]">Try adjusting the filters or running a new search.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onOpen={onOpen}
          onToggleFavorite={onToggleFavorite}
          onDiscard={onDiscard}
        />
      ))}
    </div>
  );
}
