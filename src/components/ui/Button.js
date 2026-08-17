const variants = {
  primary: "border-[var(--brand-700)] bg-[var(--brand-700)] text-white shadow-sm hover:border-[var(--brand-900)] hover:bg-[var(--brand-900)] hover:shadow-md active:translate-y-px",
  secondary: "border-[var(--line-strong)] bg-white text-[var(--ink-800)] shadow-sm hover:border-[var(--brand-600)] hover:bg-[var(--brand-050)] hover:text-[var(--brand-900)] hover:shadow-md active:translate-y-px",
  ghost: "border-transparent bg-transparent text-[var(--ink-700)] hover:bg-[var(--brand-050)] hover:text-[var(--brand-900)] active:translate-y-px",
  danger: "border-[var(--danger-700)] bg-[var(--danger-700)] text-white shadow-sm hover:bg-[#7f2d2d] hover:shadow-md active:translate-y-px",
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
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border font-medium transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
