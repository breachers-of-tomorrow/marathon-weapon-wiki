import type { Metadata } from "next";
import { TopBuildsPage } from "../_components/top-builds-page";

export const metadata: Metadata = {
  title: "Top Builds — Community-Ranked Weapon Builds",
  description:
    "Browse the highest-rated community weapon builds for Marathon — ranked by upvotes across all weapons.",
};

export default function BuildsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold uppercase tracking-widest text-foreground heading-glow">
          Top Builds
        </h1>
        <p className="text-dim mt-2 font-mono text-sm uppercase tracking-wide">
          Community-Ranked Weapon Builds
        </p>
      </div>

      <TopBuildsPage />
    </main>
  );
}
