"use client";

import SearchBar from "@/components/search/SearchBar";
import Select from "@/components/ui/Select";
import { applicationStatuses } from "@/services/applications/constants";

export default function ApplicationFilters({ query, status, onQueryChange, onStatusChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
      <SearchBar value={query} onChange={onQueryChange} placeholder="Search applications" />
      <Select aria-label="Filter application status" value={status} onChange={(event) => onStatusChange(event.target.value)}>
        <option value="All">All statuses</option>
        {applicationStatuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
    </div>
  );
}
