"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

type Mod = {
  id: string;
  name: string;
  type: string;
  rarity: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  isUniversal: boolean;
  slug: string;
};

const TYPE_ORDER = ["BARREL", "GRIP", "MAGAZINE", "OPTIC", "SHIELD", "GENERATOR", "CHIP"];
const BUILD_TYPES = ["PVP", "PVE", "PVEVP"] as const;

const BUILD_TYPE_LABELS: Record<string, string> = {
  PVP: "PvP",
  PVE: "PvE",
  PVEVP: "PvEvP",
};

export function BuildForm({
  open,
  onClose,
  weaponSlug,
  linkedMods,
  universalMods,
}: {
  open: boolean;
  onClose: () => void;
  weaponSlug: string;
  linkedMods: Mod[];
  universalMods: Mod[];
}) {
  const [title, setTitle] = useState("");
  const [buildType, setBuildType] = useState<(typeof BUILD_TYPES)[number]>("PVP");
  const [selectedMods, setSelectedMods] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const utils = api.useUtils();
  const createBuild = api.build.create.useMutation({
    onSuccess: () => {
      void utils.build.getByWeaponSlug.invalidate();
      resetAndClose();
    },
    onError: (err) => setError(err.message),
  });

  function resetAndClose() {
    setTitle("");
    setBuildType("PVP");
    setSelectedMods({});
    setError("");
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const modIds = Object.values(selectedMods).filter(Boolean);
    createBuild.mutate({
      title: title.trim(),
      type: buildType,
      weaponSlug,
      modIds,
    });
  }

  // Group available mods by type
  const allMods = [...linkedMods, ...universalMods];
  const modsByType = new Map<string, Mod[]>();
  for (const type of TYPE_ORDER) {
    const modsOfType = allMods.filter((m) => m.type === type);
    if (modsOfType.length > 0) modsByType.set(type, modsOfType);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !createBuild.isPending) resetAndClose();
      }}
    >
      <div className="cryo-panel mx-4 w-full max-w-md rounded-lg border-border-accent p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Submit Build
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm text-dim">Build Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              placeholder="e.g. PvP Rush Loadout"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-dim focus:border-accent focus:outline-none"
              required
              disabled={createBuild.isPending}
            />
          </div>

          {/* Build Type */}
          <div>
            <label className="mb-1 block text-sm text-dim">Build Type</label>
            <div className="flex gap-1.5">
              {BUILD_TYPES.map((bt) => (
                <button
                  key={bt}
                  type="button"
                  onClick={() => setBuildType(bt)}
                  className={`rounded px-3 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors ${
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

          {/* Mod Selectors */}
          <div>
            <label className="mb-1 block text-sm text-dim">Mods</label>
            <div className="space-y-2">
              {Array.from(modsByType.entries()).map(([type, mods]) => (
                <div key={type}>
                  <label className="mb-0.5 block font-mono text-[10px] uppercase tracking-widest text-foreground">
                    {type}
                  </label>
                  <select
                    value={selectedMods[type] ?? ""}
                    onChange={(e) =>
                      setSelectedMods((prev) => ({
                        ...prev,
                        [type]: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                    disabled={createBuild.isPending}
                  >
                    <option value="">None</option>
                    {mods.map((mod) => (
                      <option key={mod.id} value={mod.id}>
                        {mod.name}
                      </option>
                    ))}
                  </select>
                </div>
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
              onClick={resetAndClose}
              className="cursor-pointer rounded-md px-4 py-2 text-sm text-dim transition-colors hover:text-foreground"
              disabled={createBuild.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || createBuild.isPending}
              className="cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40"
            >
              {createBuild.isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
