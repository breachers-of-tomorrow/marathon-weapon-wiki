import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best SMGs in Marathon | CQC Meta Guide",
  description: "BRRT vs V22 Volt Thrower vs Copperhead. Which SMG is the fastest killing in Marathon? Detailed TTK and DPS analysis for close quarters combat.",
};

export default function SmgGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "SMG Comparison: CQC Dominance",
    "description": "Why the BRRT SMG is currently unstoppable and which alternatives you should consider in Marathon.",
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
            "acceptedAnswer": { "@type": "Answer", "text": "The BRRT SMG is currently the fastest killing SMG with a DPS of 183.33 and a headshot TTK of 0.54s." }
          },
          {
            "@type": "Question",
            "name": "How does the V22 Volt Thrower compare?",
            "acceptedAnswer": { "@type": "Answer", "text": "The V22 Volt Thrower is more consistent due to its lock-on system, but it has a lower DPS of 152.1 compared to the BRRT." }
          },
          {
            "@type": "Question",
            "name": "What is the magazine size of the BRRT SMG?",
            "acceptedAnswer": { "@type": "Answer", "text": "The BRRT SMG features a 35-round magazine, which is the largest in its class." }
          },
          {
            "@type": "Question",
            "name": "Why is the Bully SMG considered the best for 1v1s?",
            "acceptedAnswer": { "@type": "Answer", "text": "The Bully SMG uses Heavy Rounds which cause severe flinch, making it incredibly difficult for opponents to return fire accurately." }
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
        <p className="text-xl italic">Submachine guns are defined by their ability to delete targets at point-blank range, and the current meta has one undisputed champion: the BRRT SMG.</p>

        <div className="cryo-panel my-8 p-6">
          <h2 className="mb-4 mt-0 text-xl font-bold text-accent">The Verdict: BRRT SMG is Unstoppable</h2>
          <p className="mb-0">Statistically, the BRRT SMG is terrifying. It delivers a massive 183.33 DPS—nearly 50% more than the average assault rifle.</p>
        </div>

        <h3>The BRRT Dominance</h3>
        <p>The BRRT SMG delivers a massive 183.33 DPS—nearly 50% more than the average assault rifle. Its burst mechanism allows for a 0.54s headshot TTK, which is fast enough to end a fight before the opponent can react. Combined with a 35-round magazine and a 27m range (matching the Overrun AR), it is currently the most efficient killing machine for close-to-mid transitions.</p>

        <div className="grid gap-4 md:grid-cols-2 my-6">
          <div className="cryo-panel p-4 text-center">
            <span className="block font-mono text-xs uppercase tracking-widest text-accent mb-1">Max DPS</span>
            <span className="text-4xl font-bold text-foreground">183.33</span>
          </div>
          <div className="cryo-panel p-4 text-center">
            <span className="block font-mono text-xs uppercase tracking-widest text-accent mb-1">Mag Size</span>
            <span className="text-4xl font-bold text-foreground">35</span>
          </div>
        </div>

        <h3>V22 Volt Thrower: Consistency over Power</h3>
        <p>The V22 Volt Thrower is the &quot;low floor, high ceiling&quot; alternative. While its 152.1 DPS is lower than the BRRT, its smart lock-on system ensures that almost every shot finds its mark. It has a flat 1.0x headshot multiplier, meaning you don&apos;t need to aim for the head to get maximum value. For mobile players who focus on movement rather than aim, the V22 is the superior tactical choice.</p>

        <h3>Bully SMG: The Stability and Flinch King</h3>
        <p>While the BRRT wins on raw DPS, many in the community consider the <strong>Bully SMG</strong> to be the best overall weapon for real-world engagements. With 62 accuracy and a 1s body TTK, it is significantly more stable than its peers. Its true strength lies in <strong>Heavy Rounds</strong>, which inflict severe flinch on opponents, making it incredibly difficult for them to return fire accurately. If you want a weapon that wins the 1v1 by disrupting your enemy&apos;s aim, the Bully is the definitive choice.</p>

        <h3>Copperhead RF</h3>
        <p>The <strong>Copperhead RF</strong> (144 DPS) is a rapid semi-auto for those with a fast trigger finger. However, in a raw TTK race, it struggles to keep pace with the BRRT&apos;s 0.72s body TTK or the Bully&apos;s utility.</p>

        <div className="bg-panel/50 my-12 border-l-4 border-accent p-8 rounded-r-lg">
          <h3 className="mt-0 text-foreground">SMG Rankings</h3>
          <ol className="mb-0 list-decimal pl-5 space-y-2">
            <li><strong>BRRT SMG</strong> (The Raw Powerhouse)</li>
            <li><strong>Bully SMG</strong> (The 1v1 Duelist / Flinch Specialist)</li>
            <li><strong>V22 Volt Thrower</strong> (The Consistency King)</li>
            <li><strong>Copperhead RF</strong> (The Semi-Auto Specialist)</li>
          </ol>
        </div>

        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display uppercase tracking-widest text-foreground text-2xl mb-8">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h4 className="text-foreground font-bold mb-2">What is the fastest killing SMG in Marathon?</h4>
              <p>The BRRT SMG is currently the fastest killing SMG with a DPS of 183.33 and a headshot TTK of 0.54s, the highest in its class.</p>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-2">How does the V22 Volt Thrower compare?</h4>
              <p>The V22 Volt Thrower is more consistent due to its lock-on system, but it has a lower DPS of 152.1 compared to the BRRT. It excels at mobility and tracking targets.</p>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-2">What is the magazine size of the BRRT SMG?</h4>
              <p>The BRRT SMG features a 35-round magazine, which is the largest in its class, allowing for more sustained fire than its competitors.</p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
