"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function KeywordChips({ label, values, onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  function addValue() {
    const value = draft.trim();
    if (!value || values.includes(value)) return;
    onChange([...values, value]);
    setDraft("");
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--ink-700)]">{label}</label>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addValue();
            }
          }}
          placeholder={placeholder}
          className="h-10 min-w-0 flex-1 rounded-md border border-[var(--line-strong)] bg-white px-3 text-sm shadow-sm focus:border-[var(--brand-600)] focus:outline-2"
        />
        <Button type="button" variant="secondary" onClick={addValue}>
          Add
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(values.filter((item) => item !== value))}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--ink-700)]"
          >
            {value}
            <FiX aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}
