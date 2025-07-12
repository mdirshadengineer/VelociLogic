"use client";

import React, { useId } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { getUserCredentials } from "src/actions/credentials";

/**
 * Parameter component for selecting user credentials in a workflow node.
 * Fetches credentials and renders a select dropdown.
 * @param param - The parameter object
 * @param updateNodeParamValue - Callback to update the node parameter value
 * @param value - The current value of the parameter
 */
function CredentialsParam({ param, updateNodeParamValue, value }: ParamProps) {
  const id = useId();

  const query = useQuery({
    queryKey: ["credentials-for-user"],
    queryFn: getUserCredentials,
    refetchInterval: 10000,
  });

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
            <SelectLabel>Credentials</SelectLabel>
            {query.data?.map((credential: any) => (
              <SelectItem key={credential.id} value={credential.id}>
                {credential.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default CredentialsParam;
