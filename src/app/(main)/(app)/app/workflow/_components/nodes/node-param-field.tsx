"use client";

import { Input } from "shared/ui/input";
import { AppNode, TaskParam, TaskParamType } from "src/lib/types";
import React, { useCallback } from "react";
import StringParam from "./params/string-param";
import { useReactFlow } from "@xyflow/react";
import BrowserInstance from "./params/browser-instance";
import SelectParam from "./params/select-param";
import CredentialsParam from "./params/credentials-param";

function NodeParamField({
  param,
  nodeId,
  disabled,
}: {
  param: TaskParam;
  nodeId: string;
  disabled: boolean;
}) {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as AppNode;

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

  const value = node?.data?.inputs?.[param.name];

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
