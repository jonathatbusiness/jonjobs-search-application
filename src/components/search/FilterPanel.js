"use client";

import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

const filterOptions = {
  country: ["Any", "Ireland", "Canada", "United Kingdom", "Brazil"],
  workplace_type: ["Any", "Remote", "Hybrid", "On-site", "Unknown"],
  employment_type: ["Any", "Full-time", "Part-time", "Contract", "Temporary", "Internship", "Unknown"],
  seniority: ["Any", "Entry", "Junior", "Mid", "Senior", "Lead", "Manager", "Unknown"],
  source: ["Any", "LinkedIn", "Indeed", "Company", "Other"],
  match: ["Any", "80-100", "60-79", "40-59"],
};

export default function FilterPanel({ filters, onChange, onReset }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="grid gap-4 rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(filterOptions).map(([key, options]) => (
          <Select
            key={key}
            label={key.replace("_", " ")}
            value={filters[key] || "Any"}
            onChange={(event) => update(key, event.target.value)}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        ))}
      </div>
      <div>
        <Button type="button" variant="secondary" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}
