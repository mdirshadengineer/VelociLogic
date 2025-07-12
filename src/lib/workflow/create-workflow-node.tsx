import type { AppNode, TaskType } from "src/lib/types";

/**
 * Creates a new workflow node of the specified type and position.
 * @param nodeType - The type of the workflow node (TaskType)
 * @param position - Optional position { x, y } for the node
 * @returns {AppNode} The newly created workflow node
 */
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
