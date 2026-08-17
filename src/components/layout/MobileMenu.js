"use client";

import { useState } from "react";
import Link from "next/link";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";

export default function MobileMenu({ links, pathname, automationEnabled, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="rounded-md p-2 text-[var(--ink-700)] hover:bg-[var(--ink-050)]"
      >
        {open ? <FiX aria-hidden /> : <FiMenu aria-hidden />}
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-16 border-b border-[var(--line)] bg-white px-4 py-4 shadow-lg">
          <div className="mb-3 flex items-center gap-2 text-sm text-[var(--ink-600)]">
            <span
              className={`h-2 w-2 rounded-full ${automationEnabled ? "bg-[var(--success-700)]" : "bg-[var(--ink-300)]"}`}
            />
            Automation {automationEnabled ? "ON" : "OFF"}
          </div>
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-3 text-sm font-medium ${
                    active ? "bg-[var(--brand-050)] text-[var(--brand-800)]" : "text-[var(--ink-700)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={onLogout}
              className="mt-2 flex items-center gap-2 rounded-md px-3 py-3 text-left text-sm font-medium text-[var(--ink-700)] hover:bg-[var(--ink-050)]"
            >
              <FiLogOut aria-hidden />
              Logout
            </button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
