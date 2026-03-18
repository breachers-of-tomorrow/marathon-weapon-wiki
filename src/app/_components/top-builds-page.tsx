"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { BuildVote } from "./build-vote";
import { RARITY_COLORS } from "./rarity-badge";

const FILTER_OPTIONS = [
  { value: undefined, label: "All" },
  { value: "PVP" as const, label: "PvP" },
  { value: "PVE" as const, label: "PvE" },
  { value: "PVEVP" as const, label: "PvEvP" },
];

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

export function TopBuildsPage() {
  const { data: session } = useSession();
  const [typeFilter, setTypeFilter] = useState<
    "PVP" | "PVE" | "PVEVP" | undefined
  >();
  const [expandedBuildId, setExpandedBuildId] = useState<string | null>(null);

  const { data: builds, isLoading } = api.build.getTopBuilds.useQuery({
    type: typeFilter,
  });

  const utils = api.useUtils();
  const deleteBuild = api.build.delete.useMutation({
    onSuccess: () => void utils.build.getTopBuilds.invalidate(),
  });

  const displayBuilds = builds ?? [];

  return (
    <div>
      {/* Type filter */}
      <div className="mb-6 flex flex-wrap gap-1.5">
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

      {/* Builds list */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="cryo-panel h-20 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : displayBuilds.length === 0 ? (
        <div className="cryo-panel rounded-lg p-6 text-center">
          <p className="text-dim font-mono text-sm">No builds found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayBuilds.map((build, index) => {
            const isExpanded = expandedBuildId === build.id;
            return (
              <div key={build.id} className="cryo-panel rounded-lg">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedBuildId(isExpanded ? null : build.id)
                  }
                  className="flex w-full cursor-pointer items-center gap-3 p-3 text-left"
                >
                  {/* Rank */}
                  <span className="text-dim w-6 shrink-0 text-center font-mono text-sm">
                    {index + 1}
                  </span>

                  {/* Vote */}
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
                      {/* Weapon link */}
                      <Link
                        href={`/weapons/${build.weapon.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-accent font-mono text-xs hover:underline"
                      >
                        {build.weapon.name}
                      </Link>

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
                    </div>

                    {/* Mod badges */}
                    {build.mods.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {build.mods.map((bm) => {
                          const color =
                            RARITY_COLORS[bm.mod.rarity] ?? "#6b7280";
                          return (
                            <span
                              key={bm.id}
                              className="rounded px-1.5 py-0.5 font-mono text-xs uppercase tracking-wide"
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
                    {build.mods.length === 0 ? (
                      <p className="text-dim font-mono text-sm">
                        No mods in this build.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {build.mods.map((bm) => {
                          const color =
                            RARITY_COLORS[bm.mod.rarity] ?? "#6b7280";
                          return (
                            <div
                              key={bm.id}
                              className="border-border border-b pb-2 last:border-b-0 last:pb-0"
                            >
                              <span className="text-dim font-mono text-xs uppercase tracking-wide">
                                {bm.mod.type}
                              </span>
                              <div className="mt-0.5 flex items-center gap-2">
                                <span className="font-mono text-sm text-foreground">
                                  {bm.mod.name}
                                </span>
                                <span
                                  className="rounded px-1 py-0.5 font-mono text-xs uppercase"
                                  style={{
                                    backgroundColor: `${color}20`,
                                    color,
                                  }}
                                >
                                  {bm.mod.rarity}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Delete button (owner only) */}
                    {session?.user?.id === build.authorId && (
                      <div className="border-border mt-3 border-t pt-3">
                        <button
                          onClick={() => deleteBuild.mutate({ buildId: build.id })}
                          disabled={deleteBuild.isPending}
                          className="text-dim cursor-pointer font-mono text-xs uppercase tracking-wide transition-colors hover:text-danger disabled:opacity-50"
                        >
                          {deleteBuild.isPending
                            ? "Deleting..."
                            : "Delete build"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
