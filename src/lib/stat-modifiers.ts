export type StatModifier = {
  stat: string;
  direction: "up" | "down";
  label: string;
  value?: number;
};

export function parseStatModifiers(json: unknown): StatModifier[] {
  if (!Array.isArray(json)) return [];
  return json.filter(
    (item): item is StatModifier =>
      typeof item === "object" &&
      item !== null &&
      typeof item.stat === "string" &&
      (item.direction === "up" || item.direction === "down") &&
      typeof item.label === "string",
  );
}

export function aggregateStatModifiers(
  modifiers: StatModifier[][],
): Map<string, { label: string; ups: number; downs: number }> {
  const map = new Map<string, { label: string; ups: number; downs: number }>();
  for (const mods of modifiers) {
    for (const m of mods) {
      const existing = map.get(m.stat);
      if (existing) {
        if (m.direction === "up") existing.ups++;
        else existing.downs++;
      } else {
        map.set(m.stat, {
          label: m.label,
          ups: m.direction === "up" ? 1 : 0,
          downs: m.direction === "down" ? 1 : 0,
        });
      }
    }
  }
  return map;
}
