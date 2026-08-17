export function buildBooleanQuery(profile) {
  const titles = [profile.primaryTitle || profile.primary_title, ...(profile.titleVariants || profile.title_variants || [])].filter(Boolean);
  const include = profile.includeKeywords || profile.include_keywords || [];
  const exclude = profile.excludeKeywords || profile.exclude_keywords || [];
  const sources = profile.sources || [];
  const workplaces = profile.workplaceTypes || profile.workplace_types || [];
  const location = profile.location ? ` "${profile.location}"` : "";
  const titleQuery = titles.length ? `(${titles.map((term) => `"${term}"`).join(" OR ")})` : "";
  const keywordJoiner = (profile.keywordMode || profile.keyword_mode) === "ANY" ? " OR " : " AND ";
  const includeQuery = include.length ? include.map((term) => `"${term}"`).join(keywordJoiner) : "";
  const workplaceQuery = workplaces.length ? ` (${workplaces.map((term) => `"${term}"`).join(" OR ")})` : "";
  const sourceQuery = sources.length ? ` (${sources.map((term) => `"${term}" jobs`).join(" OR ")})` : "";
  const excludeQuery = exclude.length ? ` ${exclude.map((term) => `-"${term}"`).join(" ")}` : "";
  return [titleQuery, includeQuery].filter(Boolean).join(" AND ") + location + workplaceQuery + sourceQuery + excludeQuery;
}

export function profileToDb(profile) {
  const payload = {
    name: profile.name?.trim(),
    primary_title: profile.primaryTitle?.trim() || profile.primary_title?.trim() || null,
    title_variants: profile.titleVariants || profile.title_variants || [],
    include_keywords: profile.includeKeywords || profile.include_keywords || [],
    exclude_keywords: profile.excludeKeywords || profile.exclude_keywords || [],
    keyword_mode: profile.keywordMode || profile.keyword_mode || "ALL",
    location: profile.location?.trim() || null,
    workplace_types: profile.workplaceTypes || profile.workplace_types || [],
    countries: profile.countries || [],
    sources: profile.sources || [],
    enabled: Boolean(profile.enabled),
  };

  payload.query = buildBooleanQuery(payload);
  return payload;
}

export function profileFromDb(profile) {
  return {
    ...profile,
    primaryTitle: profile.primary_title || "",
    titleVariants: profile.title_variants || [],
    includeKeywords: profile.include_keywords || [],
    excludeKeywords: profile.exclude_keywords || [],
    keywordMode: profile.keyword_mode || "ALL",
    workplaceTypes: profile.workplace_types || [],
  };
}
