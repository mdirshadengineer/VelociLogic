import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { Badge } from "shared/ui/badge";
import NodeCard from "./node-card";
import NodeHeader from "./node-header";
import NodeInput from "./node-input";
import NodeOutput from "./params/node-output";
import NodeIO from "./node-io";
import { AppNodeData } from "src/lib/types";
import { TaskRegistry } from "src/lib/workflow/task/registry";

const DEV_MODE = process?.env?.NEXT_PUBLIC_DEV_MODE === "true";

/**
 * Visual workflow node component for React Flow.
 * Renders node header, inputs, and outputs using the task registry.
 * @param props - NodeProps from React Flow
 */
const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const task = TaskRegistry[nodeData.type];

  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      {DEV_MODE && <Badge>DEV:{props.id}</Badge>}
      <NodeHeader taskType={nodeData.type} nodeId={props.id} />
      <NodeIO>
        {task.inputs.map((input) => (
          <NodeInput input={input} key={input.name} nodeId={props.id} />
        ))}
      </NodeIO>
      <NodeIO>
        {task.outputs.map((output) => (
          <NodeOutput output={output} key={output.name} />
        ))}
      </NodeIO>
    </NodeCard>
  );
});

NodeComponent.displayName = "NodeComponent";
export default NodeComponent;
