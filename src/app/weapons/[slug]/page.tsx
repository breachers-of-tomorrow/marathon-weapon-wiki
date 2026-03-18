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
import { WeaponPageTabs } from "@/app/_components/weapon-page-tabs";
import {
  weaponProductJsonLd,
  breadcrumbJsonLd,
} from "@/lib/structured-data";
import { WeaponTTKSection } from "@/app/_components/weapon-ttk-section";

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
    <div>
      <div className="mt-4 mb-6 flex gap-1.5">
        <div className="bg-panel h-8 w-20 animate-pulse rounded" />
        <div className="bg-panel h-8 w-20 animate-pulse rounded" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr_320px]">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="cryo-panel h-36 animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="bg-panel h-8 w-48 animate-pulse rounded" />
          <div className="cryo-panel h-96 animate-pulse rounded-lg" />
        </div>
        <div className="cryo-panel h-96 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

async function WeaponDetail({ slug }: { slug: string }) {
  const weapon = await api.weapon.getBySlug({ slug });

  if (!weapon) notFound();

  const { linkedMods, universalMods } = await api.mod.getByWeaponId({ weaponId: weapon.id });

  const detailsView = (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_320px]">
      {/* Left column: Stats */}
      <div className="order-2 lg:order-1">
        <h2 className="text-heading mb-4 font-display text-xs uppercase tracking-widest heading-glow">
          Weapon Statistics
        </h2>
        <WeaponStats weapon={weapon} />
      </div>

      {/* Center column: Info + Image */}
      <div className="order-1 lg:order-2">
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
          <p className="text-dim mb-4 text-sm leading-relaxed">
            {weapon.description}
          </p>
        )}

        {/* Big weapon image */}
        <div className="cryo-panel relative flex min-h-72 items-center justify-center rounded-lg lg:min-h-[28rem]">
          {weapon.imageUrl ? (
            <Image
              src={weapon.imageUrl}
              alt={weapon.name}
              fill
              className="rounded-lg object-contain p-6"
            />
          ) : (
            <div className="text-dim flex h-72 w-full items-center justify-center font-mono text-sm uppercase tracking-wide">
              No Image Available
            </div>
          )}
        </div>
      </div>

      {/* Right column: Mods */}
      <div className="order-3">
        <WeaponModsSection linkedMods={linkedMods} universalMods={universalMods} />
      </div>
    </div>
  );

  const ttkView = weapon.ttk ? (
    <WeaponTTKSection ttk={weapon.ttk} />
  ) : (
    <div className="cryo-panel rounded-lg p-8 text-center">
      <p className="text-dim font-mono text-sm">No TTK data available for this weapon yet.</p>
    </div>
  );

  const buildsView = (
    <div data-tour="builds-section">
      <h2 className="text-heading mb-4 font-display text-xs uppercase tracking-widest heading-glow">
        Community Builds
      </h2>
      <WeaponBuildsSection
        weaponSlug={weapon.slug}
        linkedMods={linkedMods}
        universalMods={universalMods}
      />
    </div>
  );

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

      <WeaponPageTabs
        detailsContent={detailsView}
        ttkContent={ttkView}
        buildsContent={buildsView}
      />
    </>
  );
}

export default async function WeaponDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12">
      <Link
        href="/"
        className="text-dim hover:text-accent mb-8 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide transition-colors"
      >
        &larr; All Weapons
      </Link>

      <Suspense fallback={<DetailSkeleton />}>
        <WeaponDetail slug={slug} />
      </Suspense>
    </main>
  );
}
