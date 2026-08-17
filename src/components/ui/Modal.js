"use client";

import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ isOpen, title, onClose, children, footer }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(18,32,51,0.55)] p-3 sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-lg border border-[var(--line)] bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-4">
          <h2 className="text-xl font-semibold text-[var(--ink-950)]">{title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="rounded-md p-2 text-[var(--ink-600)] hover:bg-[var(--ink-050)]"
          >
            <FiX aria-hidden />
          </button>
        </div>
        <div className="max-h-[calc(92vh-136px)] overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="border-t border-[var(--line)] bg-[var(--surface-muted)] px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
