const variants = {
  primary: "border-[var(--brand-700)] bg-[var(--brand-700)] text-white hover:bg-[var(--brand-900)]",
  secondary: "border-[var(--line-strong)] bg-white text-[var(--ink-800)] hover:bg-[var(--surface-muted)]",
  ghost: "border-transparent bg-transparent text-[var(--ink-700)] hover:bg-[var(--brand-050)]",
  danger: "border-[var(--danger-700)] bg-[var(--danger-700)] text-white hover:bg-[#7f2d2d]",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-md border font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
