"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPaletteTrigger } from "./command-palette";

const NAV_LINKS: { href: string; label: string; dataTour?: string }[] = [
  { href: "/compare", label: "Compare", dataTour: "compare-link" },
  { href: "/builds", label: "Builds" },
  { href: "/guides", label: "Guides" },
];

const navLinkClass =
  "rounded border border-border px-3 py-1 font-mono text-xs uppercase tracking-wider text-dim transition-all hover:border-border-accent hover:text-foreground hover:shadow-[0_0_12px_rgba(0,212,255,0.3)]";

export function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function closeMenu() {
    setMenuOpen(false);
  }

  const authSection =
    status === "loading" ? (
      <div className="h-8 w-24 animate-pulse rounded bg-panel" />
    ) : session?.user ? (
      <div className="flex items-center gap-3">
        {session.user.image && (
          <img
            src={session.user.image}
            alt=""
            className="h-7 w-7 rounded-full border border-border"
          />
        )}
        <span className="hidden text-sm text-foreground sm:inline">
          {session.user.name}
        </span>
        <button
          onClick={() => {
            closeMenu();
            void signOut();
          }}
          className="rounded border border-border px-3 py-1 text-xs uppercase tracking-wider text-dim transition-colors hover:border-border-accent hover:text-foreground"
        >
          Sign Out
        </button>
      </div>
    ) : (
      <Link
        href="/auth/signin"
        onClick={closeMenu}
        className="flex items-center gap-2 rounded border border-border px-3 py-1.5 text-sm uppercase tracking-wider text-foreground transition-all hover:border-border-accent hover:shadow-[0_0_12px_rgba(0,212,255,0.3)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        Sign In
      </Link>
    );

  return (
    <nav className="relative cryo-panel border-b border-border" data-tour="navbar">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-display text-lg font-bold uppercase tracking-widest text-foreground heading-glow"
            onClick={closeMenu}
          >
            Marathon Weapon Wiki
          </Link>

          {/* Hamburger button — mobile only */}
          <button
            className="md:hidden rounded border border-border p-1.5 text-dim transition-colors hover:border-border-accent hover:text-foreground"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-tour={link.dataTour}
                className={navLinkClass}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop: search + auth */}
        <div className="hidden md:flex items-center gap-4">
          <CommandPaletteTrigger />
          {authSection}
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full z-50 border-t border-border cryo-panel px-4 py-3 flex flex-col gap-3 shadow-lg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-tour={link.dataTour}
              onClick={closeMenu}
              className={`${navLinkClass} block w-full text-center py-2 ${
                pathname === link.href
                  ? "border-border-accent text-foreground"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border flex justify-center">
            {authSection}
          </div>
        </div>
      )}
    </nav>
  );
}
