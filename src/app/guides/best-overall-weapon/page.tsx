import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Overall Weapon in Marathon | Ultimate Meta Analysis",
  description: "The definitive ranking of every weapon in Marathon. What is the one gun you need? Analyzing the Impact HAR, Bully SMG, and more.",
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
            "acceptedAnswer": { "@type": "Answer", "text": "The Impact HAR is the best overall weapon due to its 0.6s headshot TTK, 60m range, and versatility across all engagement distances." }
          },
          {
            "@type": "Question",
            "name": "What is the best close-range weapon in Marathon?",
            "acceptedAnswer": { "@type": "Answer", "text": "The Bully SMG is the best close-range weapon thanks to its 0.667s headshot TTK and Heavy Rounds flinch effect that disrupts opponents' aim." }
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
        <p className="text-xl italic">After analyzing every weapon in the Marathon database, one gun stands above the rest for pure versatility, with a close-range specialist right behind it.</p>

        <div className="cryo-panel my-8 p-6">
          <h2 className="mb-4 mt-0 text-xl font-bold text-accent">The Verdict: Impact HAR is the Best Overall Weapon</h2>
          <p className="mb-0">The Impact HAR&apos;s combination of a 0.6s headshot TTK and 60m range makes it lethal at every distance. Pair it with a Bully SMG for close quarters and you have the strongest loadout in the game.</p>
        </div>

        <h3>The Overall Champion: Impact HAR</h3>
        <p>The Impact HAR wins on tactical superiority. Its 0.6s headshot TTK on white shields allows it to compete with SMGs up close, while its 60m range lets it contest Snipers and Precision Rifles. With 120 DPS and a 1.6x headshot multiplier, it rewards precision at any distance. In the unpredictable world of Marathon, versatility is life. The Impact HAR allows you to engage at any range with lethal efficiency, provided you have the aim to back it up.</p>

        <div className="grid gap-4 md:grid-cols-2 my-6">
          <div className="cryo-panel p-4 text-center">
            <span className="block font-mono text-xs uppercase tracking-widest text-accent mb-1">Best Overall</span>
            <span className="text-3xl font-bold text-foreground">Impact HAR</span>
          </div>
          <div className="cryo-panel p-4 text-center">
            <span className="block font-mono text-xs uppercase tracking-widest text-accent mb-1">Best CQC</span>
            <span className="text-3xl font-bold text-foreground">Bully SMG</span>
          </div>
        </div>

        <h3>The Close-Range Champion: Bully SMG</h3>
        <p>The Bully SMG is the definitive close-quarters weapon. Its 135 DPS and 0.667s headshot TTK are strong, but the real edge comes from <strong>Heavy Rounds</strong> that inflict severe flinch, crippling your opponent&apos;s ability to fight back. For any indoor engagement or extract defense, the Bully is the &quot;Best in Slot&quot; CQC weapon.</p>

        <h3>The &quot;Delete Button&quot;: WSTR Combat Shotgun</h3>
        <p>Special mention must go to the WSTR Combat Shotgun. With a burst DPS of 485, it is technically the &quot;fastest&quot; killer in the game at 0-4 meters. However, its 2-round magazine and 1.3 RPM fire rate make it a high-risk tool. It isn&apos;t the best weapon, but it is the best counter to aggressive players.</p>

        <div className="bg-panel/50 my-12 border-l-4 border-accent p-8 rounded-r-lg">
          <h3 className="mt-0 text-foreground">Overall Rankings</h3>
          <ol className="mb-0 list-decimal pl-5 space-y-2">
            <li><strong>Impact HAR</strong> (Most versatile lethal precision)</li>
            <li><strong>Bully SMG</strong> (Best CQC duelist / Flinch specialist)</li>
            <li><strong>Twin Tap HBR</strong> (Best balance of DPS and range)</li>
          </ol>
        </div>

        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display uppercase tracking-widest text-foreground text-2xl mb-8">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h4 className="text-foreground font-bold mb-2">What is the best weapon overall in Marathon?</h4>
              <p>The Impact HAR is the best overall weapon thanks to its 0.6s headshot TTK on white shields, 120 DPS, and 60m range, making it effective at every engagement distance.</p>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-2">What is the best close-range weapon?</h4>
              <p>The Bully SMG is the best CQC weapon with its 0.667s headshot TTK and Heavy Rounds that cause severe flinch, disrupting opponents&apos; aim in 1v1 duels.</p>
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
