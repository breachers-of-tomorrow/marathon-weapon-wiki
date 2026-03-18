import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Precision Rifles in Marathon | Range vs DPS",
  description: "Comparing the Twin Tap HBR, Hardline PR, and Stryder M1T to find the best long-range tool in Marathon. Detailed TTK and range analysis.",
};

export default function PrecisionGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Precision Rifles: Long Range Analysis",
    "description": "Deep dive into DPS vs. Range between the Twin Tap HBR and Hardline PR in Marathon.",
    "author": { "@type": "Organization", "name": "Marathon Weapon Wiki" },
    "datePublished": "2026-03-18",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://marathon-weapon-wiki.com/guides/best-precision-rifles" },
    "hasPart": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Which Precision Rifle has the best range?",
            "acceptedAnswer": { "@type": "Answer", "text": "The Hardline PR has the best effective range in the category at 89 meters." }
          },
          {
            "@type": "Question",
            "name": "What is the headshot TTK for the Twin Tap HBR?",
            "acceptedAnswer": { "@type": "Answer", "text": "The Twin Tap HBR has a lethal headshot TTK of 0.571s, the fastest in its category." }
          },
          {
            "@type": "Question",
            "name": "Which PR is best for stability and handling?",
            "acceptedAnswer": { "@type": "Answer", "text": "The Stryder M1T is considered the best for stability and handling, making it the most forgiving to use under fire." }
          }
        ]
      }
    ]
  };

  return (
    <article className="mx-auto min-h-screen max-w-4xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Link href="/guides" className="text-dim hover:text-accent mb-8 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide transition-colors">
        &larr; Back to Guides
      </Link>

      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold uppercase tracking-widest text-foreground heading-glow lg:text-5xl">
          Precision Rifles: Long Range Analysis
        </h1>
        <div className="text-dim mt-4 flex items-center gap-4 font-mono text-xs uppercase tracking-wider">
          <span>By Marathon Weapon Wiki</span>
          <span className="bg-panel px-2 py-0.5 rounded text-accent">Strategic Guide</span>
        </div>
      </div>

      <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-foreground prose-p:text-dim prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-accent hover:prose-a:underline">
        <p className="text-xl italic">Precision Rifles (PRs) are the backbone of long-range support, and the choice between the Twin Tap HBR, Hardline PR, and Stryder M1T comes down to whether you value DPS or absolute distance.</p>

        <div className="cryo-panel my-8 p-6">
          <h2 className="mb-4 mt-0 text-xl font-bold text-accent">The Verdict: Twin Tap HBR for DPS, Hardline for Range</h2>
          <p className="mb-0">While both are precision tools, they operate at different ends of the long-range spectrum.</p>
        </div>

        <h3>Twin Tap HBR: The Mid-Range Shredder</h3>
        <p>The Twin Tap HBR is the statistical outlier of the group. It delivers two rounds per burst at 420 RPM, resulting in a category-leading 119 DPS. Its TTK is surprisingly fast for a precision weapon, clocking in at 1.143s for body shots and a lethal 0.571s for headshots. If you are fighting at 40-50m, there is no better weapon to suppress and eliminate targets quickly.</p>

        <div className="grid gap-4 md:grid-cols-2 my-6">
          <div className="cryo-panel p-4">
            <span className="block font-mono text-xs uppercase tracking-widest text-accent mb-1">Max DPS</span>
            <span className="text-2xl font-bold text-foreground">119</span>
          </div>
          <div className="cryo-panel p-4">
            <span className="block font-mono text-xs uppercase tracking-widest text-accent mb-1">Headshot TTK</span>
            <span className="text-2xl font-bold text-foreground">0.571s</span>
          </div>
        </div>

        <h3>Hardline PR: The Long Reach</h3>
        <p>If the Twin Tap is for the frontline, the Hardline PR is for the overwatch. It features a massive 89m range and a high 1.8x precision multiplier. While its 105 DPS is lower than the Twin Tap, its ability to maintain 28 damage per shot across the map makes it the most reliable tool for picking off enemies before they even see you.</p>

        <h3>Stryder M1T: The Stable Platform</h3>
        <p>The Stryder sits in the middle with 103 DPS and an 84m range. Its primary advantage is handling; with 12 rounds in the mag and better recoil control than the Hardline, it is the best choice for players who need to land consecutive shots while under fire.</p>

        <div className="bg-panel/50 my-12 border-l-4 border-accent p-8 rounded-r-lg">
          <h3 className="mt-0 text-foreground">Precision Rankings</h3>
          <ol className="mb-0 list-decimal pl-5 space-y-2">
            <li><strong>Twin Tap HBR</strong> (Best TTK/Mid-Range)</li>
            <li><strong>Hardline PR</strong> (Best Range/Long-Distance)</li>
            <li><strong>Stryder M1T</strong> (Best Handling)</li>
          </ol>
        </div>

        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display uppercase tracking-widest text-foreground text-2xl mb-8">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h4 className="text-foreground font-bold mb-2">Which Precision Rifle has the best range?</h4>
              <p>The Hardline PR has the best effective range in the category at 89 meters, making it the most reliable for extreme distance engagements.</p>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-2">What is the headshot TTK for the Twin Tap HBR?</h4>
              <p>The Twin Tap HBR has a lethal headshot TTK of 0.571s, which is exceptionally fast and allows it to contest close-range weapons if accurate.</p>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-2">Which PR is best for stability and handling?</h4>
              <p>The Stryder M1T is considered the best for stability and handling, offering 12 rounds in the magazine and superior recoil control for easier follow-up shots.</p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
