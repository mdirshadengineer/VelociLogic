"use client";

import React, { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { AppNode, TaskParam, TaskParamType } from "src/lib/types";
import StringParam from "./params/string-param";
import BrowserInstance from "./params/browser-instance";
import SelectParam from "./params/select-param";
import CredentialsParam from "./params/credentials-param";

interface NodeParamFieldProps {
  param: TaskParam;
  nodeId: string;
  disabled: boolean;
}

/**
 * Renders the appropriate parameter input field for a workflow node based on type.
 * Handles updating node data in React Flow.
 * @param param - The parameter definition
 * @param nodeId - The node's unique ID
 * @param disabled - Whether the input is disabled
 */
function NodeParamField({ param, nodeId, disabled }: NodeParamFieldProps) {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value = node?.data?.inputs?.[param.name];

  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data?.inputs,
          [param.name]: newValue,
        },
      });
    },
    [updateNodeData, param.name, node?.data?.inputs, nodeId],
  );

  switch (param.type) {
    case TaskParamType.STRING:
      return (
        <StringParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case TaskParamType.BROWSE_INSTANCE:
      return (
        <BrowserInstance
          param={param}
          updateNodeParamValue={updateNodeParamValue}
          value=""
        />
      );
    case TaskParamType.SELECT:
      return (
        <SelectParam
          param={param}
          updateNodeParamValue={updateNodeParamValue}
          value={value}
        />
      );
    case TaskParamType.CREDENTIAL:
      return (
        <CredentialsParam
          param={param}
          updateNodeParamValue={updateNodeParamValue}
          value={value}
        />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not Implemented</p>
        </div>
      );
  }
}

export default NodeParamField;
