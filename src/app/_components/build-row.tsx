"use client";

import { BuildVote } from "./build-vote";
import { RarityBadge, RARITY_COLORS } from "./rarity-badge";
import { StatModifierBadges } from "./stat-modifier-badges";
import { parseStatModifiers, aggregateStatModifiers } from "@/lib/stat-modifiers";

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

type BuildMod = {
  id: string;
  mod: { id: string; name: string; type: string; rarity: string; imageUrl: string | null };
};

type Build = {
  id: string;
  title: string;
  type: string;
  score: number;
  authorId: string;
  userVote: 1 | -1 | null;
  author: { id: string; name: string | null; image: string | null };
  mods: BuildMod[];
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

const TYPE_ORDER = ["BARREL", "GRIP", "MAGAZINE", "OPTIC", "SHIELD", "GENERATOR", "CHIP"];

export function BuildRow({
  build,
  allModsMap,
  isExpanded,
  onToggle,
  session,
  onDelete,
  isDeleting,
}: {
  build: Build;
  allModsMap: Map<string, Mod>;
  isExpanded: boolean;
  onToggle: () => void;
  session: { user?: { id: string } } | null;
  onDelete: (buildId: string) => void;
  isDeleting: boolean;
}) {
  // Sort mods by TYPE_ORDER for expanded view
  const sortedMods = [...build.mods].sort(
    (a, b) => TYPE_ORDER.indexOf(a.mod.type) - TYPE_ORDER.indexOf(b.mod.type),
  );

  // Compute total build cost
  const totalCost = build.mods.reduce((sum, bm) => {
    const mod = allModsMap.get(bm.mod.id);
    return sum + (mod?.price ?? 0);
  }, 0);

  return (
    <div className="cryo-panel rounded-lg">
      {/* Collapsed row */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-3 p-3 text-left"
      >
        <div onClick={(e) => e.stopPropagation()}>
          <BuildVote
            buildId={build.id}
            initialScore={build.score}
            initialUserVote={build.userVote}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-base font-medium text-foreground">
              {build.title}
            </span>
            <span
              className="shrink-0 rounded px-1.5 py-0.5 font-mono text-xs uppercase tracking-wide"
              style={{
                backgroundColor: `${BUILD_TYPE_COLORS[build.type]}20`,
                color: BUILD_TYPE_COLORS[build.type],
              }}
            >
              {BUILD_TYPE_LABELS[build.type]}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {build.author.image && (
                <img
                  src={build.author.image}
                  alt=""
                  className="h-4 w-4 rounded-full"
                />
              )}
              <span className="text-dim font-mono text-xs">
                {build.author.name ?? "Anonymous"}
              </span>
            </div>

            {build.mods.length > 0 && (
              <span className="text-dim font-mono text-xs">
                {build.mods.length} mod{build.mods.length !== 1 && "s"}
              </span>
            )}
            {totalCost > 0 && (
              <span className="text-foreground/70 font-mono text-sm">
                {totalCost.toLocaleString()}cr
              </span>
            )}
          </div>

          {/* Quick mod badges */}
          {build.mods.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {build.mods.map((bm) => {
                const color = RARITY_COLORS[bm.mod.rarity] ?? "#6b7280";
                const fullMod = allModsMap.get(bm.mod.id);
                return (
                  <span
                    key={bm.id}
                    className="flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs uppercase tracking-wide"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {(bm.mod.imageUrl ?? fullMod?.imageUrl) && (
                      <img
                        src={(bm.mod.imageUrl ?? fullMod?.imageUrl)!}
                        alt=""
                        width={16}
                        height={16}
                        className="rounded object-contain"
                      />
                    )}
                    {bm.mod.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Chevron */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-dim shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="border-border border-t px-3 pb-3 pt-3">
          {sortedMods.length === 0 ? (
            <p className="text-dim font-mono text-sm">No mods in this build.</p>
          ) : (
            <div className="space-y-3">
              {sortedMods.map((bm) => {
                const fullMod = allModsMap.get(bm.mod.id);
                const name = fullMod?.name ?? bm.mod.name;
                const rarity = fullMod?.rarity ?? bm.mod.rarity;
                const type = fullMod?.type ?? bm.mod.type;
                const price = fullMod?.price ?? null;
                const description = fullMod?.description ?? null;

                const imageUrl = bm.mod.imageUrl ?? fullMod?.imageUrl ?? null;

                return (
                  <div
                    key={bm.id}
                    className="border-border border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-dim font-mono text-xs uppercase tracking-wide">
                        {type}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={name}
                          width={44}
                          height={44}
                          className="shrink-0 rounded object-contain"
                          style={{
                            filter: `drop-shadow(0 0 4px ${RARITY_COLORS[rarity] ?? "#6b7280"}40)`,
                          }}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-base text-foreground">
                            {name}
                          </span>
                          <div className="flex shrink-0 items-center gap-2">
                            {price != null && (
                              <span className="text-foreground/70 font-mono text-sm">
                                {price === 0 ? "Free" : `${price.toLocaleString()}cr`}
                              </span>
                            )}
                            <RarityBadge rarity={rarity} />
                          </div>
                        </div>
                        {description && (
                          <p className="text-foreground/60 mt-1 text-sm leading-relaxed">
                            {description}
                          </p>
                        )}
                        <StatModifierBadges statModifiers={fullMod?.statModifiers} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Aggregated stat summary */}
          {(() => {
            const allModifiers = build.mods.map((bm) => {
              const fullMod = allModsMap.get(bm.mod.id);
              return parseStatModifiers(fullMod?.statModifiers);
            }).filter((m) => m.length > 0);
            if (allModifiers.length === 0) return null;
            const aggregated = aggregateStatModifiers(allModifiers);
            return (
              <div className="border-border mt-3 border-t pt-3">
                <span className="text-dim font-mono text-xs uppercase tracking-wide">
                  Combined Stats
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {Array.from(aggregated.entries()).map(([stat, { label, ups, downs }]) => {
                    const net = ups - downs;
                    if (net === 0) return null;
                    const isPositive = net > 0;
                    return (
                      <span
                        key={stat}
                        className="rounded px-1.5 py-0.5 font-mono text-xs"
                        style={{
                          backgroundColor: isPositive ? "#00ff9d20" : "#ff224420",
                          color: isPositive ? "#00ff9d" : "#ff2244",
                        }}
                      >
                        {isPositive ? "↑" : "↓"} {label}{Math.abs(net) > 1 ? ` ×${Math.abs(net)}` : ""}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Total build cost */}
          {totalCost > 0 && (
            <div className="border-border mt-3 flex items-center justify-end border-t pt-3">
              <span className="text-foreground font-mono text-sm">
                Total: {totalCost.toLocaleString()}cr
              </span>
            </div>
          )}

          {/* Delete button (owner only) */}
          {session?.user?.id === build.authorId && (
            <div className="mt-3 border-border border-t pt-3">
              <button
                onClick={() => onDelete(build.id)}
                disabled={isDeleting}
                className="text-dim cursor-pointer font-mono text-xs uppercase tracking-wide transition-colors hover:text-danger disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete build"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
