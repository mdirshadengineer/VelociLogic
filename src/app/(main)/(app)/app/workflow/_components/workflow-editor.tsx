"use client";

import "@xyflow/react/dist/style.css";
import React, { useEffect, useCallback } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  getOutgoers,
} from "@xyflow/react";
import { Workflow } from "@prisma/client";
import type { AppNode, TaskType } from "src/lib/types";
import type { Connection, Edge } from "@xyflow/react";
import NodeComponent from "./nodes/node-component";
import DeletableEdge from "./edges/deleteable-edge";
import { createWorkflowNode } from "src/lib/workflow/create-workflow-node";
import { TaskRegistry } from "src/lib/workflow/task/registry";

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };
const nodeTypes = { VelociLogicNode: NodeComponent };
const edgeTypes = { default: DeletableEdge };

interface WorkflowEditorProps {
  workflow: Workflow;
  isPublished: boolean;
}

function WorkflowEditor({ workflow, isPublished }: WorkflowEditorProps) {
  const [nodes, setNodes, onNodeChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition as string);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      // Optionally restore viewport
      // if (flow.viewport) setViewport(flow.viewport);
    } catch {}
  }, [workflow, setEdges, setNodes, setViewport]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const taskType = event.dataTransfer.getData("application/reactflow");
      if (!taskType) return;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = createWorkflowNode(taskType as TaskType, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, screenToFlowPosition],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) return;
      const node = nodes.find((node) => node.id === connection.target);
      if (!node) return;
      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: {
          ...nodeInputs,
          [connection.targetHandle]: "",
        },
      });
    },
    [setEdges, updateNodeData, nodes],
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      if (connection.source === connection.target) return false;
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);
      if (!sourceNode || !targetNode) return false;
      const sourceTask = TaskRegistry[sourceNode.data.type];
      const targetTask = TaskRegistry[targetNode.data.type];
      const output = sourceTask.outputs.find(
        (o) => o.name === connection.sourceHandle,
      );
      const input = targetTask.inputs.find(
        (i) => i.name === connection.targetHandle,
      );
      if (input?.type !== output?.type) return false;
      // Avoid cyclic connections
      const hasCycle = (node: AppNode, visited = new Set<string>()) => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);
        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };
      return !hasCycle(targetNode);
    },
    [nodes, edges],
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={isPublished ? undefined : onNodeChange}
        onEdgesChange={isPublished ? undefined : onEdgeChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={isPublished ? undefined : onDragOver}
        onDrop={isPublished ? undefined : onDrop}
        onConnect={isPublished ? undefined : onConnect}
        isValidConnection={isPublished ? undefined : isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default WorkflowEditor;
