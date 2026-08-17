export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface-muted)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-1 px-4 py-5 text-sm text-[var(--ink-600)] sm:px-6 lg:px-8">
        <span className="font-semibold text-[var(--ink-800)]">JonJobs - Search & Application</span>
        <span>Personal Job Search CRM</span>
      </div>
    </footer>
  );
}
