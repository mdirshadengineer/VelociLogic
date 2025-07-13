"use client";

import "@xyflow/react/dist/style.css";
import React, { useEffect, useCallback, useState } from "react";
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
  MiniMap,
} from "@xyflow/react";
import { Workflow } from "@prisma/client";
import type { AppNode, TaskType } from "src/lib/types";
import type {
  Connection,
  Edge,
  OnConnectStartParams,
  ReactFlowInstance,
} from "@xyflow/react";
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

  const [events, setEvents] = useState({
    onReconnectStart: false,
    onConnectStart: true,
    onConnect: false,
    onReconnect: false,
    onConnectEnd: false,
    onReconnectEnd: false,
  });

  const onReconnectStart = useCallback(() => {
    console.log("onReconnectStart");
    setEvents({
      onReconnectStart: true,
      onConnectStart: false,
      onConnect: false,
      onReconnect: false,
      onConnectEnd: false,
      onReconnectEnd: false,
    });
  }, []);

  const onReconnect = useCallback(() => {
    console.log("onReconnect");
    setEvents({
      onReconnectStart: false,
      onConnectStart: false,
      onConnect: false,
      onReconnect: true,
      onConnectEnd: false,
      onReconnectEnd: false,
    });
  }, []);

  const onReconnectEnd = useCallback(() => {
    console.log("onReconnectEnd");
    setEvents((events) => ({
      ...events,
      onReconnectStart: false,
      onConnectStart: false,
      onReconnectEnd: true,
    }));
  }, []);

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

  useEffect(() => {
    if (!events.onReconnectEnd && !events.onConnectEnd) return;

    let timer = window.setTimeout(() => {
      setEvents({
        onReconnectStart: false,
        onConnectStart: false,
        onConnect: false,
        onReconnect: false,
        onConnectEnd: false,
        onReconnectEnd: false,
      });
    }, 500);

    return () => window.clearTimeout(timer);
  });

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
    [setNodes, screenToFlowPosition]
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

      setEvents({
        onReconnectStart: false,
        onConnectStart: false,
        onConnect: true,
        onReconnect: false,
        onConnectEnd: false,
        onReconnectEnd: false,
      });
    },
    [setEdges, updateNodeData, nodes]
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
        (o) => o.name === connection.sourceHandle
      );
      const input = targetTask.inputs.find(
        (i) => i.name === connection.targetHandle
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
    [nodes, edges]
  );

  const [showNodePanel, setShowNodePanel] = useState(false);
  const [panelPosition, setPanelPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [pendingConnection, setPendingConnection] = useState<{
    source: string;
    sourceHandle: string | null;
  } | null>(null);

  const flowWrapper = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Hide node panel when clicking outside
  useEffect(() => {
    if (!showNodePanel) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNodePanel(false);
        setPanelPosition(null);
        setPendingConnection(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, [showNodePanel]);

  // Store source node info on connect start
  const handleConnectStart = (
    _event: MouseEvent | TouchEvent,
    params: OnConnectStartParams
  ) => {
    setShowNodePanel(false);
    setPanelPosition(null);
    if (params.nodeId) {
      setPendingConnection({
        source: params.nodeId,
        sourceHandle: params.handleId ?? null,
      });
    } else {
      setPendingConnection(null);
    }
  };

  // Show panel at edge drop position on connect end
  const handleConnectEnd = (event: MouseEvent | TouchEvent, _params: any) => {
    if ("clientX" in event && "clientY" in event && flowWrapper.current) {
      const rect = flowWrapper.current.getBoundingClientRect();
      setPanelPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
      setShowNodePanel(true);
    } else {
      setShowNodePanel(false);
      setPanelPosition(null);
      setPendingConnection(null);
    }
  };

  // When a node type is selected, create node and edge
  const handleNodeTypeSelect = (type: keyof typeof TaskRegistry) => {
    if (!panelPosition || !pendingConnection) return;

    // Create new node at panel position
    const newNodeId = `node_${Date.now()}`;
    const newNode: AppNode = {
      id: newNodeId,
      type: "VelociLogicNode",
      position: { x: panelPosition.x, y: panelPosition.y },
      data: {
        type,
        label: TaskRegistry[type].label,
        inputs: {},
        outputs: {},
      },
    };

    // Create edge from source to new node
    const newEdge: Edge = {
      id: `edge_${Date.now()}`,
      source: pendingConnection.source,
      sourceHandle: pendingConnection.sourceHandle ?? undefined,
      target: newNodeId,
      targetHandle: undefined,
      type: "default",
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    setShowNodePanel(false);
    setPanelPosition(null);
    setPendingConnection(null);
  };

  return (
    <div className="w-full h-full" ref={flowWrapper}>
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
        onConnectStart={handleConnectStart}
        onReconnectStart={onReconnectStart}
        onReconnect={isPublished ? undefined : onReconnect}
        onConnectEnd={handleConnectEnd}
        onReconnectEnd={onReconnectEnd}
        isValidConnection={isPublished ? undefined : isValidConnection}
        zoomOnScroll={false} // 🔧 Disable zoom on wheel scroll
        panOnScroll={true} // ✅ Enable panning
      >
        <MiniMap />
        <Controls position="bottom-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      {showNodePanel && panelPosition && (
        <NodeTypePanel
          ref={panelRef}
          x={panelPosition.x}
          y={panelPosition.y}
          nodeTypes={
            Object.keys(TaskRegistry) as Array<keyof typeof TaskRegistry>
          }
          onSelect={handleNodeTypeSelect}
        />
      )}
    </div>
  );
}

type NodeTypePanelProps = {
  x: number;
  y: number;
  nodeTypes: Array<keyof typeof TaskRegistry>;
  onSelect: (type: keyof typeof TaskRegistry) => void;
};

const NodeTypePanel = React.forwardRef<HTMLDivElement, NodeTypePanelProps>(
  ({ x, y, nodeTypes, onSelect }, ref) => (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: y,
        left: x,
        background: "#fff",
        border: "2px solid #007bff",
        borderRadius: 8,
        padding: 24,
        zIndex: 100,
        minWidth: 240,
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 12 }}>
        Select Node Type
      </div>
      <ul>
        {nodeTypes.map((type) => (
          <li key={type} style={{ marginBottom: 8 }}>
            <button
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px",
                borderRadius: 4,
                background: "#f0f8ff",
                border: "1px solid #007bff",
              }}
              onClick={() => onSelect(type)}
            >
              {TaskRegistry[type].label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
);

export default WorkflowEditor;
