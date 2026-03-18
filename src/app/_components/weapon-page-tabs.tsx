"use client";

import { useState, type ReactNode } from "react";

export function WeaponPageTabs({
  detailsContent,
  buildsContent,
}: {
  detailsContent: ReactNode;
  buildsContent: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"details" | "builds">("details");

  return (
    <>
      {/* Tab bar */}
      <div className="mt-4 mb-6 flex gap-1.5">
        <button
          onClick={() => setActiveTab("details")}
          className={`cursor-pointer rounded px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
            activeTab === "details"
              ? "bg-accent text-background"
              : "border border-border bg-panel text-dim hover:text-foreground"
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab("builds")}
          className={`cursor-pointer rounded px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
            activeTab === "builds"
              ? "bg-accent text-background"
              : "border border-border bg-panel text-dim hover:text-foreground"
          }`}
        >
          Builds
        </button>
      </div>

      {activeTab === "details" ? detailsContent : buildsContent}
    </>
  );
}
