"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import Button from "@/components/ui/Button";
import MobileMenu from "./MobileMenu";

const links = [
  { href: "/jobs", label: "Jobs" },
  { href: "/search", label: "Search" },
  { href: "/applications", label: "Applications" },
  { href: "/settings", label: "Settings" },
];

export default function Header({ automationEnabled }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/jobs" className="shrink-0">
          <span className="block text-lg font-bold leading-5 text-[var(--brand-950)]">JonJobs</span>
          <span className="block text-xs font-medium text-[var(--ink-500)]">Search & Application</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--brand-050)] text-[var(--brand-800)]"
                    : "text-[var(--ink-600)] hover:bg-[var(--ink-050)] hover:text-[var(--ink-900)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span className="inline-flex items-center gap-2 text-sm text-[var(--ink-600)]">
            <span
              className={`h-2 w-2 rounded-full ${automationEnabled ? "bg-[var(--success-700)]" : "bg-[var(--ink-300)]"}`}
            />
            Automation {automationEnabled ? "ON" : "OFF"}
          </span>
          <Button type="button" variant="ghost" size="sm" onClick={handleLogout} aria-label="Logout">
            <FiLogOut aria-hidden />
          </Button>
        </div>

        <MobileMenu links={links} pathname={pathname} automationEnabled={automationEnabled} onLogout={handleLogout} />
      </div>
    </header>
  );
}
