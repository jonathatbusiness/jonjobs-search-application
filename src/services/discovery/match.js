function textIncludes(text, term) {
  return text.toLowerCase().includes(term.toLowerCase());
}

export function calculateMatch(job, profile = {}) {
  const titleTerms = [profile.primary_title, ...(profile.title_variants || [])].filter(Boolean);
  const keywordTerms = profile.include_keywords || [];
  const workplaceTerms = profile.workplace_types || [];
  const haystack = [job.title, job.company, job.description, job.location, ...(job.skills || [])].filter(Boolean).join(" ");

  let score = 0;
  const matched = new Set();
  const missing = new Set();

  if (titleTerms.length) {
    const titleHit = titleTerms.some((term) => textIncludes(job.title || "", term));
    score += titleHit ? 35 : 10;
    titleTerms.forEach((term) => (textIncludes(job.title || "", term) ? matched.add(term) : missing.add(term)));
  }

  if (keywordTerms.length) {
    const hits = keywordTerms.filter((term) => textIncludes(haystack, term));
    hits.forEach((term) => matched.add(term));
    keywordTerms.filter((term) => !hits.includes(term)).forEach((term) => missing.add(term));
    score += Math.round((hits.length / keywordTerms.length) * 35);
  }

  if (profile.location && textIncludes(job.location || `${job.city || ""} ${job.country || ""}`, profile.location)) {
    score += 15;
  } else if (!profile.location) {
    score += 8;
  }

  if (workplaceTerms.length) {
    score += workplaceTerms.some((term) => textIncludes(job.workplace_type || "", term)) ? 10 : 0;
  } else {
    score += 5;
  }

  score += 5;

  return {
    match_score: Math.max(0, Math.min(100, score)),
    matched_skills: Array.from(matched),
    missing_skills: Array.from(missing),
  };
}
