"use client";

import React, { Fragment } from "react";
import { useReactFlow } from "@xyflow/react";
import { Badge } from "shared/ui/badge";
import { Button } from "shared/ui/button";
import { Coins, CopyIcon, GripVerticalIcon, TrashIcon, PlayIcon } from "lucide-react";
import { AppNode, TaskType } from "src/lib/types";
import { createWorkflowNode } from "src/lib/workflow/create-workflow-node";
import { TaskRegistry } from "src/lib/workflow/task/registry";

interface NodeHeaderProps {
  taskType: TaskType;
  nodeId: string;
}

/**
 * Header component for a workflow node, showing icon, label, credits, and actions.
 * Allows node deletion, duplication, and drag handle.
 * @param taskType - The type of the task for the node
 * @param nodeId - The node's unique ID
 */
function NodeHeader({ taskType, nodeId }: NodeHeaderProps) {
  const task = TaskRegistry[taskType];
  const { deleteElements, getNode, addNodes } = useReactFlow();

  const copyNode = () => {
    const node = getNode(nodeId) as AppNode;
    const newX = node.position.x;
    const newY = node.position.y + (node.measured?.height ?? 0) + 20;
    const newNode = createWorkflowNode(node.data.type, { x: newX, y: newY });
    addNodes([newNode]);
  };

  return (
    <div className="flex items-center gap-2 p-2">
      <Badge className="flex py-2 items-center gap-1 border-none bg-transparent ring ring-gray-200">
        <task.icon size={16} />
      </Badge>
      <div className="flex items-center justify-between w-full gap-1">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge className="py-1">Entry Point</Badge>}
          <Badge className="flex gap-2 items-center text-xs py-1">
            <Coins size={16} />
            {task.credits}
          </Badge>
          {!task.isEntryPoint && (
            <Fragment>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteElements({ nodes: [{ id: nodeId }] })}
              >
                <TrashIcon size={12} />
              </Button>
              <Button variant="ghost" size="icon" onClick={copyNode}>
                <CopyIcon size={12} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {/* TODO: Implement test execution logic for nodeId */}}
                title="Test execution"
              >
                <PlayIcon size={12} />
              </Button>
            </Fragment>
          )}
          
          {/* Drag handle for reordering nodes */}
          <Button
            variant="ghost"
            size="icon"
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NodeHeader;
