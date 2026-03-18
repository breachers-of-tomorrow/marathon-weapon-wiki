import { parseStatModifiers, type StatModifier } from "@/lib/stat-modifiers";

export function StatModifierBadges({ statModifiers }: { statModifiers: unknown }) {
  const mods = parseStatModifiers(statModifiers);
  if (mods.length === 0) return null;

  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {mods.map((m, i) => (
        <span
          key={`${m.stat}-${i}`}
          className="rounded px-1.5 py-0.5 font-mono text-[10px]"
          style={{
            backgroundColor: m.direction === "up" ? "#00ff9d20" : "#ff224420",
            color: m.direction === "up" ? "#00ff9d" : "#ff2244",
          }}
        >
          {m.direction === "up" ? "↑" : "↓"} {m.label}
        </span>
      ))}
    </div>
  );
}
