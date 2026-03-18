import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tactical Guides & Comparisons | Marathon Weapon Wiki",
  description: "Detailed weapon comparisons, meta-rankings, and tactical guides for Marathon. Find the best Assault Rifles, SMGs, and Precision weapons.",
};

const guides = [
  {
    title: "The Assault Rifle Meta",
    slug: "best-assault-rifles",
    description: "Comparing the Impact HAR, Overrun AR, and M77 to find the best mid-range tool.",
    category: "Primary Weapons",
    date: "March 2026",
  },
  {
    title: "SMG Comparison: CQC Dominance",
    slug: "best-smgs",
    description: "Why the BRRT SMG is currently unstoppable and which alternatives you should consider.",
    category: "Primary Weapons",
    date: "March 2026",
  },
  {
    title: "Precision Rifles: Long Range Analysis",
    slug: "best-precision-rifles",
    description: "Deep dive into DPS vs. Range between the Twin Tap HBR and Hardline PR.",
    category: "Precision Weapons",
    date: "March 2026",
  },
  {
    title: "The Ultimate Arsenal: Best Overall",
    slug: "best-overall-weapon",
    description: "The definitive ranking of every weapon in the game. What is the one gun you need?",
    category: "Meta Analysis",
    date: "March 2026",
  },
];

export default function GuidesPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12">
      <div className="mb-12">
        <h1 className="font-display text-3xl font-bold uppercase tracking-widest text-foreground heading-glow">
          Tactical Analysis & Guides
        </h1>
        <p className="text-dim mt-2 font-mono text-sm uppercase tracking-wide">
          In-depth data analysis and meta-rankings for the Marathon ecosystem.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="cryo-panel group flex flex-col justify-between p-6 transition-all hover:border-border-accent hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="bg-panel rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                  {guide.category}
                </span>
                <span className="text-dim font-mono text-[10px] uppercase tracking-wider">
                  {guide.date}
                </span>
              </div>
              <h2 className="mb-2 font-display text-xl font-bold uppercase tracking-wider text-foreground group-hover:text-accent transition-colors">
                {guide.title}
              </h2>
              <p className="text-dim text-sm leading-relaxed">
                {guide.description}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent group-hover:translate-x-1 transition-transform">
              Read Analysis &rarr;
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
