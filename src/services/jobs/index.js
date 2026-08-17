import { getSupabaseServerClient } from "@/services/supabase/server";
export { formatLocation, formatRelativeDate, formatSalary, getApplyUrl } from "./format";

export const sampleJobs = [
  {
    id: "sample-1",
    title: "Instructional Designer",
    company: "BrightPath Learning",
    city: "Dublin",
    country: "Ireland",
    location: "Dublin, Ireland",
    workplace_type: "Hybrid",
    employment_type: "Full-time",
    seniority: "Mid",
    source: "LinkedIn",
    status: "new",
    is_favorite: true,
    match_score: 87,
    skills: ["Storyline", "Rise", "LMS", "SCORM", "ADDIE"],
    matched_skills: ["Storyline", "Rise", "LMS", "SCORM"],
    missing_skills: ["Workday"],
    salary_min: 45000,
    salary_max: 55000,
    salary_currency: "EUR",
    salary_period: "year",
    published_at: "2026-08-14T12:00:00.000Z",
    discovered_at: "2026-08-17T09:00:00.000Z",
    application_url: "https://example.com/apply/instructional-designer",
    source_url: "https://example.com/jobs/instructional-designer",
    description:
      "Design engaging digital learning experiences for enterprise customers. Partner with subject matter experts, build Storyline modules, and maintain learning assets in the LMS.",
    requirements: ["3+ years in instructional design", "Strong Storyline and Rise portfolio", "Experience with LMS publishing"],
    applications: [],
  },
  {
    id: "sample-2",
    title: "Learning Experience Designer",
    company: "Northstar Studio",
    city: "Remote",
    country: "Canada",
    location: "Canada",
    workplace_type: "Remote",
    employment_type: "Contract",
    seniority: "Senior",
    source: "Company",
    status: "viewed",
    is_favorite: false,
    match_score: 74,
    skills: ["Figma", "Miro", "Storyboarding", "Facilitation"],
    matched_skills: ["Figma", "Storyboarding"],
    missing_skills: ["French"],
    published_at: "2026-08-10T12:00:00.000Z",
    discovered_at: "2026-08-16T10:00:00.000Z",
    application_url: "https://example.com/apply/lxd",
    source_url: "https://example.com/jobs/lxd",
    description: "Create blended learning programs for remote teams and support design workshops with internal stakeholders.",
    requirements: ["Senior learning design experience", "Comfort with asynchronous collaboration", "Portfolio required"],
    applications: [{ id: "sample-app-1", status: "screening" }],
  },
  {
    id: "sample-3",
    title: "E-learning Developer",
    company: "SkillForge",
    city: "Manchester",
    country: "United Kingdom",
    location: "Manchester, United Kingdom",
    workplace_type: "On-site",
    employment_type: "Full-time",
    seniority: "Junior",
    source: "Indeed",
    status: "new",
    is_favorite: false,
    match_score: 58,
    skills: ["HTML", "CSS", "SCORM", "LMS"],
    matched_skills: ["SCORM", "LMS"],
    missing_skills: ["Captivate"],
    published_at: "2026-08-12T12:00:00.000Z",
    discovered_at: "2026-08-15T15:00:00.000Z",
    source_url: "https://example.com/jobs/elearning-developer",
    description: "Build and maintain e-learning assets, test SCORM packages, and support course deployment.",
    requirements: ["Basic HTML/CSS", "SCORM troubleshooting", "Attention to detail"],
    applications: [],
  },
];

function withApplicationState(job) {
  const application = Array.isArray(job.applications) ? job.applications[0] : null;
  return {
    ...job,
    application,
    application_status: application?.status || null,
  };
}

export async function getJobs() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return sampleJobs.map(withApplicationState);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, applications(id,status,applied_at,next_action,due_at)")
    .order("discovered_at", { ascending: false });

  if (error) {
    console.error("Failed to load jobs", error.message);
    return sampleJobs.map(withApplicationState);
  }

  return (data || []).map(withApplicationState);
}

export async function updateJob(id, updates) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { id, ...updates };

  const { data, error } = await supabase.from("jobs").update(updates).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function upsertDiscoveredJobs(jobs) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !jobs.length) return { inserted: jobs.length, updated: 0 };

  const { data, error } = await supabase
    .from("jobs")
    .upsert(jobs, { onConflict: "canonical_key" })
    .select("id, created_at, updated_at");

  if (error) throw new Error(error.message);

  return {
    inserted: data?.length || 0,
    updated: 0,
  };
}
