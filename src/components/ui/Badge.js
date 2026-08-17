const variants = {
  default: "border-[var(--line)] bg-white text-[var(--ink-700)]",
  brand: "border-[var(--brand-100)] bg-[var(--brand-050)] text-[var(--brand-800)]",
  accent: "border-[var(--accent-100)] bg-[var(--accent-050)] text-[var(--accent-700)]",
  success: "border-[var(--success-100)] bg-[var(--success-100)] text-[var(--success-700)]",
  warning: "border-[var(--warning-100)] bg-[var(--warning-100)] text-[var(--warning-700)]",
  danger: "border-[var(--danger-100)] bg-[var(--danger-100)] text-[var(--danger-700)]",
};

export default function Badge({ children, variant = "default", className = "" }) {
  return (
    <span
      className={`inline-flex min-h-6 items-center rounded-full border px-2.5 py-1 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
