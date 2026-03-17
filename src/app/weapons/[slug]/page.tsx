import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { api } from "@/trpc/server";
import { WeaponBadges } from "@/app/_components/weapon-badges";
import { WeaponStats } from "@/app/_components/stat-section";
import { WeaponModsSection } from "@/app/_components/weapon-mods-section";
import {
  weaponProductJsonLd,
  breadcrumbJsonLd,
} from "@/lib/structured-data";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

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
    <div className="mt-4">
      <div className="space-y-4">
        <div className="bg-panel h-8 w-48 animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="bg-panel h-6 w-24 animate-pulse rounded" />
          <div className="bg-panel h-6 w-20 animate-pulse rounded" />
        </div>
        <div className="bg-panel h-20 w-full animate-pulse rounded" />
      </div>
      <div className="cryo-panel mt-6 h-80 animate-pulse rounded-lg" />
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="cryo-panel h-40 animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="cryo-panel h-96 animate-pulse rounded-lg" />
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

      {/* Weapon info floating above image */}
      <div className="mt-4">
        <h1 className="font-mono text-2xl font-bold uppercase tracking-widest text-foreground">
          {weapon.name}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <WeaponBadges
            type={weapon.type}
            slot={weapon.slot}
            ammoType={weapon.ammoType}
          />
          <div className="text-dim flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs">
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

        {weapon.description && (
          <p className="text-dim mt-3 max-w-2xl text-sm leading-relaxed">
            {weapon.description}
          </p>
        )}
      </div>

      {/* Big weapon image */}
      <div className="cryo-panel relative mt-6 flex min-h-80 items-center justify-center rounded-lg md:min-h-96">
        {weapon.imageUrl ? (
          <Image
            src={weapon.imageUrl}
            alt={weapon.name}
            fill
            className="rounded-lg object-contain p-8"
          />
        ) : (
          <div className="text-dim flex h-80 w-full items-center justify-center font-mono text-sm uppercase tracking-wide">
            No Image Available
          </div>
        )}
      </div>

      {/* Two-column: Stats (left) + Mods (right) */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-heading mb-4 font-mono text-xs uppercase tracking-widest">
            Weapon Statistics
          </h2>
          <WeaponStats weapon={weapon as unknown as Record<string, number | null | undefined>} />
        </div>

        <div>
          <WeaponModsLoader weaponId={weapon.id} />
        </div>
      </div>
    </>
  );
}

async function WeaponModsLoader({ weaponId }: { weaponId: string }) {
  const { linkedMods, universalMods } = await api.mod.getByWeaponId({ weaponId });
  return <WeaponModsSection linkedMods={linkedMods} universalMods={universalMods} />;
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
