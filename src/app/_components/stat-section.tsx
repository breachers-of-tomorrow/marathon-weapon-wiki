interface StatRow {
  label: string;
  value: number;
  max?: number;
}

export function StatSection({
  title,
  stats,
}: {
  title: string;
  stats: StatRow[];
}) {
  if (stats.length === 0) return null;

  return (
    <div className="cryo-panel rounded-lg p-4">
      <h3 className="text-heading mb-3 font-mono text-xs uppercase tracking-widest">
        {title}
      </h3>
      <div className="space-y-2">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-dim">{stat.label}</span>
              <span className="font-mono text-foreground">{stat.value}</span>
            </div>
            {stat.max != null && stat.max > 0 && (
              <div className="bg-border mt-1 h-1 rounded-full">
                <div
                  className="bg-accent h-1 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (stat.value / stat.max) * 100)}%`,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type WeaponData = Record<string, number | null | undefined>;

export function WeaponStats({ weapon }: { weapon: WeaponData }) {
  const buildStats = (
    entries: [string, string, number?][],
  ): StatRow[] =>
    entries
      .filter(([key]) => weapon[key] != null)
      .map(([key, label, max]) => ({
        label,
        value: weapon[key]!,
        max,
      }));

  const sections: { title: string; stats: StatRow[] }[] = [
    {
      title: "Combat",
      stats: buildStats([
        ["firepower", "Firepower", 100],
        ["damage", "Damage", 100],
        ["precisionMultiplier", "Precision Multiplier"],
        ["rateOfFire", "Rate of Fire", 1200],
        ["range", "Range", 100],
      ]),
    },
    {
      title: "Accuracy",
      stats: buildStats([
        ["accuracy", "Accuracy", 100],
        ["hipfireSpread", "Hipfire Spread"],
        ["adsSpread", "ADS Spread"],
        ["crouchSpreadBonus", "Crouch Spread Bonus"],
        ["movingInaccuracy", "Moving Inaccuracy"],
      ]),
    },
    {
      title: "Handling",
      stats: buildStats([
        ["handling", "Handling", 100],
        ["equipSpeed", "Equip Speed"],
        ["adsSpeed", "ADS Speed"],
        ["reloadSpeed", "Reload Speed"],
        ["weight", "Weight"],
        ["recoil", "Recoil"],
        ["aimAssist", "Aim Assist", 100],
      ]),
    },
    {
      title: "Magazine & Optics",
      stats: buildStats([
        ["magazineSize", "Magazine Size"],
        ["zoom", "Zoom"],
      ]),
    },
    {
      title: "Special",
      stats: buildStats([
        ["pelletCount", "Pellet Count"],
        ["spreadAngle", "Spread Angle"],
        ["voltDrain", "Volt Drain"],
        ["chargeTime", "Charge Time"],
      ]),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sections.map(
        (section) =>
          section.stats.length > 0 && (
            <StatSection
              key={section.title}
              title={section.title}
              stats={section.stats}
            />
          ),
      )}
    </div>
  );
}
