import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { TaskParam } from "src/lib/types";
import { cn } from "shared/lib/utils";
import { ColorForHandle } from "../common";
import { TaskRegistry } from "src/lib/workflow/task/registry";

interface NodeOutputProps {
  output: TaskParam;
}

/**
 * Renders an output handle for a workflow node in the visual editor.
 * @param output - The output parameter for the node
 */
const NodeOutput = ({ output, ...props }: NodeOutputProps) => {
  // Debug: log when component mounts and when output is clicked
  React.useEffect(() => {
    console.debug("[NodeOutput] mounted for output:", output);
  }, [output]);

  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  // List of available node types
  const nodeTypes = Object.keys(TaskRegistry) as (keyof typeof TaskRegistry)[];

  const handleMenuOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setMenuPosition({ x: rect.right, y: rect.top });
    setShowMenu(true);
    console.log("Menu opened at:", menuPosition);
  };

  const handleOutputClick = () => {
    console.debug("[NodeOutput] Output clicked:", output);
    setShowMenu(true);
  };

  const handleNodeSelect = (type: string) => {
    console.debug("[NodeOutput] Node type selected:", type);
    setShowMenu(false);
    // TODO: Implement node creation and connection logic here
  };

  return (
    <div id={"node-output" + "-" + output.name} className="flex justify-end relative p-3 bg-secondary">
      <p className="text-xs text-muted-foreground mr-2">{output.name}</p>
      <div className="relative">
        <Handle
          id={output.name}
          type="source"
          position={Position.Right}
          className={cn(
            "!bg-muted-foreground !border-r-2 !border-background !-mr-6 !w-4 !h-4 cursor-pointer",
            ColorForHandle[output.type],
          )}
          onClick={handleMenuOpen}
        />
        {showMenu && menuPosition && (
          <div
            className="absolute z-50 left-8 top-0 bg-card border rounded-lg shadow-lg p-2 min-w-[160px]"
            style={{ left: 32, top: 0 }}
          >
            <div className="font-bold text-xs mb-2">Select node to connect:</div>
            <ul>
              {nodeTypes.map((type) => (
                <li key={type}>
                  <button
                    className="w-full text-left px-2 py-1 rounded hover:bg-accent text-xs"
                    onClick={() => handleNodeSelect(type)}
                  >
                    {TaskRegistry[type].label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default NodeOutput;
