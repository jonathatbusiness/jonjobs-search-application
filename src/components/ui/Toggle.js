"use client";

export default function Toggle({ checked, onChange, label, description, disabled = false }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-md border border-[var(--line)] bg-white p-4">
      <span>
        <span className="block text-sm font-semibold text-[var(--ink-900)]">{label}</span>
        {description ? (
          <span className="mt-1 block text-sm text-[var(--ink-600)]">{description}</span>
        ) : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[var(--brand-700)]" : "bg-[var(--ink-300)]"
        } disabled:opacity-50`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </label>
  );
}
