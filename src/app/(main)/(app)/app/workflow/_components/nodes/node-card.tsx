"use client";

import React from "react";
import { useReactFlow } from "@xyflow/react";
import useFlowValidation from "src/hooks/use-flow-validation";
import { cn } from "shared/lib/utils";

interface NodeCardProps {
  nodeId: string;
  children: React.ReactNode;
  isSelected: boolean;
}

/**
 * Card component for a workflow node in the visual editor.
 * Highlights selection and validation errors, and centers node on double-click.
 * @param nodeId - The node's unique ID
 * @param children - Node content
 * @param isSelected - Whether the node is currently selected
 */
function NodeCard({ nodeId, children, isSelected }: NodeCardProps) {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidation();
  const hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId);

  const centerNode = () => {
    const node = getNode(nodeId);
    if (!node) return;
    const { position, measured } = node;
    if (!position || !measured) return;
    const { width, height } = measured;
    const x = position.x + (width ?? 0) / 2;
    const y = position.y + (height ?? 0) / 2;
    if (x === undefined || y === undefined) return;
    setCenter(x, y, { zoom: 1, duration: 500 });
  };

  return (
    <div
      onDoubleClick={centerNode}
      className={cn(
        "cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 flex-col",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive border-2",
      )}
    >
      {children}
    </div>
  );
}

export default NodeCard;
