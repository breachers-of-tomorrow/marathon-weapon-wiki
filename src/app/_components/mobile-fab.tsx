"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Plus, X, MessageSquarePlus } from "lucide-react";

/**
 * Mobile floating action button that expands to reveal search + GitHub links.
 * Visible only on small screens (md:hidden). Replaces the static GitHub icon
 * that previously sat in the same position.
 */
export function MobileFab() {
  const [open, setOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  /* close on outside tap */
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent | TouchEvent) {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [open]);

  /* close when command palette opens (user tapped search) */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function triggerSearch() {
    setOpen(false);
    /* tiny delay so the FAB closes before the palette opens */
    requestAnimationFrame(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "k",
          ctrlKey: true,
          bubbles: true,
        }),
      );
    });
  }

  return (
    <div ref={fabRef} className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3 md:hidden">
      {/* ── Main toggle ── */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className={`flex h-12 w-12 items-center justify-center rounded-full border border-border shadow-lg transition-all duration-300 ${
          open
            ? "rotate-45 bg-panel border-border-accent shadow-[0_0_18px_rgba(0,212,255,0.4)]"
            : "cryo-panel hover:border-border-accent hover:shadow-[0_0_12px_rgba(0,212,255,0.3)]"
        }`}
      >
        {open ? (
          <X size={20} className="text-foreground -rotate-45" />
        ) : (
          <Plus size={22} className="text-dim" />
        )}
      </button>

      {/* ── Expanded items ── */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-300 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
        aria-hidden={!open}
      >
        {/* Search */}
        <button
          type="button"
          onClick={triggerSearch}
          className="group flex items-center gap-2"
        >
          <span className="rounded border border-border bg-panel px-2 py-1 font-mono text-[11px] text-dim opacity-0 transition-opacity group-hover:opacity-100">
            Search
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border cryo-panel shadow-md transition-all hover:border-border-accent hover:shadow-[0_0_12px_rgba(0,212,255,0.3)]">
            <Search size={16} className="text-dim group-hover:text-foreground" />
          </span>
        </button>

        {/* Provide Data */}
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            requestAnimationFrame(() => {
              window.dispatchEvent(new Event("open-submit-data"));
            });
          }}
          className="group flex items-center gap-2"
        >
          <span className="rounded border border-border bg-panel px-2 py-1 font-mono text-[11px] text-dim opacity-0 transition-opacity group-hover:opacity-100">
            Submit Data
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border cryo-panel shadow-md transition-all hover:border-border-accent hover:shadow-[0_0_12px_rgba(0,212,255,0.3)]">
            <MessageSquarePlus size={16} className="text-dim group-hover:text-foreground" />
          </span>
        </button>

        {/* GitHub */}
        <a
          href="https://github.com/LeonardM01/marathon-weapon-wiki/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="rounded border border-border bg-panel px-2 py-1 font-mono text-[11px] text-dim opacity-0 transition-opacity group-hover:opacity-100">
            Contribute
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border cryo-panel shadow-md transition-all hover:border-border-accent hover:shadow-[0_0_12px_rgba(0,212,255,0.3)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-dim group-hover:text-foreground"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}
