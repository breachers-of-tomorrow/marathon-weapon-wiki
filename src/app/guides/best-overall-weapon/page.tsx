import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Overall Weapon in Marathon | Ultimate Meta Analysis",
  description: "The definitive ranking of every weapon in Marathon. What is the one gun you need? Analyzing the BRRT SMG and Impact HAR.",
};

export default function OverallGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The Ultimate Arsenal: Best Overall",
    "description": "The definitive ranking of every weapon in the Marathon game. What is the best gun overall?",
    "author": { "@type": "Organization", "name": "Marathon Weapon Wiki" },
    "datePublished": "2026-03-18",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://marathon-weapon-wiki.com/guides/best-overall-weapon" },
    "hasPart": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the best weapon overall in Marathon?",
            "acceptedAnswer": { "@type": "Answer", "text": "The BRRT SMG and Impact HAR are currently the top-tier weapons, depending on engagement range." }
          },
          {
            "@type": "Question",
            "name": "Why is the BRRT SMG considered the best close-range weapon?",
            "acceptedAnswer": { "@type": "Answer", "text": "Its massive 183.33 DPS and 35-round magazine make it the most efficient killing machine in close-quarters combat." }
          },
          {
            "@type": "Question",
            "name": "Is there a weapon that counters aggressive play?",
            "acceptedAnswer": { "@type": "Answer", "text": "The WSTR Combat Shotgun is the ultimate counter with its 485 burst DPS, but it requires high skill due to its 2-round magazine." }
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
          The Ultimate Arsenal: Best Overall
        </h1>
        <div className="text-dim mt-4 flex items-center gap-4 font-mono text-xs uppercase tracking-wider">
          <span>By Marathon Weapon Wiki</span>
          <span className="bg-panel px-2 py-0.5 rounded text-accent">Meta Analysis</span>
        </div>
      </div>

      <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-foreground prose-p:text-dim prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-accent hover:prose-a:underline">
        <p className="text-xl italic">After analyzing every weapon in the Marathon database, two guns stand above the rest as the &quot;Best Overall&quot; depending on your engagement distance.</p>

        <div className="cryo-panel my-8 p-6">
          <h2 className="mb-4 mt-0 text-xl font-bold text-accent">The Verdict: BRRT SMG and Impact HAR Tie for the Throne</h2>
          <p className="mb-0">Whether you are clearing rooms or holding overwatch, these two weapons represent the pinnacle of current tactical performance.</p>
        </div>

        <h3>The Close-Range Champion: BRRT SMG</h3>
        <p>If you look at the raw numbers, the BRRT SMG is the most efficient weapon in the game. Its 183.33 DPS is higher than every other primary weapon. It has a larger magazine than most ARs and a TTK that outclasses almost everything in the mid-range. For any indoor engagement or extract defense, the BRRT is the definitive &quot;Best in Slot&quot; weapon.</p>

        <div className="grid gap-4 md:grid-cols-2 my-6">
          <div className="cryo-panel p-4 text-center">
            <span className="block font-mono text-xs uppercase tracking-widest text-accent mb-1">CQC Winner</span>
            <span className="text-3xl font-bold text-foreground">BRRT SMG</span>
          </div>
          <div className="cryo-panel p-4 text-center">
            <span className="block font-mono text-xs uppercase tracking-widest text-accent mb-1">Range Winner</span>
            <span className="text-3xl font-bold text-foreground">Impact HAR</span>
          </div>
        </div>

        <h3>The Mid-Range Champion: Impact HAR</h3>
        <p>While the BRRT wins on speed, the Impact HAR wins on tactical superiority. Its 0.6s headshot TTK allows it to compete with SMGs, but its 60m range allows it to contest Snipers and Precision Rifles. In the unpredictable world of Marathon, versatility is life. The Impact HAR allows you to engage at any distance with lethal efficiency, provided you have the aim to back it up.</p>

        <h3>The &quot;Delete Button&quot;: WSTR Combat Shotgun</h3>
        <p>Special mention must go to the WSTR Combat Shotgun. With a burst DPS of 485, it is technically the &quot;fastest&quot; killer in the game at 0-4 meters. However, its 2-round magazine and 1.3 RPM fire rate make it a high-risk tool. It isn&apos;t the best weapon, but it is the best counter to aggressive players.</p>

        <div className="bg-panel/50 my-12 border-l-4 border-accent p-8 rounded-r-lg">
          <h3 className="mt-0 text-foreground">Overall Rankings</h3>
          <ol className="mb-0 list-decimal pl-5 space-y-2">
            <li><strong>BRRT SMG</strong> (Highest sustained CQC power)</li>
            <li><strong>Impact HAR</strong> (Most versatile lethal precision)</li>
            <li><strong>Twin Tap HBR</strong> (Best balance of DPS and range)</li>
          </ol>
        </div>

        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display uppercase tracking-widest text-foreground text-2xl mb-8">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h4 className="text-foreground font-bold mb-2">What is the best weapon overall in Marathon?</h4>
              <p>The BRRT SMG and Impact HAR are currently the top-tier weapons, depending on your engagement range. The BRRT is dominant at close range, while the Impact HAR is the most versatile at mid-to-long distance.</p>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-2">Why is the BRRT SMG considered the best close-range weapon?</h4>
              <p>Its massive 183.33 DPS and 35-round magazine make it the most efficient killing machine in close-quarters combat, outperforming all other SMGs and ARs in raw TTK.</p>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-2">Is there a weapon that counters aggressive play?</h4>
              <p>The WSTR Combat Shotgun is the ultimate counter with its 485 burst DPS, capable of instantly neutralizing aggressive rushers at short range, though its small magazine requires precise timing.</p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
