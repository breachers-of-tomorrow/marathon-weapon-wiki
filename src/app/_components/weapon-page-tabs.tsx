"use client";

import { useState, useEffect, type ReactNode } from "react";

export function WeaponPageTabs({
  detailsContent,
  buildsContent,
  ttkContent,
  variantsContent,
}: {
  detailsContent: ReactNode;
  buildsContent: ReactNode;
  ttkContent: ReactNode;
  variantsContent?: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"details" | "ttk" | "builds" | "variants">("details");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tour") === "builds") {
      setActiveTab("builds");
    }
  }, []);

  const tabs: { key: typeof activeTab; label: string; dataTour?: string; show: boolean }[] = [
    { key: "details", label: "Details", show: true },
    { key: "ttk", label: "TTK", show: true },
    { key: "builds", label: "Builds", dataTour: "builds-tab", show: true },
    { key: "variants", label: "Unique Variants", show: !!variantsContent },
  ];

  return (
    <>
      {/* Tab bar */}
      <div className="mt-4 mb-6 flex gap-1.5" data-tour="tab-bar">
        {tabs
          .filter((tab) => tab.show)
          .map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              data-tour={tab.dataTour}
              className={`cursor-pointer rounded px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
                activeTab === tab.key
                  ? tab.key === "variants"
                    ? "bg-amber-500 text-background"
                    : "bg-accent text-background"
                  : "border border-border bg-panel text-dim hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
      </div>

      {activeTab === "details" && detailsContent}
      {activeTab === "ttk" && ttkContent}
      {activeTab === "builds" && buildsContent}
      {activeTab === "variants" && variantsContent}
    </>
  );
}
