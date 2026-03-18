import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Assault Rifles in Marathon | Meta Comparison",
  description: "Impact HAR vs Overrun AR vs M77. Which assault rifle is the best for mid-range combat in Marathon? Full TTK and range analysis.",
};

export default function ArGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Assault Rifles: The Mid-Range Meta",
    "description": "Comparing the Impact HAR, Overrun AR, and M77 to find the best mid-range tool in Marathon.",
    "author": { "@type": "Organization", "name": "Marathon Weapon Wiki" },
    "datePublished": "2026-03-18",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://marathon-weapon-wiki.com/guides/best-assault-rifles" },
    "hasPart": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the best Assault Rifle for range?",
            "acceptedAnswer": { "@type": "Answer", "text": "The Impact HAR is the clear winner for range, with an effective range of 60 meters." }
          },
          {
            "@type": "Question",
            "name": "Which AR has the highest DPS?",
            "acceptedAnswer": { "@type": "Answer", "text": "The Overrun AR has the highest DPS in the category at 126." }
          },
          {
            "@type": "Question",
            "name": "What is the headshot TTK for the Impact HAR?",
            "acceptedAnswer": { "@type": "Answer", "text": "The Impact HAR has a headshot TTK of 0.6s, the fastest in its class." }
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
          Assault Rifles: The Mid-Range Meta
        </h1>
        <div className="text-dim mt-4 flex items-center gap-4 font-mono text-xs uppercase tracking-wider">
          <span>By Marathon Weapon Wiki</span>
          <span className="bg-panel px-2 py-0.5 rounded text-accent">Strategic Guide</span>
        </div>
      </div>

      <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-foreground prose-p:text-dim prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-accent hover:prose-a:underline">
        <p className="text-xl italic">The Assault Rifle (AR) category in Marathon is the most contested slot, bridging the gap between frantic close-quarters combat and long-distance picking.</p>

        <div className="cryo-panel my-8 p-6">
          <h2 className="mb-4 mt-0 text-xl font-bold text-accent">The Verdict: Impact HAR is the Precision King</h2>
          <p className="mb-0">When comparing the <strong>Impact HAR</strong>, <strong>Overrun AR</strong>, and the <strong>M77 Assault Rifle</strong>, the data reveals a clear divergence in playstyles.</p>
        </div>

        <h3>Impact HAR: The Scalpel</h3>
        <p>The Impact HAR dominates the category with a staggering 60m effective range—the highest among standard ARs. While it sports a lower rate of fire (400 RPM), its precision reward is unmatched. With a 1.6x headshot multiplier, it achieves a headshot TTK of 0.6s, the fastest in class. Its 120 DPS and heavy rounds make it the premier choice for marksmen who can land their shots.</p>

        <div className="grid gap-4 md:grid-cols-2 my-6">
          <div className="cryo-panel p-4">
            <span className="block font-mono text-xs uppercase tracking-widest text-accent mb-1">Range</span>
            <span className="text-2xl font-bold text-foreground">60m</span>
          </div>
          <div className="cryo-panel p-4">
            <span className="block font-mono text-xs uppercase tracking-widest text-accent mb-1">Headshot TTK</span>
            <span className="text-2xl font-bold text-foreground">0.6s</span>
          </div>
        </div>

        <h3>Overrun AR: The Chainsaw</h3>
        <p>For players who prefer aggressive, mobile play, the Overrun AR is the statistical winner for raw damage. It boasts the highest DPS in the category at 126, thanks to a blistering 720 RPM. However, this comes at a cost: its range is a mere 27m, and its 20-round magazine disappears in seconds. It is essentially an SMG in an AR's body.</p>

        <h3>M77 Assault Rifle: The Workhorse</h3>
        <p>The M77 offers the most balanced experience. With a 24-round magazine (the largest in class) and a respectable 1.067s body TTK, it is the most forgiving weapon. Its unique flip-scope provides versatility that the other rifles lack, making it the best &quot;all-rounder&quot; for general exploration and multi-target engagements.</p>

        <h3>V75 Scar: The Volt Specialist</h3>
        <p>The V75 Scar is the outlier of the category. While its raw DPS (93.04) and TTK (1.403s body) look underwhelming on paper, it makes up for it with <strong>tracking projectiles</strong>. This allows users to land shots consistently while focusing on evasive movement. However, players must manage the heat mechanic—sustained fire overheats the weapon, lowering its rate of fire and significantly increasing TTK.</p>

        <div className="bg-panel/50 my-12 border-l-4 border-accent p-8 rounded-r-lg">
          <h3 className="mt-0 text-foreground">Final Rankings</h3>
          <ol className="mb-0 list-decimal pl-5 space-y-2">
            <li><strong>Impact HAR</strong> (Best for Skill/Range)</li>
            <li><strong>Overrun AR</strong> (Best for Aggression)</li>
            <li><strong>M77 AR</strong> (Best for Versatility)</li>
            <li><strong>V75 Scar</strong> (Best for High-Mobility Engagements)</li>
          </ol>
        </div>

        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display uppercase tracking-widest text-foreground text-2xl mb-8">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h4 className="text-foreground font-bold mb-2">What is the best Assault Rifle for range?</h4>
              <p>The Impact HAR is the clear winner for range, with an effective range of 60 meters, surpassing the M77 (46m) and Overrun AR (27m).</p>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-2">Which AR has the highest DPS?</h4>
              <p>The Overrun AR has the highest DPS in the category at 126, making it lethal at close range despite its limited distance.</p>
            </div>
            <div>
              <h4 className="text-foreground font-bold mb-2">What is the headshot TTK for the Impact HAR?</h4>
              <p>The Impact HAR has a headshot TTK of 0.6s, which is the fastest in the assault rifle category if you land your precision shots.</p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
