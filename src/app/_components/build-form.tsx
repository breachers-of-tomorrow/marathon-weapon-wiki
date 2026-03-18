"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { api } from "@/trpc/react";
import { ModSlot } from "./mod-slot";
import { ModCard } from "./mod-card";
import { RarityBadge, RARITY_COLORS } from "./rarity-badge";

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

const TYPE_ORDER = [
  "BARREL",
  "GRIP",
  "MAGAZINE",
  "OPTIC",
  "SHIELD",
  "GENERATOR",
  "CHIP",
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
  const [buildType, setBuildType] = useState<(typeof BUILD_TYPES)[number]>(
    "PVP",
  );
  const [selectedMods, setSelectedMods] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

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
    setExpandedType(null);
    setActiveDragId(null);
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

  const allModsById = new Map(allMods.map((m) => [m.id, m]));

  const selectMod = useCallback(
    (type: string, modId: string) => {
      setSelectedMods((prev) => ({ ...prev, [type]: modId }));
      setExpandedType(null);
    },
    [],
  );

  const clearMod = useCallback((type: string) => {
    setSelectedMods((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  }, []);

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;

    const mod = active.data.current?.mod as Mod | undefined;
    const slotType = over.data.current?.type as string | undefined;
    if (mod && slotType && mod.type === slotType) {
      selectMod(slotType, mod.id);
    }
  }

  const activeDragMod = activeDragId
    ? allModsById.get(activeDragId)
    : undefined;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !createBuild.isPending)
          resetAndClose();
      }}
    >
      <div className="cryo-panel mx-4 w-full max-w-lg rounded-lg border-border-accent p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Submit Build
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1"
        >
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

          {/* Mod Slots */}
          <div>
            <label className="mb-1 block text-sm text-dim">Mods</label>
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-1.5">
                {Array.from(modsByType.entries()).map(([type, mods]) => {
                  const selectedModId = selectedMods[type];
                  const selectedMod = selectedModId
                    ? allModsById.get(selectedModId)
                    : undefined;
                  const isExpanded = expandedType === type;

                  return (
                    <div key={type}>
                      <ModSlot
                        type={type}
                        selectedMod={selectedMod}
                        expanded={isExpanded}
                        onToggle={() =>
                          setExpandedType(isExpanded ? null : type)
                        }
                        onClear={() => clearMod(type)}
                        disabled={createBuild.isPending}
                      />

                      {/* Inline picker */}
                      {isExpanded && (
                        <div className="mt-1 mb-1 space-y-1 pl-2">
                          {mods.map((mod) => (
                            <ModCard
                              key={mod.id}
                              mod={mod}
                              selected={selectedModId === mod.id}
                              onClick={() => selectMod(type, mod.id)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <DragOverlay dropAnimation={null}>
                {activeDragMod && (
                  <div
                    className="w-72 scale-105 rounded-md border border-accent bg-panel p-2.5 opacity-90 shadow-lg"
                    style={{
                      borderLeftWidth: "3px",
                      borderLeftColor:
                        RARITY_COLORS[activeDragMod.rarity] ?? "#6b7280",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-sm text-foreground">
                        {activeDragMod.name}
                      </span>
                      <RarityBadge rarity={activeDragMod.rarity} />
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
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
