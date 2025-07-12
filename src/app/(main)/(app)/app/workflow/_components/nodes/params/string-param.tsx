"use client";

import React, { useEffect, useId, useState } from "react";
import { Input } from "shared/ui/input";
import { Label } from "shared/ui/label";
import { Textarea } from "shared/ui/textarea";
import { ParamProps } from "src/lib/types";

/**
 * Parameter component for entering a string value in a workflow node.
 * Supports both input and textarea variants.
 * @param param - The parameter object
 * @param value - The current value of the parameter
 * @param updateNodeParamValue - Callback to update the node parameter value
 * @param disabled - Whether the input is disabled
 */
function StringParam({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value ?? "");

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  const InputComponent = param.variant === "textarea" ? Textarea : Input;

  return (
    <div className="space-y-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <span className="text-red-400 px-2">*</span>}
      </Label>
      <InputComponent
        id={id}
        className="text-xs"
        value={internalValue}
        placeholder="Enter value here"
        onBlur={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => updateNodeParamValue && updateNodeParamValue(e.target.value)}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => setInternalValue(e.target.value)}
        disabled={disabled}
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
}

export default StringParam;
