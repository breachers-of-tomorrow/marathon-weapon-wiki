"use client";

import { useDroppable } from "@dnd-kit/core";
import { RarityBadge, RARITY_COLORS } from "./rarity-badge";

type Mod = {
  id: string;
  name: string;
  type: string;
  rarity: string;
  description: string | null;
  price: number | null;
};

export function ModSlot({
  type,
  selectedMod,
  expanded,
  onToggle,
  onClear,
  disabled,
}: {
  type: string;
  selectedMod: Mod | undefined;
  expanded: boolean;
  onToggle: () => void;
  onClear: () => void;
  disabled: boolean;
}) {
  const { setNodeRef, isOver, active } = useDroppable({
    id: `slot-${type}`,
    data: { type },
  });

  const isCompatibleDrag =
    isOver && active?.data.current?.mod?.type === type;

  const color = selectedMod
    ? (RARITY_COLORS[selectedMod.rarity] ?? "#6b7280")
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className={`rounded-md border transition-all ${
        isCompatibleDrag
          ? "border-accent bg-panel-hover"
          : isOver
            ? "border-danger/50"
            : expanded
              ? "border-border-accent"
              : "border-border"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="flex w-full cursor-pointer items-center gap-3 p-2.5 text-left"
      >
        <span className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-widest text-dim">
          {type}
        </span>

        {selectedMod ? (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className="h-4 w-0.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="truncate font-mono text-sm text-foreground">
              {selectedMod.name}
            </span>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {selectedMod.price != null && (
                <span className="font-mono text-[10px] text-dim">
                  {selectedMod.price === 0 ? "Free" : `${selectedMod.price.toLocaleString()}cr`}
                </span>
              )}
              <RarityBadge rarity={selectedMod.rarity} />
            </div>
          </div>
        ) : (
          <span className="font-mono text-xs text-dim">None</span>
        )}

        {selectedMod && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onClear();
              }
            }}
            className="ml-1 shrink-0 font-mono text-xs text-dim transition-colors hover:text-danger"
          >
            &times;
          </span>
        )}
      </button>
    </div>
  );
}
