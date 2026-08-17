export function formatLocation(job) {
  return job.location || [job.city, job.country].filter(Boolean).join(", ") || "Location not informed";
}

export function getApplyUrl(job) {
  return job.direct_application_url || job.application_url || job.source_url || "";
}

export function formatSalary(job) {
  if (!job.salary_min && !job.salary_max) return "Not informed";
  const formatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency: job.salary_currency || "USD",
    maximumFractionDigits: 0,
  });
  const period = job.salary_period ? ` / ${job.salary_period}` : "";
  if (job.salary_min && job.salary_max) return `${formatter.format(job.salary_min)}-${formatter.format(job.salary_max)}${period}`;
  if (job.salary_min) return `${formatter.format(job.salary_min)}+${period}`;
  return `Up to ${formatter.format(job.salary_max)}${period}`;
}

export function formatRelativeDate(value) {
  if (!value) return "Not informed";
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return date.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}
