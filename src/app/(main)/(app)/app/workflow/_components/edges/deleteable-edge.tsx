"use client";

import React, { Fragment } from "react";
import { Button } from "shared/ui/button";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { IconCircleDashedX } from "@tabler/icons-react";

/**
 * Custom edge component for React Flow that allows deletion via a button on the edge label.
 * @param props - EdgeProps from React Flow
 */
function DeletableEdge(props: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath(props);
  const { setEdges } = useReactFlow();

  const handleDelete = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== props.id));
  };

  return (
    <Fragment>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="w-5 h-5 cursor-pointer rounded-full text-xs leading-none hover:shadow-lg flex items-center justify-center"
            onClick={handleDelete}
          >
            <IconCircleDashedX size={48} className="" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </Fragment>
  );
}

export default DeletableEdge;
