import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { api } from "@/trpc/server";
import { db } from "@/server/db";
import { WeaponBadges } from "@/app/_components/weapon-badges";
import { WeaponStats } from "@/app/_components/stat-section";
import { WeaponModsSection } from "@/app/_components/weapon-mods-section";
import { WeaponBuildsSection } from "@/app/_components/weapon-builds-section";
import {
  weaponProductJsonLd,
  breadcrumbJsonLd,
} from "@/lib/structured-data";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateStaticParams() {
  const weapons = await db.weapon.findMany({ select: { slug: true } });
  return weapons.map((w) => ({ slug: w.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const weapon = await api.weapon.getBySlug({ slug });
  if (!weapon) return { title: "Weapon Not Found" };

  return {
    title: weapon.name,
    description:
      weapon.description ?? `${weapon.name} stats and details for Marathon`,
    keywords: [
      weapon.name,
      weapon.type.replace(/_/g, " "),
      "Marathon",
      "weapon stats",
    ],
    alternates: {
      canonical: `${siteUrl}/weapons/${weapon.slug}`,
    },
    openGraph: {
      type: "article",
      title: `${weapon.name} | Marathon Weapon Wiki`,
      description:
        weapon.description ?? `${weapon.name} stats and details for Marathon`,
    },
  };
}

function DetailSkeleton() {
  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-[300px_1fr]">
      <div className="space-y-4">
        <div className="cryo-panel h-48 animate-pulse rounded-lg" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="cryo-panel h-24 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="space-y-4">
        <div className="bg-panel h-8 w-48 animate-pulse rounded" />
        <div className="cryo-panel h-20 animate-pulse rounded-lg" />
        <div className="cryo-panel h-20 animate-pulse rounded-lg" />
        <div className="cryo-panel h-20 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

async function WeaponDetail({ slug }: { slug: string }) {
  const weapon = await api.weapon.getBySlug({ slug });

  if (!weapon) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(weaponProductJsonLd(siteUrl, weapon)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(siteUrl, [
              { name: "Home", url: "/" },
              { name: weapon.name },
            ]),
          ),
        }}
      />

      {/* 2-column layout: Sidebar | Main content */}
      <div className="mt-4 grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left sidebar */}
        <div className="lg:sticky lg:top-4 lg:self-start space-y-6">
          {/* Weapon image */}
          <div className="cryo-panel relative flex min-h-48 items-center justify-center rounded-lg">
            {weapon.imageUrl ? (
              <Image
                src={weapon.imageUrl}
                alt={weapon.name}
                fill
                className="rounded-lg object-contain p-4"
              />
            ) : (
              <div className="text-dim flex h-48 w-full items-center justify-center font-mono text-sm uppercase tracking-wide">
                No Image Available
              </div>
            )}
          </div>

          {/* Stats */}
          <div>
            <h2 className="text-heading mb-4 font-display text-xs uppercase tracking-widest heading-glow">
              Weapon Statistics
            </h2>
            <WeaponStats weapon={weapon} />
          </div>

          {/* Mods section (collapsible) */}
          <WeaponModsLoader weaponId={weapon.id} />
        </div>

        {/* Main content */}
        <div>
          {/* Weapon header */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <h1 className="font-display text-2xl font-bold uppercase tracking-widest text-foreground heading-glow">
              {weapon.name}
            </h1>
            <div className="shrink-0 text-right">
              <div className="text-dim flex flex-wrap justify-end gap-x-4 gap-y-1 font-mono text-xs">
                {weapon.rarity && (
                  <div>
                    <span className="text-heading uppercase">Rarity:</span>{" "}
                    <span className="text-foreground">{weapon.rarity}</span>
                  </div>
                )}
                {weapon.price != null && (
                  <div>
                    <span className="text-heading uppercase">Price:</span>{" "}
                    <span className="text-foreground">{weapon.price}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <WeaponBadges
              type={weapon.type}
              slot={weapon.slot}
              ammoType={weapon.ammoType}
            />
          </div>

          {weapon.description && (
            <p className="text-dim mb-6 text-sm leading-relaxed">
              {weapon.description}
            </p>
          )}

          {/* Builds section */}
          <h2 className="text-heading mb-4 font-display text-xs uppercase tracking-widest heading-glow">
            Community Builds
          </h2>
          <WeaponBuildsLoader weaponSlug={weapon.slug} weaponId={weapon.id} />
        </div>
      </div>
    </>
  );
}

async function WeaponModsLoader({ weaponId }: { weaponId: string }) {
  const { linkedMods, universalMods } = await api.mod.getByWeaponId({ weaponId });

  if (linkedMods.length === 0 && universalMods.length === 0) return null;

  return (
    <details>
      <summary className="text-heading mb-4 cursor-pointer font-display text-xs uppercase tracking-widest heading-glow select-none list-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          Mods & Attachments
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform [[open]>&]:rotate-180"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </summary>
      <WeaponModsSection linkedMods={linkedMods} universalMods={universalMods} />
    </details>
  );
}

async function WeaponBuildsLoader({ weaponSlug, weaponId }: { weaponSlug: string; weaponId: string }) {
  const { linkedMods, universalMods } = await api.mod.getByWeaponId({ weaponId });
  return (
    <WeaponBuildsSection
      weaponSlug={weaponSlug}
      linkedMods={linkedMods}
      universalMods={universalMods}
    />
  );
}

export default async function WeaponDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12">
      {/* Static shell */}
      <Link
        href="/"
        className="text-dim hover:text-accent mb-8 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide transition-colors"
      >
        &larr; All Weapons
      </Link>

      {/* Dynamic part */}
      <Suspense fallback={<DetailSkeleton />}>
        <WeaponDetail slug={slug} />
      </Suspense>
    </main>
  );
}
