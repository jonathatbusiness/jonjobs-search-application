"use client";

import { useMemo, useState } from "react";
import ApplicationCard from "./ApplicationCard";
import ApplicationFilters from "./ApplicationFilters";

export default function ApplicationsWorkspace({ initialApplications }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const applications = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return initialApplications.filter((application) => {
      const job = application.jobs || {};
      const haystack = [job.title, job.company, job.location, application.status, application.next_action]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (status !== "All" && application.status !== status) return false;
      return !normalized || haystack.includes(normalized);
    });
  }, [initialApplications, query, status]);

  return (
    <div className="grid gap-5">
      <ApplicationFilters query={query} status={status} onQueryChange={setQuery} onStatusChange={setStatus} />
      {applications.length ? (
        <div className="grid gap-4">
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[var(--line-strong)] bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-[var(--ink-900)]">No applications yet.</h2>
          <p className="mt-2 text-sm text-[var(--ink-600)]">When you apply for a job, it will appear here.</p>
        </div>
      )}
    </div>
  );
}
