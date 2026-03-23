"use client";

import { useState, useMemo } from "react";
import {
  Crosshair,
  Grip,
  Layers,
  Eye,
  ShieldHalf,
  Zap,
  Cpu,
  Search,
  X,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import { api } from "@/trpc/react";
import { RARITY_COLORS } from "./rarity-badge";

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

const SLOT_ORDER = [
  "BARREL",
  "GRIP",
  "MAGAZINE",
  "OPTIC",
  "SHIELD",
  "GENERATOR",
  "CHIP",
] as const;

const SLOT_SHORT: Record<string, string> = {
  BARREL: "BRL",
  GRIP: "GRP",
  MAGAZINE: "MAG",
  OPTIC: "OPT",
  SHIELD: "SHL",
  GENERATOR: "GEN",
  CHIP: "CHP",
};

type SlotIconComponent = React.FC<LucideProps>;

const SLOT_ICONS: Record<string, SlotIconComponent> = {
  BARREL: Crosshair,
  GRIP: Grip,
  MAGAZINE: Layers,
  OPTIC: Eye,
  SHIELD: ShieldHalf,
  GENERATOR: Zap,
  CHIP: Cpu,
};

const RARITY_ORDER = [
  "PRESTIGE",
  "SUPERIOR",
  "DELUXE",
  "ENHANCED",
  "STANDARD",
];

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
  const [buildType, setBuildType] = useState<(typeof BUILD_TYPES)[number]>("PVP");
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [selectedMods, setSelectedMods] = useState<Record<string, Mod>>({});
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const allMods = useMemo(
    () => [...linkedMods, ...universalMods],
    [linkedMods, universalMods],
  );

  const availableSlots = useMemo(
    () => SLOT_ORDER.filter((type) => allMods.some((m) => m.type === type)),
    [allMods],
  );

  // Mods for the active slot, filtered by search
  const slotMods = useMemo(() => {
    if (!activeSlot) return [];
    let mods = allMods.filter((m) => m.type === activeSlot);
    if (search.trim()) {
      const q = search.toLowerCase();
      mods = mods.filter((m) => m.name.toLowerCase().includes(q));
    }
    return mods.sort(
      (a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity),
    );
  }, [allMods, activeSlot, search]);

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
    setActiveSlot(null);
    setSelectedMods({});
    setSearch("");
    setError("");
    onClose();
  }

  function toggleMod(mod: Mod) {
    setSelectedMods((prev) => {
      const next = { ...prev };
      if (prev[mod.type]?.id === mod.id) {
        delete next[mod.type];
      } else {
        next[mod.type] = mod;
      }
      return next;
    });
  }

  function removeMod(type: string) {
    setSelectedMods((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createBuild.mutate({
      title: title.trim(),
      type: buildType,
      weaponSlug,
      modIds: Object.values(selectedMods).map((m) => m.id),
    });
  }

  const equippedCount = Object.keys(selectedMods).length;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !createBuild.isPending)
          resetAndClose();
      }}
    >
      <div className="cryo-panel mx-4 flex w-full max-w-lg flex-col rounded-lg border-border-accent p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              New Build
            </h2>
            {weaponName && (
              <p className="mt-0.5 font-mono text-[11px] text-dim">{weaponName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="cursor-pointer rounded p-1 text-dim transition-colors hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Title + Type — single compact row */}
          <div className="flex items-end gap-3">
            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                placeholder="Build title..."
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-dim focus:border-accent focus:outline-none"
                required
                autoFocus
                disabled={createBuild.isPending}
              />
            </div>
            <div className="flex gap-1">
              {BUILD_TYPES.map((bt) => (
                <button
                  key={bt}
                  type="button"
                  onClick={() => setBuildType(bt)}
                  className={`cursor-pointer rounded px-2.5 py-2 font-mono text-[10px] uppercase tracking-wide transition-colors ${
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

          {/* Selected mods chips — always visible */}
          {equippedCount > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {SLOT_ORDER.filter((t) => selectedMods[t]).map((type) => {
                const mod = selectedMods[type]!;
                const color = RARITY_COLORS[mod.rarity] ?? "#6b7280";
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => removeMod(type)}
                    className="group flex cursor-pointer items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] transition-all hover:border-danger/60"
                    style={{
                      borderColor: `${color}40`,
                      backgroundColor: `${color}08`,
                    }}
                  >
                    <span className="text-dim">{SLOT_SHORT[type]}</span>
                    <span className="text-foreground">{mod.name}</span>
                    <X
                      size={10}
                      className="text-dim transition-colors group-hover:text-danger"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Slot tabs */}
          <div className="flex gap-0.5 rounded-md border border-border bg-background/50 p-0.5">
            {availableSlots.map((type) => {
              const isActive = activeSlot === type;
              const hasEquipped = !!selectedMods[type];
              const color = hasEquipped
                ? (RARITY_COLORS[selectedMods[type]!.rarity] ?? "#6b7280")
                : undefined;
              const Icon = SLOT_ICONS[type];

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setActiveSlot(isActive ? null : type);
                    setSearch("");
                  }}
                  className={`flex flex-1 cursor-pointer flex-col items-center gap-0.5 rounded px-1 py-1.5 transition-all ${
                    isActive
                      ? hasEquipped
                        ? ""
                        : "bg-panel-hover"
                      : "hover:bg-panel-hover/50"
                  }`}
                  style={
                    isActive && hasEquipped
                      ? { backgroundColor: `${color}20` }
                      : undefined
                  }
                >
                  {Icon && (
                    <Icon
                      size={14}
                      strokeWidth={hasEquipped ? 2.5 : 1.5}
                      className={hasEquipped ? "" : isActive ? "text-accent" : "text-dim"}
                      style={hasEquipped ? { color } : undefined}
                    />
                  )}
                  <span
                    className={`text-[7px] uppercase leading-none tracking-wider ${
                      hasEquipped ? "" : isActive ? "text-accent" : "text-dim"
                    }`}
                    style={hasEquipped ? { color } : undefined}
                  >
                    {SLOT_SHORT[type]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mod picker — FIXED HEIGHT, scrollable, no layout shift */}
          {activeSlot && (
            <div className="flex flex-col rounded-md border border-border bg-background/30">
              {/* Search within slot */}
              <div className="flex items-center gap-2 border-b border-border/50 px-3 py-1.5">
                <Search size={12} className="shrink-0 text-dim" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${activeSlot.toLowerCase()} mods...`}
                  className="min-w-0 flex-1 bg-transparent text-xs text-foreground placeholder:text-dim focus:outline-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="cursor-pointer text-dim hover:text-foreground"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Mod list — fixed height with internal scroll */}
              <div className="h-48 overflow-y-auto">
                {slotMods.length > 0 ? (
                  <div className="divide-y divide-border/30">
                    {slotMods.map((mod) => {
                      const isSelected = selectedMods[mod.type]?.id === mod.id;
                      const color = RARITY_COLORS[mod.rarity] ?? "#6b7280";

                      return (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => toggleMod(mod)}
                          className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left transition-all ${
                            isSelected
                              ? "bg-accent/10"
                              : "hover:bg-panel-hover/50"
                          }`}
                        >
                          {/* Rarity dot */}
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: color }}
                          />

                          {/* Name + rarity */}
                          <div className="min-w-0 flex-1">
                            <span className="block truncate font-mono text-xs text-foreground">
                              {mod.name}
                            </span>
                            <span
                              className="font-mono text-[9px] uppercase tracking-wide"
                              style={{ color }}
                            >
                              {mod.rarity}
                              {mod.isUniversal && (
                                <span className="ml-1 text-accent">Universal</span>
                              )}
                            </span>
                          </div>

                          {/* Price */}
                          {mod.price != null && mod.price > 0 && (
                            <span className="shrink-0 font-mono text-[10px] text-dim">
                              {mod.price.toLocaleString()}cr
                            </span>
                          )}

                          {/* Selected indicator */}
                          {isSelected && (
                            <span className="shrink-0 font-mono text-[9px] uppercase tracking-wide text-accent">
                              EQ
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="font-mono text-xs text-dim">
                      {search ? "No mods match your search" : "No mods available"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hint when no slot is active */}
          {!activeSlot && equippedCount === 0 && (
            <div className="flex items-center justify-center rounded-md border border-border/40 py-6">
              <p className="font-mono text-xs text-dim">
                Select a slot above to add mods
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm" style={{ color: "#ff2244" }}>
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-dim">
              {equippedCount > 0
                ? `${equippedCount} mod${equippedCount > 1 ? "s" : ""} selected`
                : ""}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetAndClose}
                className="cursor-pointer rounded-md px-3 py-1.5 text-sm text-dim transition-colors hover:text-foreground"
                disabled={createBuild.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || createBuild.isPending}
                className="cursor-pointer rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-white transition-opacity disabled:opacity-40"
              >
                {createBuild.isPending ? "Saving..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
