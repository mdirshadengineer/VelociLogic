"use client";
import { ParamProps } from "src/lib/types";
import React from "react";

function BrowserInstance({ param }: ParamProps) {
  return <p className="text-xs">{param.name}</p>;
}

export default BrowserInstance;
