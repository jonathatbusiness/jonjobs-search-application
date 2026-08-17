export default function Input({ label, id, className = "", ...props }) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-[var(--ink-700)]">{label}</span>
      ) : null}
      <input
        id={id}
        className={`h-10 w-full rounded-md border border-[var(--line-strong)] bg-white px-3 text-sm text-[var(--ink-900)] shadow-sm transition placeholder:text-[var(--ink-400)] focus:border-[var(--brand-600)] focus:outline-2 ${className}`}
        {...props}
      />
    </label>
  );
}
