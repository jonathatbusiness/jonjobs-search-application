export default function Select({ label, id, children, className = "", ...props }) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-[var(--ink-700)]">{label}</span>
      ) : null}
      <select
        id={id}
        className={`h-10 w-full rounded-md border border-[var(--line-strong)] bg-white px-3 text-sm text-[var(--ink-900)] shadow-sm transition focus:border-[var(--brand-600)] focus:outline-2 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
