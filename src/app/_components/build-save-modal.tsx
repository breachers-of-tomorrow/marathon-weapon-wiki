"use client";

import { useState } from "react";
import { RARITY_COLORS } from "./rarity-badge";

type Mod = {
  id: string;
  name: string;
  type: string;
  rarity: string;
};

const BUILD_TYPES = ["PVP", "PVE", "PVEVP"] as const;
const BUILD_TYPE_LABELS: Record<string, string> = {
  PVP: "PvP",
  PVE: "PvE",
  PVEVP: "PvEvP",
};

const SLOT_SHORT: Record<string, string> = {
  MAGAZINE: "MAG",
  GENERATOR: "GEN",
};

export function BuildSaveModal({
  weaponName,
  equippedMods,
  onClose,
  onSubmit,
  isPending,
  error,
}: {
  weaponSlug: string;
  weaponName: string;
  equippedMods: Record<string, Mod>;
  onClose: () => void;
  onSubmit: (title: string, type: "PVP" | "PVE" | "PVEVP") => void;
  isPending: boolean;
  error: string | null;
}) {
  const [title, setTitle] = useState("");
  const [buildType, setBuildType] = useState<(typeof BUILD_TYPES)[number]>("PVP");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), buildType);
  }

  const modEntries = Object.entries(equippedMods);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
    >
      <div className="cryo-panel mx-4 w-full max-w-md rounded-lg border-border-accent p-6">
        <h2 className="mb-1 font-display text-sm font-bold uppercase tracking-wider text-foreground">
          Save Build
        </h2>
        <p className="mb-4 font-mono text-[11px] text-dim">
          {weaponName} &middot; {modEntries.length} mod{modEntries.length !== 1 ? "s" : ""}
        </p>

        {/* Equipped mods preview */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {modEntries.map(([type, mod]) => (
            <span
              key={type}
              className="flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px]"
              style={{
                borderColor: `${RARITY_COLORS[mod.rarity] ?? "#6b7280"}40`,
                backgroundColor: `${RARITY_COLORS[mod.rarity] ?? "#6b7280"}10`,
                color: RARITY_COLORS[mod.rarity] ?? "#6b7280",
              }}
            >
              <span className="text-dim">{SLOT_SHORT[type] ?? type}</span>
              <span className="text-foreground">{mod.name}</span>
            </span>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm text-dim">Build Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              placeholder="e.g. PvP Rush Loadout"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-dim focus:border-accent focus:outline-none"
              required
              autoFocus
              disabled={isPending}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-dim">Build Type</label>
            <div className="flex gap-1.5">
              {BUILD_TYPES.map((bt) => (
                <button
                  key={bt}
                  type="button"
                  onClick={() => setBuildType(bt)}
                  className={`cursor-pointer rounded px-3 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors ${
                    buildType === bt
                      ? "bg-accent text-background"
                      : "border border-border bg-panel text-dim hover:text-foreground"
                  }`}
                >
                  {BUILD_TYPE_LABELS[bt]}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#ff2244" }}>
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-md px-4 py-2 text-sm text-dim transition-colors hover:text-foreground"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isPending}
              className="cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
