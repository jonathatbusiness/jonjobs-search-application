import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
      <section className="w-full max-w-sm rounded-lg border border-[var(--line)] bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--brand-950)]">JonJobs</h1>
          <p className="mt-1 text-sm font-medium text-[var(--ink-600)]">Search & Application</p>
          <p className="mt-4 text-sm text-[var(--ink-600)]">Personal Job Search CRM</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
