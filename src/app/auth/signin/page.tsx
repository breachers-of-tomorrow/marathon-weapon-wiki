"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Glow effect behind card */}
      <div className="absolute h-64 w-64 rounded-full bg-accent/5 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="font-display text-2xl font-bold uppercase tracking-widest text-foreground heading-glow"
          >
            Marathon Weapon Wiki
          </Link>
          <p className="mt-3 font-mono text-sm uppercase tracking-wider text-dim">
            Sign in to access builds &amp; more
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded border border-danger/50 bg-danger/10 px-4 py-3 text-center text-sm text-danger">
            {error === "OAuthAccountNotLinked"
              ? "This email is already associated with another provider. Please sign in with the original provider."
              : "An error occurred during sign in. Please try again."}
          </div>
        )}

        {/* Sign in card */}
        <div className="cryo-panel rounded-lg p-8">
          <div className="space-y-4">
            {/* Bungie button */}
            <button
              onClick={() => signIn("bungie", { callbackUrl })}
              className="group flex w-full items-center justify-center gap-3 rounded border border-border bg-panel px-4 py-3 font-mono text-sm uppercase tracking-wider text-foreground transition-all hover:border-border-accent hover:bg-panel-hover hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]"
            >
              <img
                src="https://download.logo.wine/logo/Bungie/Bungie-Logo.wine.png"
                alt="Bungie"
                className="h-5 w-auto brightness-0 invert"
              />
              Sign in with Bungie
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="font-mono text-xs uppercase tracking-wider text-dim">
                or
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Discord button */}
            <button
              onClick={() => signIn("discord", { callbackUrl })}
              className="group flex w-full items-center justify-center gap-3 rounded border border-[#5865F2]/40 bg-[#5865F2]/10 px-4 py-3 font-mono text-sm uppercase tracking-wider text-foreground transition-all hover:border-[#5865F2] hover:bg-[#5865F2]/20 hover:shadow-[0_0_20px_rgba(88,101,242,0.25)]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Sign in with Discord
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center font-mono text-xs text-dim">
          Part of the{" "}
          <span className="text-accent">BREACHER.NET</span> ecosystem
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
