export function buildBooleanQuery(profile) {
  const titles = [profile.primaryTitle, ...(profile.titleVariants || [])].filter(Boolean);
  const include = profile.includeKeywords || [];
  const exclude = profile.excludeKeywords || [];
  const location = profile.location ? ` "${profile.location}"` : "";
  const titleQuery = titles.length ? `(${titles.map((term) => `"${term}"`).join(" OR ")})` : "";
  const includeQuery = include.length ? include.map((term) => `"${term}"`).join(" AND ") : "";
  const excludeQuery = exclude.length ? ` ${exclude.map((term) => `-"${term}"`).join(" ")}` : "";
  return [titleQuery, includeQuery].filter(Boolean).join(" AND ") + location + excludeQuery;
}
