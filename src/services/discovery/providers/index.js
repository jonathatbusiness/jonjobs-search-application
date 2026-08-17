import { createPublicIndexProvider } from "./publicIndexProvider";

export function getDiscoveryProviders(profile = {}) {
  const requested = profile.sources?.length ? profile.sources : ["LinkedIn", "Indeed", "Company"];
  const providers = [];

  if (requested.includes("LinkedIn")) providers.push(createPublicIndexProvider("LinkedIn"));
  if (requested.includes("Indeed")) providers.push(createPublicIndexProvider("Indeed"));
  if (requested.includes("Company")) providers.push(createPublicIndexProvider("Company"));

  return providers;
}
