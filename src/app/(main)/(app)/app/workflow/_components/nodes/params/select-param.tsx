"use client";

import React, { useId } from "react";
import { Label } from "shared/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "shared/ui/select";
import { ParamProps } from "src/lib/types";

interface OptionType {
  label: string;
  value: string;
}

/**
 * Parameter component for selecting an option from a list in a workflow node.
 * Renders a select dropdown with provided options.
 * @param param - The parameter object
 * @param updateNodeParamValue - Callback to update the node parameter value
 * @param value - The current value of the parameter
 */
function SelectParam({ param, updateNodeParamValue, value }: ParamProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <span className="text-red-400 px-2">*</span>}
      </Label>
      <Select onValueChange={updateNodeParamValue} value={value}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {param.options.map((option: OptionType) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectParam;
