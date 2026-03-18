import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { api } from "@/trpc/server";
import { db } from "@/server/db";
import { WeaponBadges } from "@/app/_components/weapon-badges";
import { WeaponStats } from "@/app/_components/stat-section";
import { WeaponRightPanel } from "@/app/_components/weapon-right-panel";
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
    <div className="mt-4 grid gap-6 lg:grid-cols-[280px_1fr_320px]">
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

      {/* 3-column layout: Stats | Image+Info | Mods */}
      <div className="mt-4 grid gap-6 lg:grid-cols-[280px_1fr_320px]">
        {/* Left column: Stats */}
        <div className="order-2 lg:order-1">
          <h2 className="text-heading mb-4 font-display text-xs uppercase tracking-widest heading-glow">
            Weapon Statistics
          </h2>
          <WeaponStats weapon={weapon} />
        </div>

        {/* Center column: Info + Image */}
        <div className="order-1 lg:order-2">
          {/* Floating weapon details */}
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

        {/* Right column: Mods & Builds */}
        <div className="order-3">
          <WeaponModsLoader weaponId={weapon.id} weaponSlug={weapon.slug} />
        </div>
      </div>
    </>
  );
}

async function WeaponModsLoader({ weaponId, weaponSlug }: { weaponId: string; weaponSlug: string }) {
  const { linkedMods, universalMods } = await api.mod.getByWeaponId({ weaponId });
  return <WeaponRightPanel weaponSlug={weaponSlug} linkedMods={linkedMods} universalMods={universalMods} />;
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
