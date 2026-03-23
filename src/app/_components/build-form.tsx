"use client";

import { useState, useCallback, useRef } from "react";
import { api } from "@/trpc/react";
import { WeaponConfigurator } from "./weapon-configurator";

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
  statModifiers: unknown;
};

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
  weaponName,
  weaponImageUrl,
  linkedMods,
  universalMods,
}: {
  open: boolean;
  onClose: () => void;
  weaponSlug: string;
  weaponName?: string;
  weaponImageUrl?: string | null;
  linkedMods: Mod[];
  universalMods: Mod[];
}) {
  const [title, setTitle] = useState("");
  const [buildType, setBuildType] = useState<(typeof BUILD_TYPES)[number]>(
    "PVP",
  );
  const [error, setError] = useState("");
  const equippedRef = useRef<Mod[]>([]);

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
    setError("");
    equippedRef.current = [];
    onClose();
  }

  const handleModsChange = useCallback((mods: Mod[]) => {
    equippedRef.current = mods;
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const modIds = equippedRef.current.map((m) => m.id);
    createBuild.mutate({
      title: title.trim(),
      type: buildType,
      weaponSlug,
      modIds,
    });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !createBuild.isPending)
          resetAndClose();
      }}
    >
      <div className="cryo-panel mx-4 w-full max-w-3xl rounded-lg border-border-accent p-6">
        <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-foreground">
          Submit Build
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto pr-1"
        >
          {/* Top section: title + type */}
          <div className="grid gap-4 sm:grid-cols-2">
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
                disabled={createBuild.isPending}
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
                    className={`cursor-pointer rounded px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-colors ${
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
          </div>

          {/* Main section: weapon info left, configurator right */}
          <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
            {/* Left: weapon preview */}
            <div className="flex flex-col items-center gap-2">
              {weaponImageUrl && (
                <div className="cryo-panel relative flex h-32 w-full items-center justify-center rounded-lg sm:h-44">
                  <img
                    src={weaponImageUrl}
                    alt={weaponName ?? "Weapon"}
                    className="h-full w-full rounded-lg object-contain p-3"
                  />
                </div>
              )}
              {weaponName && (
                <span className="font-display text-xs uppercase tracking-wider text-foreground">
                  {weaponName}
                </span>
              )}
            </div>

            {/* Right: configurator */}
            <div className="min-h-0">
              <label className="mb-1 block text-sm text-dim">Select Mods</label>
              <WeaponConfigurator
                linkedMods={linkedMods}
                universalMods={universalMods}
                onModsChange={handleModsChange}
              />
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
