function slug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createCanonicalKey(job) {
  if (job.source_url) return slug(job.source_url);
  return slug([job.company, job.title, job.location || job.country].filter(Boolean).join("-"));
}

export function normalizeJob(raw, sourceName = "Other") {
  const normalized = {
    source: raw.source || sourceName,
    source_job_id: raw.source_job_id || raw.id || null,
    source_url: raw.source_url || raw.url || null,
    direct_application_url: raw.direct_application_url || null,
    application_url: raw.application_url || raw.apply_url || raw.url || null,
    title: raw.title?.trim(),
    company: raw.company?.trim(),
    location: raw.location || [raw.city, raw.country].filter(Boolean).join(", "),
    city: raw.city || null,
    country: raw.country || null,
    workplace_type: raw.workplace_type || "Unknown",
    employment_type: raw.employment_type || "Unknown",
    seniority: raw.seniority || "Unknown",
    salary_min: raw.salary_min || null,
    salary_max: raw.salary_max || null,
    salary_currency: raw.salary_currency || null,
    salary_period: raw.salary_period || null,
    description: raw.description || null,
    requirements: raw.requirements || [],
    skills: raw.skills || [],
    keywords: raw.keywords || [],
    published_at: raw.published_at || null,
    discovered_at: new Date().toISOString(),
    source_metadata: raw.source_metadata || raw,
  };

  normalized.canonical_key = createCanonicalKey(normalized);
  return normalized;
}

export function deduplicateJobs(jobs) {
  const seen = new Set();
  return jobs.filter((job) => {
    if (seen.has(job.canonical_key)) return false;
    seen.add(job.canonical_key);
    return true;
  });
}
