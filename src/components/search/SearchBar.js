"use client";

import { FiSearch } from "react-icons/fi";

export default function SearchBar({ value, onChange, placeholder = "Search stored jobs" }) {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <FiSearch aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-500)]" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-[var(--line-strong)] bg-white pl-10 pr-3 text-sm shadow-sm focus:border-[var(--brand-600)] focus:outline-2"
      />
    </label>
  );
}
