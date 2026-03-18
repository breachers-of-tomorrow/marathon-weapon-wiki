"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { api } from "@/trpc/react";
import { BuildVote } from "./build-vote";
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
};

const RARITY_COLORS: Record<string, string> = {
  PRESTIGE: "#f59e0b",
  SUPERIOR: "#8b5cf6",
  DELUXE: "#00d4ff",
  ENHANCED: "#00ff9d",
  STANDARD: "#6b7280",
};

const BUILD_TYPE_LABELS: Record<string, string> = {
  PVP: "PvP",
  PVE: "PvE",
  PVEVP: "PvEvP",
};

const BUILD_TYPE_COLORS: Record<string, string> = {
  PVP: "#ff2244",
  PVE: "#00ff9d",
  PVEVP: "#f59e0b",
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
              className={`rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors ${
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
          className="cursor-pointer rounded border border-border-accent px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-accent transition-colors hover:bg-panel-hover"
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
          <p className="text-dim font-mono text-xs">
            No builds yet — be the first!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {builds.map((build) => (
            <div key={build.id} className="cryo-panel flex gap-3 rounded-lg p-3">
              <BuildVote
                buildId={build.id}
                initialScore={build.score}
                initialUserVote={build.userVote}
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {build.title}
                  </span>
                  <span
                    className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide"
                    style={{
                      backgroundColor: `${BUILD_TYPE_COLORS[build.type]}20`,
                      color: BUILD_TYPE_COLORS[build.type],
                    }}
                  >
                    {BUILD_TYPE_LABELS[build.type]}
                  </span>
                </div>

                {/* Author */}
                <div className="mb-1.5 flex items-center gap-1.5">
                  {build.author.image && (
                    <img
                      src={build.author.image}
                      alt=""
                      className="h-4 w-4 rounded-full"
                    />
                  )}
                  <span className="text-dim font-mono text-[10px]">
                    {build.author.name ?? "Anonymous"}
                  </span>
                  {session?.user?.id === build.authorId && (
                    <button
                      onClick={() => deleteBuild.mutate({ buildId: build.id })}
                      className="text-dim cursor-pointer font-mono text-[10px] transition-colors hover:text-danger"
                    >
                      delete
                    </button>
                  )}
                </div>

                {/* Mods */}
                {build.mods.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {build.mods.map((bm) => {
                      const color = RARITY_COLORS[bm.mod.rarity] ?? "#6b7280";
                      return (
                        <span
                          key={bm.id}
                          className="rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide"
                          style={{
                            backgroundColor: `${color}20`,
                            color,
                          }}
                        >
                          {bm.mod.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
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
