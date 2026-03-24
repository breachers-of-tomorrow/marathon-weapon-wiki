"use client";

type StatEntry = {
  label: string;
  baseValue: number | null;
  variantValue: number | null;
};

type VariantWeapon = {
  id: string;
  name: string;
  description: string | null;
  firepower: number | null;
  damage: number | null;
  precisionMultiplier: number | null;
  rateOfFire: number | null;
  range: number | null;
  accuracy: number | null;
  hipfireSpread: number | null;
  adsSpread: number | null;
  crouchSpreadBonus: number | null;
  movingInaccuracy: number | null;
  handling: number | null;
  equipSpeed: number | null;
  adsSpeed: number | null;
  reloadSpeed: number | null;
  weight: number | null;
  recoil: number | null;
  aimAssist: number | null;
  magazineSize: number | null;
  zoom: number | null;
  pelletCount: number | null;
  spreadAngle: number | null;
  voltDrain: number | null;
  chargeTime: number | null;
};

type StatKey = keyof Omit<VariantWeapon, "id" | "name" | "description">;

const STAT_LABELS: [StatKey, string][] = [
  ["firepower", "Firepower"],
  ["damage", "Damage"],
  ["precisionMultiplier", "Precision"],
  ["rateOfFire", "Rate of Fire"],
  ["range", "Range"],
  ["accuracy", "Accuracy"],
  ["hipfireSpread", "Hipfire Spread"],
  ["adsSpread", "ADS Spread"],
  ["crouchSpreadBonus", "Crouch Spread"],
  ["movingInaccuracy", "Moving Inaccuracy"],
  ["handling", "Handling"],
  ["equipSpeed", "Equip Speed"],
  ["adsSpeed", "ADS Speed"],
  ["reloadSpeed", "Reload Speed"],
  ["weight", "Weight"],
  ["recoil", "Recoil"],
  ["aimAssist", "Aim Assist"],
  ["magazineSize", "Magazine"],
  ["zoom", "Zoom"],
  ["pelletCount", "Pellet Count"],
  ["spreadAngle", "Spread Angle"],
  ["voltDrain", "Volt Drain"],
  ["chargeTime", "Charge Time"],
];

// Stats where lower is better (so a decrease = green arrow)
const LOWER_IS_BETTER = new Set<StatKey>([
  "hipfireSpread",
  "adsSpread",
  "movingInaccuracy",
  "recoil",
  "weight",
  "voltDrain",
  "chargeTime",
  "equipSpeed",
  "adsSpeed",
  "reloadSpeed",
]);

export function VariantStatsComparison({
  baseWeapon,
  variant,
}: {
  baseWeapon: VariantWeapon;
  variant: VariantWeapon;
}) {
  const stats: StatEntry[] = STAT_LABELS.map(([key, label]) => ({
    label,
    baseValue: baseWeapon[key],
    variantValue: variant[key],
  })).filter((s) => s.variantValue != null);

  return (
    <div className="cryo-panel rounded-lg p-6">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="font-display text-lg font-bold uppercase tracking-widest text-foreground heading-glow">
          {variant.name}
        </h2>
        <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400 ring-1 ring-amber-500/30">
          Unique
        </span>
      </div>
      {variant.description && (
        <p className="text-dim mb-4 text-sm leading-relaxed">
          {variant.description}
        </p>
      )}

      <div className="cryo-panel rounded-lg px-3 py-2">
        {stats.map((stat) => {
          const diff =
            stat.baseValue != null && stat.variantValue != null
              ? Math.round((stat.variantValue - stat.baseValue) * 100) / 100
              : null;

          const hasDiff = diff != null && diff !== 0;

          // Determine if this diff is "good" or "bad" based on whether lower is better
          const statKey = STAT_LABELS.find(([, l]) => l === stat.label)?.[0];
          const isImprovement = hasDiff
            ? statKey && LOWER_IS_BETTER.has(statKey)
              ? diff < 0
              : diff > 0
            : false;

          return (
            <div
              key={stat.label}
              className="flex items-center justify-between border-b border-border/20 py-1.5 last:border-0"
            >
              <span
                className={`text-[13px] ${
                  hasDiff
                    ? isImprovement
                      ? "text-accent2"
                      : "text-danger"
                    : "text-dim"
                }`}
              >
                {stat.label}
              </span>
              <span
                className={`font-mono text-[13px] tabular-nums ${
                  hasDiff
                    ? isImprovement
                      ? "text-accent2"
                      : "text-danger"
                    : "text-foreground"
                }`}
              >
                {stat.variantValue}
                {hasDiff && (
                  <span
                    className="ml-1 text-[10px]"
                    style={{
                      color: isImprovement ? "#00ff9d" : "#ff2244",
                    }}
                  >
                    ({diff > 0 ? "+" : ""}
                    {diff}){" "}
                    {isImprovement ? "▲" : "▼"}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
