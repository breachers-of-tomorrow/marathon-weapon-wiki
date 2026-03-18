import type { WeaponTTK } from "../../../generated/prisma";
import { getTtkColor, shieldTiers, formatTtk } from "@/lib/ttk-utils";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="cryo-panel rounded-lg p-3 text-center">
      <div className="text-dim font-mono text-xs tracking-widest uppercase">
        {label}
      </div>
      <div className="font-display text-foreground mt-1 text-xl font-bold">
        {value}
      </div>
    </div>
  );
}

export function WeaponTTKSection({ ttk }: { ttk: WeaponTTK }) {
  const bodyValues = [ttk.ttkWhite, ttk.ttkGreen, ttk.ttkBlue, ttk.ttkPurple];
  const headValues = [
    ttk.ttkHeadWhite,
    ttk.ttkHeadGreen,
    ttk.ttkHeadBlue,
    ttk.ttkHeadPurple,
  ];

  return (
    <div>
      <h2 className="text-heading font-display heading-glow mb-4 text-sm tracking-widest uppercase">
        Time to Kill
      </h2>

      {/* Stats cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Damage" value={String(ttk.damage)} />
        <StatCard label="RPM" value={String(ttk.rpm)} />
        <StatCard label="DPS" value={ttk.dps.toFixed(1)} />
        <StatCard label="HS Multiplier" value={`${ttk.headshotMultiplier}x`} />
        <StatCard label="Range" value={`${ttk.range}m`} />
        <StatCard label="Shots to Kill" value={ttk.shotsToKill} />
      </div>

      {/* TTK Table */}
      <div className="cryo-panel overflow-x-auto rounded-lg">
        <table className="w-full text-base">
          <thead>
            <tr className="border-border border-b">
              <th className="text-dim p-3 text-left font-mono text-sm tracking-widest uppercase">
                Shield Tier
              </th>
              {shieldTiers.map((tier) => (
                <th
                  key={tier.key}
                  className={`p-3 text-center font-mono text-sm tracking-widest uppercase ${tier.color}`}
                >
                  {tier.key}
                  <div className="text-dim mt-0.5 text-xs font-normal">
                    {tier.hp} HP
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-border/50 border-b">
              <td className="text-dim p-3 font-mono text-sm tracking-widest uppercase">
                Body TTK
              </td>
              {bodyValues.map((val, i) => (
                <td
                  key={i}
                  className={`p-3 text-center font-mono font-bold ${getTtkColor(val)}`}
                >
                  {formatTtk(val)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="text-dim p-3 font-mono text-sm tracking-widest uppercase">
                Headshot TTK
              </td>
              {headValues.map((val, i) => (
                <td
                  key={i}
                  className={`p-3 text-center font-mono font-bold ${getTtkColor(val)}`}
                >
                  {formatTtk(val)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Credit */}
      <a
        href="https://docs.google.com/spreadsheets/d/1xiBwYPWsJbQKErFKXBS89ZKFSEXM3BcF9XXASIkjAak/edit?gid=0#gid=0"
        className="text-dim mt-4 block text-right font-mono text-xs underline"
      >
        Data by CoolGuy
      </a>
    </div>
  );
}
