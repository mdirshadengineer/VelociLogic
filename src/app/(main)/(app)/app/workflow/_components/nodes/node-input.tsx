"use client";

import React from "react";
import { Handle, Position, useEdges } from "@xyflow/react";
import { TaskParam } from "src/lib/types";
import { cn } from "shared/lib/utils";
import NodeParamField from "./node-param-field";
import { ColorForHandle } from "./common";
import useFlowValidation from "src/hooks/use-flow-validation";

interface NodeInputProps {
  input: TaskParam;
  nodeId: string;
}

/**
 * Renders an input handle and parameter field for a workflow node.
 * Highlights errors and disables input if connected.
 * @param input - The input parameter for the node
 * @param nodeId - The node's unique ID
 */
function NodeInput({ input, nodeId }: NodeInputProps) {
  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name,
  );
  const { invalidInputs } = useFlowValidation();
  const hasErrors = invalidInputs
    .find((node) => node.nodeId === nodeId)
    ?.inputs.includes(input.name);

  return (
    <div
      className={cn(
        "flex justify-start relative p-3 bg-secondary w-full",
        hasErrors && "bg-destructive/30",
      )}
    >
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
            ColorForHandle[input.type],
          )}
          isConnectable={!isConnected}
        />
      )}
    </div>
  );
}

export default NodeInput;
