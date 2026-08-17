import { buildBooleanQuery } from "@/services/search/query";

export function createPublicIndexProvider(source) {
  return {
    id: `public-index-${source.toLowerCase()}`,
    name: `${source} public index`,
    source,
    async discover(profile) {
      const query = buildBooleanQuery({
        ...profile,
        include_keywords: [`site:${source === "LinkedIn" ? "linkedin.com/jobs" : "indeed.com"}`, ...(profile.include_keywords || [])],
      });

      return {
        jobs: [],
        status: "pending",
        message: `Provider prepared query but did not fetch ${source}; a search API or approved public-index provider is required.`,
        query,
      };
    },
  };
}
