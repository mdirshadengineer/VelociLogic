import React from "react";
import { Handle, Position } from "@xyflow/react";
import { TaskParam } from "src/lib/types";
import { cn } from "shared/lib/utils";
import { ColorForHandle } from "../common";

interface NodeOutputProps {
  output: TaskParam;
}

/**
 * Renders an output handle for a workflow node in the visual editor.
 * @param output - The output parameter for the node
 */
function NodeOutput({ output }: NodeOutputProps) {
  return (
    <div className="flex justify-end relative p-3 bg-secondary">
      <p className="text-xs text-muted-foreground">{output.name}</p>
      <Handle
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(
          "!bg-muted-foreground !border-r-2 !border-background !-mr-2 !w-4 !h-4",
          ColorForHandle[output.type],
        )}
      />
    </div>
  );
}

export default NodeOutput;
