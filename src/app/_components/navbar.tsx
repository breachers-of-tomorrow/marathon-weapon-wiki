"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="cryo-panel border-b border-border" data-tour="navbar">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-display text-lg font-bold uppercase tracking-widest text-foreground heading-glow"
          >
            Marathon Weapon Wiki
          </Link>
          <Link
            href="/compare"
            data-tour="compare-link"
            className="rounded border border-border px-3 py-1 font-mono text-xs uppercase tracking-wider text-dim transition-all hover:border-border-accent hover:text-foreground hover:shadow-[0_0_12px_rgba(0,212,255,0.3)]"
          >
            Compare
          </Link>
          <Link
            href="/guides"
            className="rounded border border-border px-3 py-1 font-mono text-xs uppercase tracking-wider text-dim transition-all hover:border-border-accent hover:text-foreground hover:shadow-[0_0_12px_rgba(0,212,255,0.3)]"
          >
            Guides
          </Link>
        </div>

        <div>
          {status === "loading" ? (
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
                onClick={() => signOut()}
                className="rounded border border-border px-3 py-1 text-xs uppercase tracking-wider text-dim transition-colors hover:border-border-accent hover:text-foreground"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("bungie")}
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
              Sign in with Bungie
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
