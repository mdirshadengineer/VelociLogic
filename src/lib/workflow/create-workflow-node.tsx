import type { AppNode, TaskType } from "src/lib/types";

export function createWorkflowNode(
  nodeType: TaskType,
  position?: { x: number; y: number },
): AppNode {
  return {
    id: crypto.randomUUID(),
    data: {
      type: nodeType,
      inputs: {},
    },
    position: position ?? { x: 0, y: 0 },
    type: "VelociLogicNode",
    dragHandle: ".drag-handle",
  };
}
