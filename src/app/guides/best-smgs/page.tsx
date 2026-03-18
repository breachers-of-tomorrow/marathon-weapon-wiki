import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best SMGs in Marathon | CQC Meta Guide",
  description: "Bully vs V22 Volt Thrower vs Copperhead vs BRRT. Which SMG is the fastest killing in Marathon? Detailed TTK and DPS analysis for close quarters combat.",
};

export default function SmgGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "SMG Comparison: CQC Dominance",
    "description": "Why the Bully SMG is the top dueling pick and how every SMG stacks up in Marathon.",
    "author": { "@type": "Organization", "name": "Marathon Weapon Wiki" },
    "datePublished": "2026-03-18",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://marathon-weapon-wiki.com/guides/best-smgs" },
    "hasPart": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the fastest killing SMG in Marathon?",
            "acceptedAnswer": { "@type": "Answer", "text": "The Bully SMG and Copperhead RF are tied for the fastest headshot TTK at 0.667s on white shields, with the Bully offering better flinch utility." }
          },
          {
            "@type": "Question",
            "name": "How does the V22 Volt Thrower compare?",
            "acceptedAnswer": { "@type": "Answer", "text": "The V22 Volt Thrower has the highest SMG DPS at 152.1 and a lock-on system for consistent damage, but its 1.0x headshot multiplier means headshots don't help." }
          },
          {
            "@type": "Question",
            "name": "Is the BRRT SMG good?",
            "acceptedAnswer": { "@type": "Answer", "text": "The BRRT SMG has a misleading 1000 RPM burst rate, but the delay between bursts drops its effective RPM to 556 and DPS to 101.93, making it the slowest-killing SMG." }
          },
          {
            "@type": "Question",
            "name": "Why is the Bully SMG considered the best for 1v1s?",
            "acceptedAnswer": { "@type": "Answer", "text": "The Bully SMG uses Heavy Rounds which cause severe flinch, making it incredibly difficult for opponents to return fire accurately. It also has a fast 0.667s headshot TTK." }
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
          SMG Comparison: CQC Dominance
        </h1>
        <div className="text-dim mt-4 flex items-center gap-4 font-mono text-xs uppercase tracking-wider">
          <span>By Marathon Weapon Wiki</span>
          <span className="bg-panel px-2 py-0.5 rounded text-accent">Strategic Guide</span>
        </div>
      </div>

      <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-foreground prose-p:text-dim prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-accent hover:prose-a:underline">
        <p className="text-xl italic">Submachine guns are defined by their ability to delete targets at point-blank range. The current meta rewards consistency and flinch over raw burst speed.</p>

        <div className="cryo-panel my-8 p-6">
          <h2 className="mb-4 mt-0 text-xl font-bold text-accent">The Verdict: Bully SMG is the Dueling King</h2>
          <p className="mb-0">With a 0.667s headshot TTK and Heavy Rounds that cripple your opponent&apos;s aim, the Bully SMG wins more real-world 1v1s than any other SMG.</p>
        </div>

        <h3>Bully SMG: The 1v1 Duelist</h3>
        <p>The Bully SMG is the top pick for close-quarters combat. Its 135 DPS and 0.667s headshot TTK (white shields) are strong on paper, but its true strength lies in <strong>Heavy Rounds</strong>, which inflict severe flinch on opponents, making it incredibly difficult for them to return fire accurately. With 62 accuracy and a 1s body TTK, it is the most stable SMG in its class. If you want a weapon that wins the 1v1 by disrupting your enemy&apos;s aim, the Bully is the definitive choice.</p>

        <div className="grid gap-4 md:grid-cols-2 my-6">
          <div className="cryo-panel p-4 text-center">
            <span className="block font-mono text-xs uppercase tracking-widest text-accent mb-1">Bully DPS</span>
            <span className="text-4xl font-bold text-foreground">135</span>
          </div>
          <div className="cryo-panel p-4 text-center">
            <span className="block font-mono text-xs uppercase tracking-widest text-accent mb-1">Bully HS TTK (White)</span>
            <span className="text-4xl font-bold text-foreground">0.667s</span>
          </div>
        </div>

        <h3>V22 Volt Thrower: Highest DPS, Zero Aim Needed</h3>
        <p>The V22 Volt Thrower leads all SMGs with 152.1 DPS and a 0.828s body TTK on white shields. Its smart lock-on system ensures that almost every shot finds its mark. It has a flat 1.0x headshot multiplier, meaning you don&apos;t need to aim for the head to get maximum value. For mobile players who focus on movement rather than precision, the V22 is the superior tactical choice.</p>

        <h3>Copperhead RF: The Trigger Finger Specialist</h3>
        <p>The <strong>Copperhead RF</strong> (144 DPS) is a rapid semi-auto that matches the Bully&apos;s 0.667s headshot TTK on white shields. If you have a fast trigger finger it can be devastating, but its semi-auto nature makes it less forgiving in chaotic fights. It sits comfortably in the middle of the pack for those who can handle the fire rate.</p>

        <h3>BRRT SMG: The Burst Trap</h3>
        <p>The BRRT SMG looks terrifying on the stat sheet with its 1000 RPM burst rate and 35-round magazine. However, it is a <strong>burst weapon</strong> with a significant delay between bursts that drops its effective RPM to just 556. This brings its real DPS down to 101.93 — the lowest of any SMG. Its headshot TTK of 0.971s and body TTK of 1.295s on white shields make it significantly slower than every competitor. The large magazine and 27m range are nice, but they don&apos;t compensate for being the slowest killer in its class.</p>

        <div className="bg-panel/50 my-12 border-l-4 border-accent p-8 rounded-r-lg">
          <h3 className="mt-0 text-foreground">SMG Rankings</h3>
          <ol className="mb-0 list-decimal pl-5 space-y-2">
            <li><strong>Bully SMG</strong> (The 1v1 Duelist / Flinch Specialist)</li>
            <li><strong>V22 Volt Thrower</strong> (Highest DPS / The Consistency King)</li>
            <li><strong>Copperhead RF</strong> (The Semi-Auto Specialist)</li>
            <li><strong>BRRT SMG</strong> (Burst Delay Kills Its Potential)</li>
          </ol>
        </div>

        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display uppercase tracking-widest text-foreground text-2xl mb-8">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h4 className="text-foreground font-bold mb-2">What is the fastest killing SMG in Marathon?</h4>
              <p>The Bully SMG and Copperhead RF are tied for the fastest headshot TTK at 0.667s on white shields. The Bully is generally preferred for its Heavy Rounds flinch effect.</p>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-2">How does the V22 Volt Thrower compare?</h4>
              <p>The V22 Volt Thrower has the highest SMG DPS at 152.1 and a lock-on system for consistent damage, but its 1.0x headshot multiplier means headshots don&apos;t help. It excels at mobility and tracking targets.</p>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-2">Is the BRRT SMG good?</h4>
              <p>Despite its impressive 1000 RPM burst rate and 35-round magazine, the BRRT SMG has a burst delay that drops its effective RPM to 556 and DPS to just 101.93, making it the slowest-killing SMG in the game.</p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
