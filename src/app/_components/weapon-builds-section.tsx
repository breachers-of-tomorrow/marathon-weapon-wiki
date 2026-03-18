"use client";

import { useState, useMemo } from "react";
import { useSession, signIn } from "next-auth/react";
import { api } from "@/trpc/react";
import { BuildRow } from "./build-row";
import { BuildForm } from "./build-form";

type Mod = {
  id: string;
  name: string;
  slug: string;
  type: string;
  rarity: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  isUniversal: boolean;
  statModifiers: unknown;
};

const FILTER_OPTIONS = [
  { value: undefined, label: "All" },
  { value: "PVP" as const, label: "PvP" },
  { value: "PVE" as const, label: "PvE" },
  { value: "PVEVP" as const, label: "PvEvP" },
];

export function WeaponBuildsSection({
  weaponSlug,
  linkedMods,
  universalMods,
}: {
  weaponSlug: string;
  linkedMods: Mod[];
  universalMods: Mod[];
}) {
  const { data: session } = useSession();
  const [typeFilter, setTypeFilter] = useState<"PVP" | "PVE" | "PVEVP" | undefined>();
  const [formOpen, setFormOpen] = useState(false);
  const [expandedBuildId, setExpandedBuildId] = useState<string | null>(null);

  const allModsMap = useMemo(() => {
    const map = new Map<string, Mod>();
    for (const mod of [...linkedMods, ...universalMods]) {
      map.set(mod.id, mod);
    }
    return map;
  }, [linkedMods, universalMods]);

  const { data: builds, isLoading } = api.build.getByWeaponSlug.useQuery({
    weaponSlug,
    type: typeFilter,
  });

  const utils = api.useUtils();
  const deleteBuild = api.build.delete.useMutation({
    onSuccess: () => void utils.build.getByWeaponSlug.invalidate(),
  });

  function handleSubmitClick() {
    if (!session?.user) {
      void signIn("bungie");
      return;
    }
    setFormOpen(true);
  }

  return (
    <div>
      {/* Header with submit button */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setTypeFilter(opt.value)}
              className={`rounded px-2 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
                typeFilter === opt.value
                  ? "bg-accent text-background"
                  : "border border-border bg-panel text-dim hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmitClick}
          className="cursor-pointer rounded border border-border-accent px-2 py-1 font-mono text-xs uppercase tracking-wide text-accent transition-colors hover:bg-panel-hover"
        >
          + Build
        </button>
      </div>

      {/* Build list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="cryo-panel h-20 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : !builds?.length ? (
        <div className="cryo-panel rounded-lg p-6 text-center">
          <p className="text-dim font-mono text-sm">
            No builds yet — be the first!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {builds.map((build) => (
            <BuildRow
              key={build.id}
              build={build}
              allModsMap={allModsMap}
              isExpanded={expandedBuildId === build.id}
              onToggle={() =>
                setExpandedBuildId(expandedBuildId === build.id ? null : build.id)
              }
              session={session}
              onDelete={(buildId) => deleteBuild.mutate({ buildId })}
              isDeleting={deleteBuild.isPending}
            />
          ))}
        </div>
      )}

      <BuildForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        weaponSlug={weaponSlug}
        linkedMods={linkedMods}
        universalMods={universalMods}
      />
    </div>
  );
}
