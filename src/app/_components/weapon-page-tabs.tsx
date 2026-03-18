"use client";

import { useState, useEffect, type ReactNode } from "react";

export function WeaponPageTabs({
  detailsContent,
  buildsContent,
  ttkContent,
}: {
  detailsContent: ReactNode;
  buildsContent: ReactNode;
  ttkContent: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"details" | "ttk" | "builds">("details");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tour") === "builds") {
      setActiveTab("builds");
    }
  }, []);

  const tabs = [
    { key: "details" as const, label: "Details" },
    { key: "ttk" as const, label: "TTK" },
    { key: "builds" as const, label: "Builds", dataTour: "builds-tab" },
  ];

  return (
    <>
      {/* Tab bar */}
      <div className="mt-4 mb-6 flex gap-1.5" data-tour="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            data-tour={tab.dataTour}
            className={`cursor-pointer rounded px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
              activeTab === tab.key
                ? "bg-accent text-background"
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
    </>
  );
}
