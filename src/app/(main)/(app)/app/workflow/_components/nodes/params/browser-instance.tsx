"use client";

import React from "react";
import { ParamProps } from "src/lib/types";

/**
 * Renders a parameter label for a browser instance in a workflow node.
 * @param param - The parameter object containing the name
 */
function BrowserInstance({ param }: ParamProps) {
  return <p className="text-xs">{param.name}</p>;
}

export default BrowserInstance;
