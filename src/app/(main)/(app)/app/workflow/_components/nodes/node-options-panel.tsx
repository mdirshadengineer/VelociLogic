import React, { useState } from "react";
import { cn } from "shared/lib/utils";

interface NodeOptionsPanelProps {
  nodeId: string;
}

const TABS = ["Inputs", "Logs", "Data", "Settings", "JSON"];

function NodeOptionsPanel({ nodeId }: NodeOptionsPanelProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "mt-4 flex flex-col w-[420px] bg-background border-2 border-separate text-xs shadow"
      )}
    >
      <div className="flex gap-2 bg-card p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
              activeTab === tab
                ? "bg-primary text-primary-foreground shadow"
                : "hover:bg-accent text-muted-foreground"
            }`}
            onClick={() => setActiveTab(activeTab === tab ? null : tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div
        className={`w-full overflow-hidden rounded-b-xl bg-background text-xs transition-all duration-300 ${
          activeTab
            ? "max-h-40 p-3 opacity-100 border-t"
            : "max-h-0 p-0 opacity-0 border-t-0"
        }`}
        aria-expanded={!!activeTab}
      >
        {activeTab === "Inputs" && <div>Show node inputs for {nodeId}</div>}
        {activeTab === "Data" && <div>Show node data for {nodeId}</div>}
        {activeTab === "Settings" && <div>Show node settings for {nodeId}</div>}
        {activeTab === "JSON" && <div>Show node JSON for {nodeId}</div>}
      </div>
    </div>
  );
}

export default NodeOptionsPanel;
