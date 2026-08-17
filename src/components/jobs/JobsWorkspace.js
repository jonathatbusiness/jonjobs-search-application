"use client";

import { useMemo, useState } from "react";
import { FiFilter } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import FilterPanel from "@/components/search/FilterPanel";
import SearchBar from "@/components/search/SearchBar";
import JobGrid from "./JobGrid";
import JobModal from "./JobModal";

const quickFilters = ["All", "New", "Viewed", "Favorite", "Applied", "Discarded"];
const emptyFilters = {
  country: "Any",
  workplace_type: "Any",
  employment_type: "Any",
  seniority: "Any",
  source: "Any",
  published: "Any",
  match: "Any",
  application_state: "Any",
};

function matchesAdvanced(job, filters) {
  if (filters.country !== "Any" && job.country !== filters.country) return false;
  if (filters.workplace_type !== "Any" && job.workplace_type !== filters.workplace_type) return false;
  if (filters.employment_type !== "Any" && job.employment_type !== filters.employment_type) return false;
  if (filters.seniority !== "Any" && job.seniority !== filters.seniority) return false;
  if (filters.source !== "Any" && job.source !== filters.source) return false;
  if (filters.published !== "Any") {
    const publishedAt = job.published_at ? new Date(job.published_at).getTime() : 0;
    const days = Number(filters.published.match(/\d+/)?.[0] || 0);
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    if (!publishedAt || publishedAt < threshold) return false;
  }
  if (filters.match !== "Any") {
    const [min, max] = filters.match.split("-").map(Number);
    if (typeof job.match_score !== "number" || job.match_score < min || job.match_score > max) return false;
  }
  const applicationStatus = job.application_status || job.application?.status;
  if (filters.application_state === "Not applied" && applicationStatus) return false;
  if (filters.application_state === "Applied" && applicationStatus !== "applied") return false;
  if (filters.application_state === "In process" && !["screening", "interview", "case", "offer"].includes(applicationStatus)) return false;
  if (filters.application_state === "Rejected" && applicationStatus !== "rejected") return false;
  return true;
}

function sortJobs(jobs, sort) {
  return [...jobs].sort((a, b) => {
    if (sort === "oldest_discovered") return new Date(a.discovered_at) - new Date(b.discovered_at);
    if (sort === "newest_published") return new Date(b.published_at || 0) - new Date(a.published_at || 0);
    if (sort === "highest_match") return (b.match_score || 0) - (a.match_score || 0);
    if (sort === "lowest_match") return (a.match_score || 0) - (b.match_score || 0);
    if (sort === "company_az") return (a.company || "").localeCompare(b.company || "");
    if (sort === "title_az") return (a.title || "").localeCompare(b.title || "");
    return new Date(b.discovered_at || 0) - new Date(a.discovered_at || 0);
  });
}

export default function JobsWorkspace({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [query, setQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState("newest_discovered");
  const [selectedJob, setSelectedJob] = useState(null);

  const visibleJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = jobs.filter((job) => {
      const haystack = [job.title, job.company, job.location, job.country, job.description, ...(job.skills || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const applicationStatus = job.application_status || job.application?.status;

      if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
      if (quickFilter === "New" && job.status !== "new") return false;
      if (quickFilter === "Viewed" && job.status !== "viewed") return false;
      if (quickFilter === "Favorite" && !job.is_favorite) return false;
      if (quickFilter === "Applied" && !applicationStatus) return false;
      if (quickFilter === "Discarded" && job.status !== "discarded") return false;
      return matchesAdvanced(job, filters);
    });

    return sortJobs(filtered, sort);
  }, [jobs, query, quickFilter, filters, sort]);

  async function patchJob(job, updates) {
    setJobs((current) => current.map((item) => (item.id === job.id ? { ...item, ...updates } : item)));
    if (selectedJob?.id === job.id) setSelectedJob((current) => ({ ...current, ...updates }));
    await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  function openJob(job) {
    if (job.status === "new") {
      setSelectedJob({ ...job, status: "viewed" });
      patchJob(job, { status: "viewed" });
      return;
    }
    setSelectedJob(job);
  }

  async function markApplied(job) {
    await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job.id }),
    });
    const updates = { application_status: "applied", application: { status: "applied" } };
    setJobs((current) => current.map((item) => (item.id === job.id ? { ...item, ...updates } : item)));
    setSelectedJob((current) => (current?.id === job.id ? { ...current, ...updates } : current));
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <SearchBar value={query} onChange={setQuery} />
        <Button type="button" variant="secondary" onClick={() => setFiltersOpen((value) => !value)}>
          <FiFilter aria-hidden />
          Filters
        </Button>
        <Select aria-label="Sort jobs" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="newest_discovered">Newest discovered</option>
          <option value="oldest_discovered">Oldest discovered</option>
          <option value="newest_published">Newest published</option>
          <option value="highest_match">Highest match</option>
          <option value="lowest_match">Lowest match</option>
          <option value="company_az">Company A-Z</option>
          <option value="title_az">Title A-Z</option>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setQuickFilter(filter)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              quickFilter === filter
                ? "border-[var(--brand-700)] bg-[var(--brand-700)] text-white"
                : "border-[var(--line)] bg-white text-[var(--ink-700)] hover:bg-[var(--brand-050)]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filtersOpen ? (
        <FilterPanel filters={filters} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />
      ) : null}

      <JobGrid
        jobs={visibleJobs}
        onOpen={openJob}
        onToggleFavorite={(job) => patchJob(job, { is_favorite: !job.is_favorite })}
        onDiscard={(job) => patchJob(job, { status: "discarded" })}
      />

      <JobModal
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        onDiscard={(job) => patchJob(job, { status: "discarded" })}
        onMarkApplied={markApplied}
      />
    </div>
  );
}
